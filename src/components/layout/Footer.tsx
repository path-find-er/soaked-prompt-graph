import IncorpSentence from '@/components/nonEssentials/IncorpSentence';

export default function Footer() {
  return (
    <footer className='border-t-4 border-white bg-primary-300'>
      <div className='mx-auto max-w-7xl overflow-hidden py-12 px-4 sm:px-6 lg:px-8'>
        <nav
          className='mx-auto flex w-fit flex-wrap justify-center space-x-5 text-xs sm:space-x-10'
          aria-label='Footer'
        ></nav>
        <IncorpSentence />
      </div>
    </footer>
  );
}
