import { useEffect, useState } from 'react'
// import AiFillMinusCircle
import { Position } from 'reactflow'

import 'reactflow/dist/base.css'

// import uuidv4
import clsxm from '@/utils/clsxm'
import { useGraphStore } from '@/utils/graph/store'

import type { nodeProps } from './types'
import CustomHandle from '../Handles'

export const ArrayNode: React.FC<nodeProps> = ({ data, id, className }) => {
  const { graph, update, add, remove, prompts } = useGraphStore()

  const [hideDelete, setHideDelete] = useState(graph.order > 1)

  const promptSegments = prompts.promptSegments(id)

  // State to store parsed data
  const [parsedData, setParsedData] = useState([])

  //State to store table Column name
  const [tableRows, setTableRows] = useState([])

  //State to store the values
  const [values, setValues] = useState([])

  useEffect(() => {
    setHideDelete(graph.order > 1)
  }, [graph.order])

  // const onChange = useCallback(
  //   (evt: { target: { value: string } }, index: number) => {

  //   },
  //   [id, update]
  // )

  /*
  export type promptSegment = {
  segment: string
  index: number
  nodeId: string
}
 */
  return (
    <div className={clsxm('group/node relative', className)} id={id}>
      {/* <div className=' flex flex-row space-x-[10px] rounded-xl bg-gray-100 p-[20px]'>
        <input name='file' accept='.csv' type='file' />
      </div>

      <table>
        <thead>
          <tr>
            {tableRows.map((rows, index) => {
              return <th key={index}>{rows}</th>
            })}
          </tr>
        </thead>
        <tbody>
          {values.map((value, index) => {
            return (
              <tr key={index}>
                {value.map((val, i) => {
                  return <td key={i}>{val}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </table> */}

      <CustomHandle
        type='source'
        position={Position.Top}
        id={`${id}`}
        onClick={() => add.node(id, 'up')}
      />
      <button
        aria-label='Add PromptSegment'
        className='absolute inset-y-[20px] right-0 flex w-5 cursor-pointer items-center justify-center rounded-r-md bg-green-200 text-black'
        onClick={() => add.promptSegment(id)}
      >
        <span aria-label='Add PromptSegment'>+</span>
      </button>

      <button
        aria-label='Delete Node'
        className={clsxm(
          'absolute left-0 top-0 flex h-[20px] w-[20px] cursor-pointer justify-center rounded-full bg-red-900 text-white opacity-0 transition-all duration-200 group-hover/node:opacity-100',
          {
            hidden: !hideDelete,
          }
        )}
        onClick={() => remove.node(id)}
      >
        <span aria-label='Remove Node'> - </span>
      </button>

      <CustomHandle
        type='target'
        position={Position.Bottom}
        id={`${id}`}
        onClick={() => add.node(id, 'down')}
      />
    </div>
  )
}
