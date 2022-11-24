import DirectedGraph from 'graphology'

import { buildStarterGraph } from './graph/store'

export const localStorageGraphName = 'prompt-engine-nodes'
// function to load the graph from local storage
export const loadGraph = (name: string) => {
  try {
    const graph = new DirectedGraph()
    const graphForImport = localStorage.getItem(localStorageGraphName)
    if (graphForImport) {
      const parsedGraph = JSON.parse(graphForImport)
      const graphToImport = parsedGraph[name]
      graph.import(graphToImport)
    }
    return graph
  } catch (error) {
    return buildStarterGraph()
  }
}

export const saveGraph = (graph: DirectedGraph, name: string) => {
  // load the exisitng saved graphs
  const graphForImport = localStorage.getItem(localStorageGraphName)
  let parsedGraph: Record<string, unknown> = {}
  if (graphForImport) {
    parsedGraph = JSON.parse(graphForImport)
  }

  // add the new graph to the existing graphs
  parsedGraph[name] = graph.export()

  // save the new graph
  localStorage.setItem('prompt-engine-nodes', JSON.stringify(parsedGraph))
}

export const checkForGraph = (name: string) => {
  const graphForImport = localStorage.getItem(localStorageGraphName)
  if (graphForImport) {
    const parsedGraph = JSON.parse(graphForImport)
    return parsedGraph[name]
  }
  return false
}
