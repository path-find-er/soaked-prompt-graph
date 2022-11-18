import { useId, useState } from 'react';

import clsxm from '@/utils/clsxm';
import { useNodeStore } from '@/utils/flow/nodeGraph';

type InlineTextInputProps = {
  prompt: string;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
} & React.ComponentPropsWithoutRef<'div'>;

export const avgCharWidth = 10;
export const avgCharHeight = 16;
export const avgSpaceWidth = 2;
const InlineTextInput: React.FC<InlineTextInputProps> = ({
  className,
  prompt,
  onChange,
}) => {
  const [inputValues, setInputValues] = useState([prompt]);
  const resizeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValues((prev) => {
      const newInputValues = [...prev];
      return newInputValues;
    });
    const inputContainerWidth = e.target.parentElement?.clientWidth;
    if (!inputContainerWidth) return;

    const style = e.target.style;
    const value = e.target.value;
    const numSpaces = (value.match(/ /g) || []).length;
    // const numLines = (value.match(/\n/g) || []).length;
    const numChars = (value.match(/./g) || []).length;

    // the max width of the input is the width of inputContainerWidth

    const newWidth =
      8 + Math.ceil(numChars * avgCharWidth + numSpaces * avgSpaceWidth);

    if (newWidth > inputContainerWidth) {
      style.width = `${inputContainerWidth}px`;
      setInputValues([...inputValues, '']);
    } else {
      style.width = `${newWidth}px`;
    }

    // handle onchange
    if (onChange) {
      onChange(e);
    }
  };

  const { graph, reactFlowNodes, updatePrompt } = useNodeStore();
  const id = useId();
  return (
    <div
      id={`${id}-input-countainer`}
      className={clsxm('h-full w-full', className)}
    >
      {inputValues.map((inputValue, i) => (
        <input
          key={i}
          id={`${id}-input`}
          type='textarea'
          defaultValue={prompt}
          onChange={resizeInput}
          className='m-0 border-none bg-gray-100 px-[4px] py-0  font-mono'
          style={{
            appearance: 'none',
            fontSize: `${avgCharHeight}px`,
            fontKerning: 'none',
            letterSpacing: '1px',
            wordSpacing: `${avgSpaceWidth}px`,
            // wrap the text
            whiteSpace: 'pre-wrap',
            // break the text
            wordBreak: 'break-word',
          }}
        />
      ))}
    </div>
  );
};

export default InlineTextInput;
