import ButtonLink from '@/components/buttons/links/ButtonLink';

import clsxm from '@/utils/clsxm';

type HeaderProps = {
  className?: string;
} & React.ComponentPropsWithoutRef<'div'>;

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header
      className={clsxm(
        'sticky top-0  z-50 border-b-4 border-white px-5 filter backdrop-blur-md',
        className
      )}
    >
      <nav className='mx-auto max-w-4xl px-4 sm:px-0' aria-label='Top'>
        <div className='flex w-full items-center justify-between py-6'>
          <div className='flex items-center'>
            <ButtonLink variant='ghostLight' href='/' className='m-0 p-0'>
              <span className='sr-only'>Mafra & Marais</span>
              <div className='h-10 w-10'>prompt engine</div>
            </ButtonLink>
          </div>
          <div className='ml-10 space-x-4'>
            <ButtonLink href='/start' variant='light'>
              Get started
            </ButtonLink>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
