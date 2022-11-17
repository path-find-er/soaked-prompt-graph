export const buttonVariantClasses = {
  primary: [
    'bg-primary text-white',
    'border border-primary-600',
    'hover:bg-primary-600 hover:text-white',
    'active:bg-primary',
    'disabled:bg-primary-400 disabled:hover:bg-primary-400',
  ],
  outline: [
    'text-primary-900',
    'border border-primary-900',
    'hover:bg-primary-900 hover:text-white active:bg-primary-100 disabled:bg-primary-100',
  ],
  ghost: [
    'text-primary-900',
    'shadow-none',
    'hover:bg-primary-50 active:bg-primary-100 disabled:bg-primary-100',
  ],
  ghostLight: [
    'text-white',
    'shadow-none',
    'hover:bg-primary-50 hover:text-primary-50',
    'active:bg-primary-100 disabled:bg-primary-100',
  ],
  light: [
    'text-primary-900 bg-white ',
    'hover:bg-primary-900 hover:text-white hover:border-white',
    'active:bg-white/20 disabled:bg-slate-200',
  ],
  dark: [
    'bg-primary-900 text-white',
    'hover:bg-white hover:text-primary-900',
    'active:bg-primary-700 disabled:bg-primary-700',
  ],
};
