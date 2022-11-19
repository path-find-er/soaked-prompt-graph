import { useId, useState } from 'react';

import clsxm from '@/utils/clsxm';
import { useNodeStore } from '@/utils/flow/nodeGraph';

type InlineTextInputProps = {
  prompt: string;
  className?: string;
} & React.ComponentPropsWithoutRef<'div'>;

export const avgCharWidth = 10;
export const avgCharHeight = 16;
export const avgSpaceWidth = 2;
const InlineTextInput: React.FC<InlineTextInputProps> = ({
  className,
  prompt,
}) => {
  const [inputValues, setInputValues] = useState([prompt]);

  const handleOnChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    setInputValues((prev) => {
      const newValues = [...prev];
      newValues[index] = e.target.value;
      console.log(newValues);
      return newValues;
    });
    const inputContainerWidth = e.target.parentElement?.clientWidth;
    if (!inputContainerWidth) return;

    const style = e.target.style;
    const value = e.target.value;

    const numChars = (value.match(/./g) || []).length;
    const numSpaces = (value.match(/ /g) || []).length;

    const maxChars = Math.floor(inputContainerWidth / avgCharWidth);
    if (numChars < maxChars) {
      // calculate how max spaces we can fit
      const maxSpaces = Math.floor(
        (inputContainerWidth - numChars * avgCharWidth) / avgSpaceWidth
      );

      if (numSpaces < maxSpaces) {
        style.width = `${
          numChars * avgCharWidth + numSpaces * avgSpaceWidth
        }px`;
      } else {
        // split on the last valid space
        // const lastSpaceIndex =
        style.width = `${inputContainerWidth}px`;
      }
    }
    // const numLines = (value.match(/\n/g) || []).length;

    // the max width of the input is the width of inputContainerWidth

    const newWidth =
      8 + Math.ceil(numChars * avgCharWidth + numSpaces * avgSpaceWidth);

    if (newWidth > inputContainerWidth) {
      style.width = `${inputContainerWidth}px`;
      setInputValues([...inputValues, '']);
    } else {
      style.width = `${newWidth}px`;
    }
  };

  const { graph, reactFlowNodes, updatePrompt } = useNodeStore();
  const id = useId();
  return (
    <span
      id={`${id}-input-countainer`}
      className={clsxm('h-full w-full', className)}
    >
      {inputValues.map((inputValue, i) => (
        <input
          key={i}
          id={`${id}-input`}
          type='textarea'
          value={inputValue}
          onChange={(e) => handleOnChange(e, i)}
          className='m-1 border-none bg-primary-50 px-[4px] py-0  font-mono'
          style={{
            appearance: 'none',
            fontSize: `${avgCharHeight}px`,
            fontKerning: 'none',
            letterSpacing: '1px',
            wordSpacing: `${avgSpaceWidth}px`,
          }}
        />
      ))}
    </span>
  );
};

export default InlineTextInput;
