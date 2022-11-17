import DirectedGraph from 'graphology';
export const saveGraph = (graph: DirectedGraph) => {
  const exportGraph = graph.export();
  localStorage.setItem('prompt-engine-nodes', JSON.stringify(exportGraph));
};

// function to load the graph from local storage
export const loadGraph = () => {
  const graph = new DirectedGraph();
  const graphForImport = localStorage.getItem('prompt-engine-nodes');
  if (graphForImport) {
    const parsedGraph = JSON.parse(graphForImport);
    graph.import(parsedGraph);
  }
  return graph;
};
