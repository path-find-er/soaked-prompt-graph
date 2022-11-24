import type { Position } from 'reactflow'
import { Handle } from 'reactflow'

import { clsxm } from '@/utils/clsxm'

type handleProps = {
  type: 'target' | 'source'
  position: Position
  id: string
  className?: string
} & React.ComponentPropsWithoutRef<'div'>

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
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
      }}
      className={clsxm(
        '!h-10 !w-16 !rounded-full !bg-green-200 !text-black',
        className,
        [position === 'top' && '!-top-5 !rounded-b-none'],
        [position === 'bottom' && '!-bottom-5 !rounded-t-none']
      )}
      {...props}
    >
      +
    </Handle>
  )
}

export default CustomHandle
