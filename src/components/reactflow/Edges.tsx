import React from 'react'
import type { EdgeTypes, Position } from 'reactflow'
import { getBezierPath } from 'reactflow'

const foreignObjectSize = 40

const onEdgeClick = (evt: React.MouseEvent, id: string) => {
  evt.stopPropagation()
  alert(`remove ${id}`)
}

type CustomEdgeProps = {
  id: string
  sourceX: number
  sourceY: number
  targetX: number
  targetY: number
  sourcePosition: Position
  targetPosition: Position
  markerEnd: string
  className?: string
} & React.ComponentPropsWithoutRef<'div'>

const CustomEdge: React.FC<CustomEdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  return (
    <>
      <path
        id={id}
        className='react-flow__edge-path'
        d={edgePath}
        markerEnd={markerEnd}
      />
      <foreignObject
        width={foreignObjectSize}
        height={foreignObjectSize}
        x={labelX - foreignObjectSize / 2}
        y={labelY - foreignObjectSize / 2}
        className='flex h-10 w-10 items-center justify-center bg-transparent
        shadow-2xl'
        requiredExtensions='http://www.w3.org/1999/xhtml'
      >
        <body>
          <button
            className='h-5 w-5 cursor-pointer rounded-full border border-solid border-white bg-gray-200 text-xs leading-none'
            onClick={(event) => onEdgeClick(event, id)}
          >
            +
          </button>
        </body>
      </foreignObject>
    </>
  )
}

export default CustomEdge

export const edgeTypes = {
  plus: CustomEdge,
} as EdgeTypes
