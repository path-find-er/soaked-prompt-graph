import { Label } from 'flowbite-react';
import type { FC } from 'react';

import clsxm from '@/utils/clsxm';
import { useNodeStore } from '@/utils/flow/nodeGraph';

import GenerateTile from '../display/GenerateTile';
import ApiInputGroup from '../input/ApiInputGroup';

type TryPromptsProps = {
  className?: string;
} & React.ComponentPropsWithoutRef<'section'>;

const TryPrompts: FC<TryPromptsProps> = ({ className }) => {
  const { reactFlowNodes, reactFlowEdges, graph, fetchFullPrompts } =
    useNodeStore();
  const foundPrompts = fetchFullPrompts();

  return (
    <section className={clsxm('rounded-x h-[70vh] w-full p-5', className)}>
      <div className='mb-2 w-full text-center'>
        <Label htmlFor='api-key' className=''>
          Enter your openai Api key
        </Label>
      </div>
      <ApiInputGroup />

      <h3 className='flex items-center py-3'> Try prompts: </h3>

      <div className=' flex h-full w-full space-x-3 overflow-auto rounded-xl bg-white p-4'>
        {foundPrompts.map((prompt, i) => (
          <GenerateTile key={i} prompt={prompt} />
        ))}
      </div>
    </section>
  );
};

export default TryPrompts;

/*



*/
