import { Label } from 'flowbite-react';
import type { FC } from 'react';

import clsxm from '@/utils/clsxm';
import { useGraphStore } from '@/utils/graph/store';

import GenerateTile from '../display/GenerateTile';
import ApiInputGroup from '../inputs/ApiKey';

type TryPromptsProps = {
  className?: string;
} & React.ComponentPropsWithoutRef<'section'>;

const TryPrompts: FC<TryPromptsProps> = ({ className }) => {
  const { prompts } = useGraphStore();

  return (
    <section className={clsxm('rounded-x w-full p-5', className)}>
      <>
        <div className='mb-2 w-full text-center'>
          <Label htmlFor='api-key' className=''>
            Enter your openai Api key
          </Label>
        </div>
        <ApiInputGroup />

        <h3 className='flex items-center py-3'> Try prompts: </h3>

        <div className=' flex h-full w-full flex-col space-y-5 overflow-auto rounded-xl border-2 border-white p-4 sm:flex-row sm:space-y-0 sm:space-x-3'>
          {prompts().map((prompt, i) => {
            return <GenerateTile key={i} prompt={prompt} className='flex-1' />;
          })}
        </div>
      </>
    </section>
  );
};

export default TryPrompts;

/*



*/
