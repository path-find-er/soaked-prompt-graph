import type { Position } from 'reactflow';
import { Handle } from 'reactflow';

import { clsxm, preppendBangToWords } from '@/utils/clsxm';

type handleProps = {
  type: 'target' | 'source';
  position: Position;
  id: string;
  className?: string;
} & React.ComponentPropsWithoutRef<'div'>;

export const CustomHandle: React.FC<handleProps> = ({
  type,
  position,
  id,
  className = '',
  ...props
}) => {
  //
  return (
    <Handle
      id={`handle-${id}-${position}`}
      type={type}
      position={position}
      style={{
        display: 'flex',
        zIndex: '10',
        backgroundColor: '#D1FAE5',
        transitionProperty: 'transform',
        justifyContent: 'center',
        alignItems: 'center',
        width: '1.5rem',
        height: '2rem',
        borderRadius: '0.5rem',
        cursor: 'pointer',
      }}
      className={clsxm(
        preppendBangToWords(
          'z-10 flex h-8 w-6 cursor-pointer items-center justify-center  rounded-lg bg-green-100 transition-transform hover:scale-110'
        ),
        className
      )}
      {...props}
    >
      +
    </Handle>
  );
};

export default CustomHandle;
