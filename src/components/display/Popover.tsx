import type { PropsWithChildren } from 'react'

import clsxm from '@/utils/clsxm'

type PopoverProps = {
  className?: string
} & React.ComponentPropsWithoutRef<'div'>

const Popover: React.FC<PropsWithChildren<PopoverProps>> = ({
  className,
  children,
  ...rest
}) => {
  // TODO:

  return (
    <>
      <div
        data-popover
        id='popover-click'
        role='tooltip'
        className={clsxm(
          'invisible absolute z-10 inline-block w-64 rounded-lg border border-gray-200 bg-white text-sm font-light text-gray-500 opacity-0 shadow-sm transition-opacity duration-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400',
          className
        )}
        {...rest}
      >
        {children}
        <div data-popper-arrow></div>
      </div>
    </>
  )
}

export default Popover
