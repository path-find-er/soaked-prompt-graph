import clsxm from '@/utils/clsxm';

import type { promptSegment } from './MagicInputs';
import MagicInputs from './MagicInputs';

type MagicTextAreaProps = {
  promptSegment: promptSegment;
  className?: string;
};

const MagicTextArea: React.FC<MagicTextAreaProps> = ({
  className,
  promptSegment,
}) => {
  return (
    <div className={clsxm('', className)}>
      <MagicInputs promptSegment={promptSegment} />
    </div>
  );
};

export default MagicTextArea;
