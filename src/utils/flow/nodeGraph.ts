import DirectedGraph from 'graphology';
import type { Edge, Node } from 'reactflow';
import { v4 as uuidv4 } from 'uuid';
import create from 'zustand';

import 'reactflow/dist/style.css';

import {
  addPrompt,
  defaultIncrementX,
  fetchLinkList,
  removePrompt,
  shift,
  shiftTowards,
  updatePrompt,
} from './utils';

const starterGraph = new DirectedGraph();

starterGraph.addNode('a', {
  data: { prompts: ['What were the'] },
  position: { x: 0, y: 0 },
  type: 'prompt',
});

starterGraph.addNode('b', {
  data: { prompts: ['implications', 'effects'] },
  position: { x: defaultIncrementX, y: 0 },
  type: 'prompt',
});

starterGraph.addNode('c', {
  data: { prompts: ['of the Spanish American war?'] },
  position: { x: defaultIncrementX * 2, y: 0 },
  type: 'prompt',
});

starterGraph.addNode('d', {
  data: { prompts: ['Explain in essay format', ''] },
  position: { x: defaultIncrementX * 3, y: 0 },
  type: 'prompt',
});

starterGraph.addDirectedEdgeWithKey('ab', 'a', 'b');
starterGraph.addDirectedEdgeWithKey('bc', 'b', 'c');
starterGraph.addDirectedEdgeWithKey('cd', 'c', 'd');

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

  updatePrompt: (id: string, prompt: string, index: number) => {
    set({ graph: updatePrompt(id, prompt, index, get().graph) });
  },

  removePrompt: (id: string, index: number) => {
    set({ graph: removePrompt(id, index, get().graph) });
  },

  addPrompt: (id: string, prompt = '') => {
    set({ graph: addPrompt(id, prompt, get().graph) });
  },

  handleAddNode: (direction: 'start' | 'end', baseNodeId: string) => {
    const graph = get().graph;

    const baseNodePos = graph.getNodeAttribute(baseNodeId, 'position');

    const newNode = {
      id: uuidv4(),
      atritbutes: {
        data: { prompts: [''] },
        type: 'prompt',
        position: {
          x: baseNodePos.x,
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
  fetchFullPrompts: () => {
    return fetchFullPrompts(get().graph).reverse();
  },
}));

type RFState = {
  graph: DirectedGraph;
  setGraph: (graph: DirectedGraph) => void;
  reactFlowNodes: () => Node[];
  reactFlowEdges: () => Edge[];
  updatePrompt: (id: string, prompt: string, index: number) => void;
  removePrompt: (id: string, index: number) => void;
  addPrompt: (id: string, prompt?: string) => void;
  removeNode: (id: string) => void;
  handleAddNode: (direction: 'start' | 'end', baseNodeId: string) => void;
  fetchFullPrompts: () => string[];
};

// 1. each node can contain multiple prompts stored at attributes.data.prompts in an array
// 2. each node can have multiple inbound and outbound edges
// 3. every node must have at least one prompt
// 4. every concat prompts path must start with a node that has no inbound edges and end with a node that has no outbound edges { if there is only one node in the graph, it is both the start and end node }
// 5. every concat prompts path is a single path, through the graph, and concatenates all prompts in the order of the path but only one from each node

// define a function that takes in the graph and uses recursion to find all paths from the start node to the end node
// it returns an array of every paths concatenated string

const fetchFullPrompts = (graph: DirectedGraph) => {
  // identify the start node
  const startNodeId = graph.nodes().find((node) => {
    return graph.inDegree(node) === 0;
  });

  if (!startNodeId) {
    return [];
  }

  // identify the prompts of the start node
  const startNodePrompts = graph.getNodeAttribute(startNodeId, 'data').prompts;

  // define a recursive function that takes in a node and returns an array of all paths from that node to the end node
  const fetchPrompts = (nodeId: string, prompts: string[]): string[] => {
    // identify the outbound edges of the node
    const outboundEdge = graph.outEdges(nodeId)[0];

    if (!outboundEdge) {
      // remove trailing whitespace
      return prompts.map((prompt) => prompt.trim());
    }

    const targetNodeId = graph.target(outboundEdge);
    const targetNodePrompts = graph.getNodeAttribute(
      targetNodeId,
      'data'
    ).prompts;

    // itterate through each prompt of the target node and concat it with each prompt of the current node
    const newPrompts = concatPrompts(prompts, targetNodePrompts);

    return fetchPrompts(targetNodeId, newPrompts);
  };

  return fetchPrompts(startNodeId, startNodePrompts);
};

const concatPrompts = (oldNodePrompts: string[], newNodePrompts: string[]) => {
  const newPrompts: string[] = [];

  for (let i = 0; i < oldNodePrompts.length; i++) {
    for (let j = 0; j < newNodePrompts.length; j++) {
      newPrompts.push(oldNodePrompts[i] + ' ' + newNodePrompts[j]);
    }
  }
  return newPrompts;
};

/*
  // identify the start node prompts
  const startNodePrompts = graph.getNodeAttribute(startNodeId, 'data').prompts;

  // identify the edge that connects the start node to the next node
  const outEdges = graph.outEdges(startNodeId);

  if (outEdges.length === 0) {
    return startNodePrompts;
  }

  const nextNodeId = graph.target(outEdges[0]);
  const nextNodePrompts = graph.getNodeAttribute(nextNodeId, 'data').prompts;

  // map each prompt in the start node to each prompt in the next node
  startNodePrompts.forEach((startPrompt: string) => {
    nextNodePrompts.forEach((nextPrompt: string) => {
      fullPrompts.push(startPrompt + ' ' + nextPrompt);
    });
  });

  */
