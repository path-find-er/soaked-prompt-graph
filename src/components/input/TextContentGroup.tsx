import clsxm from '@/utils/clsxm';

import InlineTextInput from './InlineTextInput';

type TextContentGroupProps = {
  nodeIds: string[];
  className?: string;
} & React.ComponentPropsWithoutRef<'div'>;

const TextContentGroup: React.FC<TextContentGroupProps> = ({
  className,
  nodeIds,
}) => {
  // TODO:

  return (
    <div
      className={clsxm(
        ' h-48 min-w-[250px] overflow-auto border border-gray-300 bg-white px-4 py-5 sm:min-w-[450px] sm:rounded-lg sm:p-6',
        className
      )}
    >
      {nodeIds.map((nodeId, i) => (
        <InlineTextInput key={i} nodeId={nodeId} />
      ))}
    </div>
  );
};

export default TextContentGroup;
