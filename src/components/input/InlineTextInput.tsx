import clsxm from '@/utils/clsxm';
import { useNodeStore } from '@/utils/flow/nodeGraph';

type InlineTextInputProps = {
  nodeId: string;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
} & React.ComponentPropsWithoutRef<'div'>;

const InlineTextInput: React.FC<InlineTextInputProps> = ({
  className,
  nodeId,
  onChange,
}) => {
  // the goal of this compoenet is to allow users to edit sections of a paragraph
  // in a way that is similar to how they would edit a word document
  // however every sentence should be a seperate node

  const { graph, reactFlowNodes, updatePrompt } = useNodeStore();
  const prompt = graph.getNodeAttributes(nodeId).prompt;

  return (
    <div className={clsxm('flex w-max shrink', className)}>
      <input
        type='text'
        value={prompt}
        onChange={onChange}
        className='bg-black-100 inline w-full appearance-none border-2 p-0 text-sm text-black'
      />
    </div>
  );
};

export default InlineTextInput;
