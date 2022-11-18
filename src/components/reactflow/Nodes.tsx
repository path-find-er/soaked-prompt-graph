import { useCallback, useEffect, useState } from 'react';
// import AiFillMinusCircle
import type { NodeTypes } from 'reactflow';
import { Position } from 'reactflow';

import 'reactflow/dist/base.css';

// import uuidv4
import clsxm from '@/utils/clsxm';
import { useNodeStore } from '@/utils/flow/nodeGraph';

import CustomHandle from './Handles';
import TextAreaGroup from '../input/TextAreaGroup';

type nodePropsPrompt = {
  data: Record<string, string[]>;
  id: string;
  className?: string;
} & React.ComponentPropsWithoutRef<'div'>;

const PrompNode: React.FC<nodePropsPrompt> = ({ data, id, className }) => {
  const {
    graph,
    handleAddNode,
    removeNode,
    updatePrompt,
    addPrompt,
    removePrompt,
  } = useNodeStore();

  const [hideDelete, setHideDelete] = useState(graph.order > 1);

  const prompts = data.prompts;

  useEffect(() => {
    setHideDelete(graph.order > 1);
  }, [graph.order]);

  const onChange = useCallback(
    (evt: { target: { value: string } }, index: number) => {
      const { value } = evt.target;
      updatePrompt(id, value, index);
    },
    [updatePrompt, id]
  );

  return (
    <div className={clsxm('group/node relative', className)}>
      <div className=' flex flex-row space-x-[10px] rounded-xl bg-gray-100 p-[20px]'>
        {prompts
          ? prompts.map((prompt: string | undefined, index: number) => {
              return (
                <TextAreaGroup
                  key={`node-${id}-prompt-${index}`}
                  nodeId={id}
                  prompt={prompt}
                  index={index}
                  onRemove={removePrompt}
                  onChange={onChange}
                  canDelete={prompts.length > 1}
                />
              );
            })
          : null}
      </div>

      <CustomHandle
        type='target'
        position={Position.Top}
        id={`${id}`}
        onClick={() => handleAddNode('start', id)}
      />
      <button
        aria-label='Add Prompt'
        className='absolute inset-y-[20px] right-0 flex w-5 cursor-pointer items-center justify-center rounded-r-md bg-green-400 text-white'
        onClick={() => addPrompt(id)}
      >
        <span aria-label='Add Prompt'>+</span>
      </button>

      <button
        aria-label='Delete Node'
        className={clsxm(
          'absolute left-0 top-0 flex h-[20px] w-[20px] cursor-pointer justify-center rounded-full bg-red-900 text-white opacity-0 transition-all duration-200 group-hover/node:opacity-100',
          {
            hidden: !hideDelete,
          }
        )}
        onClick={() => removeNode(id)}
      >
        <span aria-label='Remove Node'> - </span>
      </button>

      <CustomHandle
        type='source'
        position={Position.Bottom}
        id={`${id}`}
        onClick={() => handleAddNode('end', id)}
      />
    </div>
  );
};

export default PrompNode;

export const nodeTypes = {
  prompt: PrompNode,
} as NodeTypes;
