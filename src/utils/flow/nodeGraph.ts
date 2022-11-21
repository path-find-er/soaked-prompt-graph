import DirectedGraph from 'graphology';
import type { Edge, Node } from 'reactflow';
import { v4 as uuidv4 } from 'uuid';
import create from 'zustand';

import 'reactflow/dist/style.css';

import { defaultIncrementX, defaultX } from './utils';
import {
  addPromptSegment,
  fetchLinkList,
  removePromptSegment,
  shift,
  shiftTowards,
  updatePromptSegment,
} from './utils';

const starterGraph = new DirectedGraph();

starterGraph.addNode('a', {
  data: { promptSegments: [''] },
  position: { x: -defaultX + defaultIncrementX * 0, y: 0 },
  type: 'promptSegment',
});

export const useNodeStore = create<RFState>((set, get) => ({
  graph: starterGraph,
  setGraph: (graph: DirectedGraph) => set({ graph }),
  reactFlowNodes: () => {
    const nodes: Node[] = [];
    get().graph.forEachNode((node, attributes) => {
      nodes.push({
        id: node,
        data: attributes.data,
        position: attributes.position,
        type: attributes.type,
      });
    });
    return nodes;
  },
  reactFlowEdges: () => {
    const edges: Edge[] = [];
    get().graph.forEachEdge((edge, attributes, source, target) => {
      edges.push({
        id: edge,
        source: source,
        target: target,
        ...attributes,
      });
    });
    return edges;
  },

  removeNode: (id: string) => {
    const graph = get().graph;
    if (graph.order === 1) {
      return;
    }

    const { inbound, outbound } = fetchLinkList(id, graph);
    if (inbound.length > 0 && outbound.length > 0) {
      graph.addDirectedEdge(inbound[0], outbound[0]);
      const newGraph = shift.inwards(inbound, outbound, graph);

      graph.dropNode(id);
      set({ graph: newGraph });
    } else {
      graph.dropNode(id);
      set({ graph });
    }
  },

  updatePromptSegment: (id: string, promptSegment: string, index: number) => {
    set({ graph: updatePromptSegment(id, promptSegment, index, get().graph) });
  },

  removePromptSegment: (id: string, index: number) => {
    set({ graph: removePromptSegment(id, index, get().graph) });
  },

  addPromptSegment: (id: string, promptSegment = '') => {
    set({ graph: addPromptSegment(id, promptSegment, get().graph) });
  },

  resetGraph: () => {
    // if the graph has more than one node, clear it
    if (get().graph.order > 1) {
      set({ graph: starterGraph });
    }
  },

  handleAddNode: (direction: 'start' | 'end', baseNodeId: string) => {
    const graph = get().graph;

    const baseNodePos = graph.getNodeAttribute(baseNodeId, 'position');

    const newNode = {
      id: uuidv4(),
      atritbutes: {
        data: { promptSegments: [''] },
        type: 'promptSegment',
        position: {
          x: -defaultX,
          y: baseNodePos.y,
        },
      },
    };

    graph.addNode(newNode.id, newNode.atritbutes);
    const { inbound, outbound } = fetchLinkList(baseNodeId, graph);

    if (direction === 'start') {
      if (inbound.length > 0) {
        graph.dropEdge(inbound[0], baseNodeId);
        graph.addDirectedEdge(inbound[0], newNode.id);
      }
      graph.addDirectedEdge(newNode.id, baseNodeId);
      inbound.unshift(newNode.id);
      const newGraph = shiftTowards.start(inbound, graph, false);
      set({ graph: newGraph });
    } else {
      // check if there are any outbound nodes
      if (outbound.length > 0) {
        // update the edge between the base node and the first outbound node
        graph.dropEdge(baseNodeId, outbound[0]);
        graph.addDirectedEdge(newNode.id, outbound[0]);
      }
      graph.addDirectedEdge(baseNodeId, newNode.id);
      outbound.unshift(newNode.id);
      const newGraph = shiftTowards.end(outbound, graph, false);
      set({ graph: newGraph });
    }
  },
  fetchPrompts: () => {
    return fetchPrompts(get().graph);
  },
}));

type RFState = {
  graph: DirectedGraph;
  setGraph: (graph: DirectedGraph) => void;
  resetGraph: () => void;
  reactFlowNodes: () => Node[];
  reactFlowEdges: () => Edge[];
  updatePromptSegment: (
    id: string,
    promptSegment: string,
    index: number
  ) => void;
  removePromptSegment: (id: string, index: number) => void;
  addPromptSegment: (id: string, promptSegment?: string) => void;
  removeNode: (id: string) => void;
  handleAddNode: (direction: 'start' | 'end', baseNodeId: string) => void;
  fetchPrompts: () => string[];
};

// 1. each node can contain multiple promptSegments stored at attributes.data.promptSegments in an array
// 2. each node can have multiple inbound and outbound edges
// 3. every node must have at least one promptSegment
// 4. every concat promptSegments path must start with a node that has no inbound edges and end with a node that has no outbound edges { if there is only one node in the graph, it is both the start and end node }
// 5. every concat promptSegments path is a single path, through the graph, and concatenates all promptSegments in the order of the path but only one from each node

// define a function that takes in the graph and uses recursion to find all paths from the start node to the end node
// it returns an array of every paths concatenated string

const fetchPrompts = (graph: DirectedGraph) => {
  const startNodeId = graph.nodes().find((node) => {
    return graph.inDegree(node) === 0;
  });

  if (!startNodeId) {
    return [];
  }

  const startNodePromptSegments = graph.getNodeAttribute(
    startNodeId,
    'data'
  ).promptSegments;

  const fetchPrompts = (nodeId: string, promptSegments: string[]): string[] => {
    const outboundEdge = graph.outEdges(nodeId)[0];

    if (!outboundEdge) {
      return promptSegments.map((promptSegment) => promptSegment.trim());
    }

    const targetNodeId = graph.target(outboundEdge);

    const targetNodePromptSegments = graph.getNodeAttribute(
      targetNodeId,
      'data'
    ).promptSegments;

    const newPromptSegments = concatPromptSegments(
      promptSegments,
      targetNodePromptSegments
    );

    return fetchPrompts(targetNodeId, newPromptSegments);
  };

  return fetchPrompts(startNodeId, startNodePromptSegments);
};

const concatPromptSegments = (
  oldNodePromptSegments: string[],
  newNodePromptSegments: string[]
) => {
  const newPromptSegments: string[] = [];

  for (let i = 0; i < oldNodePromptSegments.length; i++) {
    for (let j = 0; j < newNodePromptSegments.length; j++) {
      newPromptSegments.push(
        oldNodePromptSegments[i] + ' ' + newNodePromptSegments[j]
      );
    }
  }
  return newPromptSegments;
};
