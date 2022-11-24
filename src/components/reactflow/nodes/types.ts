import type { NodeTypes } from 'reactflow'

import { ArrayNode } from './ArrayNode'
import SegmentNode from './SegmentNode'

export type nodeProps = {
  data: Record<string, string[]>
  id: string
  className?: string
} & React.ComponentPropsWithoutRef<'div'>

export const nodeTypes = {
  promptSegment: SegmentNode,
  array: ArrayNode,
} as NodeTypes
