import type { Node } from 'reactflow'

export type promptSegment = {
  segment: string
  index: number
  nodeId: string
}
export type GraphologyNode = {
  id: string
  attributes: Node<Omit<Node, 'id'>>
}

export type GraphologyEdge = {
  id: string
  source: string
  target: string
  attributes: Record<string, unknown>
}
export type direction = 'up' | 'down' | 'left' | 'right'
