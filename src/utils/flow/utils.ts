import type DirectedGraph from 'graphology';
import type { Node } from 'reactflow';

export const defaultIncrementY = 200;
export const defaultIncrementX = 350;

const doShift =
  (direction: 'start' | 'end') =>
  (nodeIds: string[], shiftedGraph: DirectedGraph, multi: boolean) => {
    nodeIds.forEach((node) => {
      const { position } = shiftedGraph.getNodeAttributes(node);
      let increment = 0;
      if (multi) {
        increment = defaultIncrementX / 2;
      } else {
        increment = defaultIncrementX / 1;
      }

      if (direction === 'start') {
        increment = -increment;
      }

      shiftedGraph.mergeNodeAttributes(node, {
        position: { x: position.x + increment, y: position.y },
      });
    });

    return shiftedGraph;
  };

export const shiftTowards = { start: doShift('start'), end: doShift('end') };

const shiftNode =
  (methods: 'inwards' | 'outwards') =>
  (inbound: string[], outbound: string[], shiftedGraph: DirectedGraph) => {
    if (methods === 'inwards') {
      shiftTowards.start(outbound, shiftedGraph, true);
      shiftTowards.end(inbound, shiftedGraph, true);
    } else {
      shiftTowards.start(inbound, shiftedGraph, true);
      shiftTowards.end(outbound, shiftedGraph, true);
    }

    return shiftedGraph;
  };

export const shift = {
  inwards: shiftNode('inwards'),
  outwards: shiftNode('outwards'),
};

export const fetchLinkList = (id: string, graph: DirectedGraph) => {
  // 1. the graph must always have one node.
  // 2. if the graph has more than one node, all nodes must have at least one edge.
  // 3. nodes can only have max 2 edges (one in, one out)
  // this function returns all the nodes in the in and out directions of the node with id
  // the graph is directed so we need to check both in and out edges. return only one value for each node

  // the following function allows us to to use recursion to get all the nodes in the in direction of the node with id
  const getInNodes = (id: string, inNodes: string[] = []): string[] => {
      const inEdges = graph.inEdges(id);
      if (inEdges.length === 0) {
        return inNodes;
      }
      const inEdge = inEdges[0];
      const source = graph.source(inEdge);
      inNodes.push(source);
      return getInNodes(source, inNodes);
    },
    // the following function allows us to to use recursion to get all the nodes in the out direction of the node with id
    getOutNodes = (id: string, outNodes: string[] = []): string[] => {
      const outEdges = graph.outEdges(id);
      if (outEdges.length === 0) {
        return outNodes;
      }
      const outEdge = outEdges[0];
      const target = graph.target(outEdge);
      outNodes.push(target);
      return getOutNodes(target, outNodes);
    };

  const inNodes = getInNodes(id);
  const outNodes = getOutNodes(id);
  return { inbound: inNodes, outbound: outNodes };
};

export const addNode = (node: Node, graph: DirectedGraph) => {
  const { id, position } = node;
  const data = { prompts: [''] };
  const type = 'prompt';
  graph.addNode(id, { data, position, type });

  return graph;
};

export const addEdge = (
  source: string,
  target: string,
  graph: DirectedGraph,
  attributes?: any
) => {
  graph.addDirectedEdge(source, target, { ...attributes });
  return graph;
};

export const removeEdge = (id: string, graph: DirectedGraph) => {
  graph.dropEdge(id);
  return graph;
};

export const removePrompt = (
  id: string,
  index: number,
  graph: DirectedGraph
) => {
  // each node must have at least one prompt
  if (graph.getNodeAttribute(id, 'data').prompts.length === 1) {
    return;
  }
  const prompts = graph.getNodeAttribute(id, 'data').prompts;
  prompts.splice(index, 1);
  graph.setNodeAttribute(id, 'data', { prompts });
  return graph;
};

export const addPrompt = (id: string, prompt = '', graph: DirectedGraph) => {
  const prompts = graph.getNodeAttribute(id, 'data').prompts;
  prompts.push(prompt);
  graph.setNodeAttribute(id, 'data', { prompts });
  return graph;
};

export const updatePrompt = (
  id: string,
  prompt: string,
  index: number,
  graph: DirectedGraph
) => {
  const prompts = graph.getNodeAttribute(id, 'data').prompts;
  prompts[index] = prompt;
  graph.setNodeAttribute(id, 'data', { prompts });
  return graph;
};
