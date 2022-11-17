import { forwardRef } from 'react';

import type { UnstyledLinkProps } from '@/components/buttons/links/UnstyledLink';
import UnstyledLink from '@/components/buttons/links/UnstyledLink';
import type { ButtonVariant } from '@/components/buttons/types';
import { buttonVariantClasses } from '@/components/buttons/variants';

import clsxm from '@/utils/clsxm';

type ButtonLinkProps = {
  variant?: ButtonVariant;
} & UnstyledLinkProps;

const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  ({ children, className, variant = 'primary', ...rest }, ref) => {
    return (
      <UnstyledLink
        ref={ref}
        {...rest}
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
          className
        )}
      >
        {children}
      </UnstyledLink>
    );
  }
);

export default ButtonLink;
