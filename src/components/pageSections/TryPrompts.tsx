import { Label, Textarea } from 'flowbite-react';

import clsxm from '@/utils/clsxm';
import { useNodeStore } from '@/utils/flow/nodeGraph';

import ButtonCustom from '../buttons/ButtonCustom';
import ApiInputGroup from '../input/ApiInputGroup';

type TryPromptsProps = {
  className?: string;
} & React.ComponentPropsWithoutRef<'section'>;

const TryPrompts: React.FC<TryPromptsProps> = ({ className }) => {
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
          <div
            key={i}
            className='flex h-full w-44 min-w-[250px] flex-col  space-y-5 rounded-lg border p-5 sm:min-w-[400px] '
          >
            <Textarea rows={20} className='!bg-white' value={prompt} />

            <div className='flex items-center space-x-3'>
              <ButtonCustom variant='primary' className=' mb-auto max-w-fit'>
                GPT3 Generate
              </ButtonCustom>
              <input
                type='number'
                defaultValue={1}
                className='h-9 w-14 appearance-none text-black'
              />
            </div>
            <Textarea rows={20} className='!bg-white' />
          </div>
        ))}
      </div>
    </section>
  );
};

export default TryPrompts;

/*



*/
