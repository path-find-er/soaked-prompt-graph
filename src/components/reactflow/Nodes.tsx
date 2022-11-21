import { useCallback, useEffect, useState } from 'react';
// import AiFillMinusCircle
import type { NodeTypes } from 'reactflow';
import { Position } from 'reactflow';

import 'reactflow/dist/base.css';

// import uuidv4
import clsxm from '@/utils/clsxm';
import type { direction } from '@/utils/graph/store';
import { useGraphStore } from '@/utils/graph/store';

import CustomHandle from './Handles';
import NodeTextArea from '../inputs/NodeTextArea';

type nodePropsPromptSegment = {
  data: Record<string, string[]>;
  id: string;
  className?: string;
} & React.ComponentPropsWithoutRef<'div'>;

const SegmentNode: React.FC<nodePropsPromptSegment> = ({
  data,
  id,
  className,
}) => {
  const { graph, update, add, remove } = useGraphStore();

  const [hideDelete, setHideDelete] = useState(graph.order > 1);

  const promptSegments = data.promptSegments;

  useEffect(() => {
    setHideDelete(graph.order > 1);
  }, [graph.order]);

  const onChange = useCallback(
    (evt: { target: { value: string } }, index: number) => {
      const { value } = evt.target;
      update.promptSegment(id, value, index);
    },
    [id, update]
  );

  const handleRemoveSegmentTextArea = (index: number) => {
    remove.promptSegments(id, index);
  };
  const handleAddSegmentTextArea = () => {
    add.promptSegment(id);
  };

  const handleAddNode = (direction: direction) => {
    add.node(id, direction);
  };

  const handleRemoveNode = () => {
    remove.node(id);
  };

  return (
    <div className={clsxm('group/node relative', className)} id={id}>
      <div className=' flex flex-row space-x-[10px] rounded-xl bg-gray-100 p-[20px]'>
        {promptSegments
          ? promptSegments.map(
              (promptSegment: string | undefined, index: number) => {
                return (
                  <NodeTextArea
                    key={`node-${id}-promptSegment-${index}`}
                    nodeId={id}
                    promptSegment={promptSegment}
                    index={index}
                    onRemove={handleRemoveSegmentTextArea}
                    canDelete={promptSegments.length > 1}
                    onChange={onChange}
                  />
                );
              }
            )
          : null}
      </div>

      <CustomHandle
        type='source'
        position={Position.Top}
        id={`${id}`}
        onClick={() => handleAddNode('up')}
      />
      <button
        aria-label='Add PromptSegment'
        className='absolute inset-y-[20px] right-0 flex w-5 cursor-pointer items-center justify-center rounded-r-md bg-green-400 text-white'
        onClick={handleAddSegmentTextArea}
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
        onClick={handleRemoveNode}
      >
        <span aria-label='Remove Node'> - </span>
      </button>

      <CustomHandle
        type='target'
        position={Position.Bottom}
        id={`${id}`}
        onClick={() => handleAddNode('down')}
      />
    </div>
  );
};

export default SegmentNode;

export const nodeTypes = {
  promptSegment: SegmentNode,
} as NodeTypes;
