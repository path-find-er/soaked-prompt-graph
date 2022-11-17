import * as React from 'react';
import { ImSpinner2 } from 'react-icons/im';

import type { ButtonVariant } from '@/components/buttons/types';

import clsxm from '@/utils/clsxm';

import { buttonVariantClasses } from './variants';

type ButtonProps = {
  isLoading?: boolean;
  variant?: ButtonVariant;
} & React.ComponentPropsWithRef<'button'>;

const ButtonCustom = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      disabled: buttonDisabled,
      isLoading,
      variant = 'primary',
      ...rest
    },
    ref
  ) => {
    const disabled = isLoading || buttonDisabled;

    return (
      <button
        ref={ref}
        type='button'
        disabled={disabled}
        className={clsxm(
          'inline-flex items-center rounded px-4 py-2 font-semibold',
          'focus:outline-none focus-visible:ring focus-visible:ring-primary',
          'shadow-sm',
          'transition-all duration-150 hover:scale-105 active:scale-100',
          //#region  //*=========== Variants ===========
          [
            variant === 'primary' && buttonVariantClasses.primary,
            variant === 'outline' && buttonVariantClasses.outline,
            variant === 'ghost' && buttonVariantClasses.ghost,
            variant === 'ghostLight' && buttonVariantClasses.ghostLight,
            variant === 'light' && buttonVariantClasses.light,
            variant === 'dark' && buttonVariantClasses.dark,
          ],
          //#endregion  //*======== Variants ===========
          'disabled:cursor-not-allowed',
          isLoading &&
            'relative text-transparent transition-none hover:text-transparent disabled:cursor-wait',
          className
        )}
        {...rest}
      >
        {isLoading && (
          <div
            className={clsxm(
              'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
              {
                'text-white': ['primary', 'dark'].includes(variant),
                'text-black': ['light'].includes(variant),
                'text-primary': ['outline', 'ghost'].includes(variant),
              }
            )}
            data-mdb-ripple='true'
            data-mdb-ripple-color='light'
          >
            <ImSpinner2 className='animate-spin' />
          </div>
        )}
        {children}
      </button>
    );
  }
);

export default ButtonCustom;
