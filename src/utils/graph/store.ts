import DirectedGraph from 'graphology';
import { topologicalSort } from 'graphology-dag';
import type { Edge, EdgeChange, Node, NodeChange, XYPosition } from 'reactflow';
import { applyEdgeChanges } from 'reactflow';
import { applyNodeChanges } from 'reactflow';
// import uuid
import { v4 as uuidv4 } from 'uuid';
import create from 'zustand';

import 'reactflow/dist/style.css';

export const minNodeWidth = 340;

export const graphDefaults = {
  axis: 'y' as 'x' | 'y',
  node: {
    increment: 350,
    promptSegment: {
      width: minNodeWidth,
      addWidth: 310,
    },
    position: {
      x: -Math.ceil(minNodeWidth / 2),
      y: 0,
    },
    type: {
      default: 'promptSegment',
    },
  },
};

export type direction = 'up' | 'down' | 'left' | 'right';

export const buildStarterGraph = () => {
  const graph = new DirectedGraph();
  graph.addNode('a_' + uuidv4(), {
    data: { promptSegments: [''] },
    position: {
      x: graphDefaults.node.position.x,
      y: graphDefaults.node.position.y,
    },
    type: graphDefaults.node.type.default,
  });
  return graph;
};

const starterGraph = buildStarterGraph();

export type promptSegment = {
  segment: string;
  index: number;
  nodeId: string;
};

const fetchPrompts = (graph: DirectedGraph): promptSegment[][] => {
  const sortedNodeIds = topologicalSort(graph);
  const nodePromptSegments: Record<string, promptSegment[][]> = {};

  sortedNodeIds.forEach((nodeId) => {
    const node = graph.getNodeAttributes(nodeId);
    if (node?.data?.promptSegments) {
      const promptSegments: promptSegment[] = [];
      node.data.promptSegments.forEach((segmentText: string, index: number) => {
        promptSegments.push({
          segment: segmentText.trim(),
          index: index,
          nodeId: nodeId,
        });
      });
      nodePromptSegments[nodeId] = [promptSegments];
    }
  });

  const prompts: promptSegment[][] = [];

  const recurse = (nodeId: string, promptSegments: promptSegment[]) => {
    const node = graph.getNodeAttributes(nodeId);
    if (node?.data?.promptSegments) {
      node.data.promptSegments.forEach((segmentText: string, index: number) => {
        const newPromptSegments = [...promptSegments];
        newPromptSegments.push({
          segment: segmentText,
          index: index,
          nodeId: nodeId,
        });
        const nextNode = graph.outNeighbors(nodeId);
        if (nextNode[0]) {
          recurse(nextNode[0], newPromptSegments);
        } else {
          prompts.push(newPromptSegments);
        }
      });
    }
  };

  sortedNodeIds[0] ? recurse(sortedNodeIds[0], []) : null;

  return prompts;
};

export const useGraphStore = create<RFState>((set, get) => ({
  graph: starterGraph,

  prompts: () => fetchPrompts(get().graph),
  reactFlow: {
    nodes: () => reactFlowNodes(get().graph),
    edges: () => reactFlowEdges(get().graph),
    onEdgeChanges: (changes: EdgeChange[]) => {
      set((state) => ({
        graph: mergeChanges.edges(changes, state.graph),
      }));
    },
    onNodeChanges: (changes: NodeChange[]) => {
      set((state) => ({
        graph: mergeChanges.nodes(changes, state.graph),
      }));
    },
  },
  add: {
    promptSegment: (nodeId: string) => {
      const graph = get().graph;
      const promptSegments = [
        ...graph.getNodeAttribute(nodeId, 'data').promptSegments,
        '',
      ] as string[];

      const nodePosition = centerXAxis(
        graph.getNodeAttribute(nodeId, 'position'),
        promptSegments.length
      );

      graph.mergeNodeAttributes(nodeId, {
        data: { promptSegments },
        position: nodePosition,
      });

      set({ graph: graph });
    },
    node: (sourceId: string, direction: direction) => {
      const graph = get().graph;
      const sourcePosition = graph.getNodeAttribute(sourceId, 'position');

      const sourceNode = {
        inNeighborId: graph.inNeighbors(sourceId)[0],
        outNeighborId: graph.outNeighbors(sourceId)[0],
      };

      const newNodeId = uuidv4();
      const newNode = {
        id: newNodeId,
        data: { promptSegments: [''] },
        position: shift(
          direction,
          sourcePosition,
          graphDefaults.node.increment
        ),
        type: graphDefaults.node.type.default,
      };
      if (direction === 'up') {
        graph.addNode(newNodeId, newNode);
        graph.addEdge(newNodeId, sourceId);
        if (sourceNode.inNeighborId) {
          graph.addEdge(sourceNode.inNeighborId, newNodeId);
          graph.dropEdge(sourceNode.inNeighborId, sourceId);
        }
      } else if (direction === 'down') {
        graph.addNode(newNodeId, newNode);
        graph.addEdge(sourceId, newNodeId);
        if (sourceNode.outNeighborId) {
          graph.addEdge(newNodeId, sourceNode.outNeighborId);
          graph.dropEdge(sourceId, sourceNode.outNeighborId);
        }
      }

      get().update.layout.nodes(graph);
    },
  },
  update: {
    promptSegment: (nodeId: string, segment: string, index: number) => {
      const graph = get().graph;
      const promptSegments = graph.getNodeAttribute(nodeId, 'data')
        .promptSegments as string[];
      promptSegments[index] = segment;
      graph.setNodeAttribute(nodeId, 'data', { promptSegments });
      set({ graph: graph });
    },
    layout: {
      nodes: (graph: DirectedGraph) => {
        const sortedNodeIds = topologicalSort(graph);

        const startNodePosition = graph.getNodeAttribute(
          sortedNodeIds[0],
          'position'
        );

        sortedNodeIds.forEach((nodeId, index) => {
          if (nodeId !== sortedNodeIds[0]) {
            const numSegments = graph.getNodeAttribute(nodeId, 'data')
              .promptSegments.length as number;

            const nodePosition = centerXAxis(
              shift(
                'down',
                startNodePosition,
                graphDefaults.node.increment * index
              ),
              numSegments
            );

            graph.setNodeAttribute(nodeId, 'position', nodePosition);
          } else {
            const numSegments = graph.getNodeAttribute(nodeId, 'data')
              .promptSegments.length as number;

            graph.setNodeAttribute(
              nodeId,
              'position',
              centerXAxis(startNodePosition, numSegments)
            );
          }
        });

        set({ graph: graph });
      },
    },
    graph: {
      set: (graph: DirectedGraph) => {
        set({ graph: graph });
      },
      reset: () => {
        set({ graph: buildStarterGraph() });
      },
    },
  },
  remove: {
    promptSegments: (nodeId: string, index: number) => {
      const graph = get().graph;
      const promptSegments = graph.getNodeAttribute(
        nodeId,
        'data'
      ).promptSegments;
      promptSegments.splice(index, 1);

      const nodePosition = centerXAxis(
        graph.getNodeAttribute(nodeId, 'position'),
        promptSegments.length
      );

      graph.mergeNodeAttributes(nodeId, {
        data: { promptSegments },
        position: nodePosition,
      });
      set({ graph: graph });
    },
    node: (nodeId: string) => {
      const graph = get().graph;
      const inNeighbors = graph.inNeighbors(nodeId)[0];
      const outNeighbors = graph.outNeighbors(nodeId)[0];

      inNeighbors &&
        outNeighbors &&
        graph.addDirectedEdge(inNeighbors, outNeighbors);

      graph.dropNode(nodeId);

      get().update.layout.nodes(graph);
    },
  },
}));

type RFState = {
  graph: DirectedGraph;
  prompts: () => promptSegment[][];
  reactFlow: {
    nodes: () => Node[];
    edges: () => Edge[];
    onNodeChanges: (changes: NodeChange[]) => void;
    onEdgeChanges: (changes: EdgeChange[]) => void;
  };
  add: {
    promptSegment: (nodeId: string) => void;
    node: (sourceId: string, direction: direction) => void;
  };
  update: {
    graph: {
      set: (graph: DirectedGraph) => void;
      reset: () => void;
    };
    promptSegment: (nodeId: string, segment: string, index: number) => void;
    layout: {
      nodes: (graph: DirectedGraph) => void;
    };
  };
  remove: {
    promptSegments: (nodeId: string, index: number) => void;
    node: (nodeId: string) => void;
  };
};

export type GraphologyNode = {
  id: string;
  attributes: Node<Omit<Node, 'id'>>;
};

export type GraphologyEdge = {
  id: string;
  source: string;
  target: string;
  attributes: Record<string, unknown>;
};

export const reactFlowEdges = (graph: DirectedGraph) => {
  return graph.mapEdges((id, attributes, target, source) =>
    mapEdgeAttrToRF(id, source, target, attributes)
  ) as Edge[];
};

export const reactFlowNodes = (graph: DirectedGraph) => {
  return graph.mapNodes((id, attributes) => {
    // check if attributes.node exists
    return {
      id,
      ...attributes,
    };
  }) as Node[];
};

const shift = (direction: direction, position: XYPosition, amount: number) => {
  switch (direction) {
    case 'up':
      return { x: position.x, y: position.y - amount };
    case 'down':
      return { x: position.x, y: position.y + amount };
    case 'left':
      return { x: position.x - amount, y: position.y };
    case 'right':
      return { x: position.x + amount, y: position.y };
  }
};

const mergeNodeChanges = (
  changes: NodeChange[],
  graph: DirectedGraph
): DirectedGraph => {
  const nodes = reactFlowNodes(graph);
  const newNodes = applyNodeChanges(changes, nodes);

  newNodes.forEach((node) => {
    graph.mergeNodeAttributes(node.id, node);
  });

  return graph;
};

const mergeEdgeChanges = (
  changes: EdgeChange[],
  graph: DirectedGraph
): DirectedGraph => {
  const edges = reactFlowEdges(graph);
  const newEdges = applyEdgeChanges(changes, edges);

  newEdges.forEach((edge) => {
    graph.mergeEdgeAttributes(edge.id, edge);
  });

  return graph;
};

export const mergeChanges = {
  nodes: mergeNodeChanges,
  edges: mergeEdgeChanges,
};

const mapEdgeAttrToRF = (
  id: GraphologyEdge['id'],
  source: GraphologyEdge['source'],
  target: GraphologyEdge['target'],
  attributes: GraphologyEdge['attributes']
) => {
  return {
    id: id,
    source: source,
    target: target,
    ...attributes,
  };
};

const centerXAxis = (position: XYPosition, promptSegmentCount: number) => {
  const totalWidth =
    graphDefaults.node.promptSegment.width +
    graphDefaults.node.promptSegment.addWidth * (promptSegmentCount - 1);
  const shift = totalWidth / 2;
  return {
    x: -shift,
    y: position.y,
  };
};
