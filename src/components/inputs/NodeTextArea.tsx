import { Label, Textarea } from 'flowbite-react';
import { useRef } from 'react';

// import uuid version 4
import clsxm from '@/utils/clsxm';

type NodeTextAreaProps = {
  nodeId: string;
  promptSegment?: string;
  index: number;
  onRemove: (index: number) => void;
  onChange: (
    evt: React.ChangeEvent<HTMLTextAreaElement>,
    index: number
  ) => void;
  canDelete?: boolean;
};

const NodeTextArea: React.FC<NodeTextAreaProps> = ({
  nodeId,
  promptSegment = '',
  index,
  onRemove,
  onChange,
  canDelete = false,
}) => {
  const key = `node-${nodeId}-promptSegment-${index}`;
  const ref = useRef<HTMLTextAreaElement>(null);

  return (
    <div className='group/promptSegment relative min-w-[300px] '>
      <Label
        htmlFor={`${key}-textarea`}
        value='Enter PromptSegment'
        className='sr-only'
      />
      <Textarea
        className=' min-h-[200px] rounded-sm !border-gray-300 !bg-white !text-sm hover:!border-green-400'
        id={`${key}-textarea`}
        placeholder='Enter your prompt segment...'
        color='gray'
        onChange={(evt) => onChange(evt, index)}
        value={promptSegment}
        ref={ref}
      />
      <button
        aria-label='Delete promptSegment'
        className={clsxm(
          'absolute inset-x-0 bottom-2 flex cursor-pointer items-center justify-center opacity-0 transition-all duration-200 group-hover/promptSegment:opacity-100 group-focus/promptSegment:hidden',
          {
            hidden: !canDelete,
          }
        )}
        onClick={() => onRemove(index)}
      >
        <p
          className='flex h-6 w-6 items-center justify-center rounded-full bg-gray-800 text-xl text-white'
          aria-hidden='true'
        >
          -
        </p>
        <span className='sr-only'>Delete promptSegment</span>
      </button>
    </div>
  );
};

export default NodeTextArea;
