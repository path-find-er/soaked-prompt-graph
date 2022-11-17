import { useCallback, useEffect, useState } from 'react';
import { AiFillMinusCircle } from 'react-icons/ai';
// import AiFillMinusCircle
import type { NodeTypes } from 'reactflow';
import { Position } from 'reactflow';

import 'reactflow/dist/base.css';

// import uuidv4
import clsxm from '@/utils/clsxm';
import { useNodeStore } from '@/utils/flow/nodeGraph';

import CustomHandle from './Handles';
import { TestArea } from '../input/TextAreaGroup';

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
    <div
      className={clsxm(
        'group/node relative rounded-xl bg-gray-100 p-4',
        className
      )}
    >
      <div className=''>
        <CustomHandle
          type='target'
          position={Position.Left}
          id={`${id}`}
          onClick={() => handleAddNode('start', id)}
        />

        <div id='textareas' className='flex flex-col'>
          {prompts
            ? prompts.map((prompt: string | undefined, index: number) => {
                return (
                  <TestArea
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

        {/* Add Delete button */}
        <button
          aria-label='Delete Node'
          className={clsxm(
            'prompts-center absolute top-1 right-1 flex cursor-pointer  justify-center opacity-0 transition-all duration-200 group-hover/node:opacity-100',
            {
              hidden: !hideDelete,
            }
          )}
          onClick={() => removeNode(id)}
        >
          <AiFillMinusCircle className='fill-red-800 text-3xl ' />
        </button>

        {/* Add Prompt button */}
        <button
          aria-label='Add Prompt'
          className='mx-auto flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-green-300 text-white'
          onClick={() => addPrompt(id)}
        >
          <span aria-label='Add Prompt'>+</span>
        </button>

        <CustomHandle
          type='source'
          position={Position.Right}
          id={`${id}`}
          onClick={() => handleAddNode('end', id)}
        />
      </div>
    </div>
  );
};

export default PrompNode;

export const nodeTypes = {
  prompt: PrompNode,
} as NodeTypes;
