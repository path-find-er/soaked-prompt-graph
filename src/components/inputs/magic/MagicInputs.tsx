import { useState } from 'react';
import { usePopper } from 'react-popper';

import { useNodeStore } from '@/utils/flow/nodeGraph';
import type { promptSegment } from '@/utils/graph/store';

type MagicTextAreaProps = {
  promptSegment: promptSegment;
};

export const avgSpaceWidth = 2;

const MagicInputs: React.FC<MagicTextAreaProps> = ({ promptSegment }) => {
  // this component lets users edit promptSegments after they've been compiled into a prompt
  // th efirst iteration will be an overlay tiggered on click with a text area of the prompt segment that updates the global state on change
  // the background will turn primaty-50 on hover

  const { segment, index, nodeId } = promptSegment;

  const { updatePromptSegment } = useNodeStore();

  const handleUpdate = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updatePromptSegment(nodeId, e.target.value, index);
  };

  const [referenceElement, setReferenceElement] =
    useState<HTMLButtonElement | null>(null);

  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );

  const { styles, attributes } = usePopper(referenceElement, popperElement);

  return (
    <>
      <span className='m-1 !inline rounded-md bg-primary-50 bg-opacity-50 p-1 text-left  hover:bg-primary-100 '>
        {segment}
      </span>
      <div ref={setPopperElement} style={styles.popper} {...attributes.popper}>
        {/* <Textarea
          id={`textarea-${index}-${nodeId}`}
          rows={10}
          value={segment}
          onChange={handleUpdate}
        /> */}
      </div>
    </>
  );
};

export default MagicInputs;

/*
  Type 'Dispatch<SetStateAction<undefined>>' is not assignable to type 'LegacyRef<HTMLButtonElement> | undefined'.
  Type 'Dispatch<SetStateAction<undefined>>' is not assignable to type '(instance: HTMLButtonElement | null) => void'.
    Types of parameters 'value' and 'instance' are incompatible.
      Type 'HTMLButtonElement | null' is not assignable to type 'SetStateAction<undefined>'.
        Type 'null' is not assignable to type 'SetStateAction<undefined>'.ts(2322)

        index.d.ts(138, 9): The expected type comes from property 'ref' which is declared here on type 'IntrinsicAtt

  Q: How could we resove the above error?
  A: We could use a ref callback instead of a ref object. This is a bit more verbose, but it's a good way to get around this issue.

  Example:
  const ref = useRef<HTMLButtonElement>(null);
  const [referenceElement, setReferenceElement] = useState<HTMLButtonElement | null>(null);

  <Popover.Button ref={ref} onClick

  
  

*/
