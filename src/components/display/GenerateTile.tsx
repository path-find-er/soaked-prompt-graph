import { Card } from 'flowbite-react';
import { useAtom } from 'jotai';
import { Configuration, OpenAIApi } from 'openai';
import { useState } from 'react';

import clsxm from '@/utils/clsxm';

import ButtonCustom from '../buttons/ButtonCustom';
import { ApiKeyAtom } from '../input/ApiInputGroup';

type GenerateTileProps = {
  prompt: string;
  className?: string;
} & React.ComponentPropsWithoutRef<'div'>;

export const generateOpenAiCompletion = async (
  openAiApiKey: string,
  promptText: string
  // genParams: GenParams
): Promise<string> => {
  const configuration = new Configuration({ apiKey: openAiApiKey });
  const openai = new OpenAIApi(configuration);

  const response = await openai.createCompletion({
    model: 'text-davinci-002',
    prompt: promptText,
    temperature: 0.7,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  if (response.data.choices[0]) {
    return response.data.choices[0].text as string;
  }
  return '';
};

const GenerateTile: React.FC<GenerateTileProps> = ({ className, prompt }) => {
  // TODO:
  const [apiKey] = useAtom(ApiKeyAtom);

  const [loading, setLoading] = useState(false);
  const [nResults, setnResults] = useState(1);
  const [completionArray, setCompletionArray] = useState<string[]>([]);

  const handleCompletion = async () => {
    // check if api key is valid
    if (!apiKey) {
      alert('Please enter a valid api key');
      return;
    }

    setLoading(true);
    setCompletionArray([]);
    for (let i = 0; i < nResults; i++) {
      const completion = await generateOpenAiCompletion(apiKey, prompt);
      setCompletionArray((prev) => [...prev, completion.trim()]);
    }
    setLoading(false);
  };
  // split on line breacks using regex

  return (
    <div
      className={clsxm(
        ' flex h-full  min-w-[300px] flex-col space-y-5 rounded-lg border p-5 sm:min-w-[600px]',
        className
      )}
    >
      <Card className='flex w-full items-start whitespace-pre-line text-xs'>
        {prompt == '' ? 'Create a prompt template above' : prompt}
      </Card>

      <div className='flex items-center space-x-3'>
        <ButtonCustom
          variant='primary'
          className=' mb-auto'
          onClick={handleCompletion}
          isLoading={loading}
        >
          Generate
        </ButtonCustom>
        <input
          type='number'
          // no negative numbers
          min='1'
          value={nResults}
          onChange={(e) => setnResults(Number(e.target.value))}
          className='h-9 w-14 appearance-none  text-black'
        />
      </div>

      <div className='flex flex-col space-y-2  overflow-y-auto'>
        {/* <InlineTextInput prompt='completion' /> */}
        {completionArray.map((completion, i) => (
          <Card key={i} className='text-xs shadow'>
            {completion}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GenerateTile;
