import { Label, Textarea } from 'flowbite-react';
import { useState } from 'react';

// import uuid version 4
import clsxm from '@/utils/clsxm';

type TestAreaProps = {
  nodeId: string;
  prompt?: string;
  index: number;
  onRemove: (nodeId: string, index: number) => void;
  onChange: (
    evt: React.ChangeEvent<HTMLTextAreaElement>,
    index: number
  ) => void;
  canDelete?: boolean;
};

export const TestArea: React.FC<TestAreaProps> = ({
  nodeId,
  prompt = '',
  index,
  onRemove,
  onChange,
  canDelete = false,
}) => {
  const key = `node-${nodeId}-prompt-${index}`;
  // if inxed = 0 then disable delete button
  const [hideDelete, setHideDelete] = useState(false);

  return (
    <div
      className='group/prompt relative transition-transform hover:scale-95'
      onMouseOver={() => setHideDelete(true)}
    >
      <button
        aria-label='Delete prompt'
        className={clsxm(
          'absolute inset-x-0 bottom-2 flex cursor-pointer items-center justify-center opacity-0 transition-all duration-200 group-hover/prompt:opacity-100 group-focus/prompt:hidden',
          {
            hidden: !canDelete,
          }
        )}
        onClick={() => onRemove(nodeId, index)}
      >
        <p
          className='flex h-6 w-6 items-center justify-center rounded-full bg-gray-800 text-xl text-white'
          aria-hidden='true'
        >
          -
        </p>
      </button>
      <Label
        htmlFor={`${key}-textarea`}
        value='Enter Prompt'
        className='sr-only'
      />
      <Textarea
        className='rounded-sm border-gray-300 !bg-white'
        id={`${key}-textarea`}
        placeholder='Enter your prompt...'
        rows={4}
        onChange={(evt) => onChange(evt, index)}
        defaultValue={prompt}
      />
    </div>
  );
};
