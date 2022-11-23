import { Dialog } from '@headlessui/react';
import { Badge, Card, Textarea } from 'flowbite-react';
import { useAtom } from 'jotai';
import { Configuration, OpenAIApi } from 'openai';
import { useState } from 'react';

import clsxm from '@/utils/clsxm';
import type { promptSegment } from '@/utils/graph/store';
import { useGraphStore } from '@/utils/graph/store';

import ButtonCustom from '../buttons/ButtonCustom';
import { ApiKeyAtom } from '../inputs/ApiKey';

type GenerateTileProps = {
  prompt: promptSegment[];
  className?: string;
} & React.ComponentPropsWithoutRef<'div'>;

const countWords = (promptSegment: promptSegment) => {
  return promptSegment.segment.trim().split(/\s+/).length;
};

const calcTokens = (prompt: promptSegment[]) => {
  const nWords = prompt.reduce((acc, curr) => acc + countWords(curr), 0);
  const nTokens = Math.ceil((1000 / 750) * nWords);
  return nTokens;
};

const estimateUSD = (tokens: number) => {
  const usd = (tokens / 1000) * 0.02;
  return usd;
};

const GenerateTile: React.FC<GenerateTileProps> = ({ className, prompt }) => {
  const [apiKey] = useAtom(ApiKeyAtom);

  const [loading, setLoading] = useState(false);

  const [nResults, setnResults] = useState(1);

  const [completionArray, setCompletionArray] = useState<string[]>([]);

  const [maxTokens, setMaxTokens] = useState(200);

  const promptAsText = prompt
    .map((promptSegment) => promptSegment.segment)
    .join(' ');

  const nTokens = calcTokens(prompt) + maxTokens;
  const estimatedPrice = (estimateUSD(nTokens) * nResults).toFixed(3);

  const deleteCompletion = (index: number) => {
    setCompletionArray((prev) => {
      const newArr = [...prev];
      newArr.splice(index, 1);
      return newArr;
    });
  };

  const handleCompletion = async () => {
    if (!apiKey) {
      alert('Please enter a api key');
      return;
    }

    setLoading(true);
    setCompletionArray([]);

    for (let i = 0; i < nResults; i++) {
      const completion = await generateOpenAiCompletion(
        apiKey,
        promptAsText,
        maxTokens
      );
      setCompletionArray((prev) => [...prev, completion.trim()]);
    }
    setLoading(false);
  };

  return (
    <div
      className={clsxm(
        ' flex h-full min-h-[500px] w-full max-w-prose flex-col space-y-5 overflow-y-auto overflow-x-hidden rounded-lg border bg-white p-2 text-xs sm:min-w-[40%] sm:p-4',
        className
      )}
    >
      {promptAsText === '' ? (
        <Card className='m-1 rounded bg-primary-50 bg-opacity-25 px-1'>
          Enter your prompt segment in template area ^ above ^ to generate a
          prompt here
        </Card>
      ) : (
        <>
          <div className='flex flex-col items-start justify-between space-y-4'>
            <MagicTextArea prompt={prompt} />

            <div className='flex w-full flex-row items-center justify-between'>
              <ButtonCustom
                variant='primary'
                className=' mb-auto'
                onClick={handleCompletion}
                isLoading={loading}
              >
                Generate
              </ButtonCustom>
              <div className='w-full max-w-[220px]'>
                <div className='flex items-center justify-end space-x-2'>
                  <p>count:</p>
                  <Badge className='text-xs'>{nResults}</Badge>
                </div>
                <input
                  type='range'
                  // no negative numbers
                  min='1'
                  max='20'
                  step={1}
                  value={nResults}
                  onChange={(e) => setnResults(Number(e.target.value))}
                  className=' h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-black'
                />
              </div>
            </div>
            <div className='flex w-full flex-row items-center justify-between gap-2'>
              <div>
                <p>est cost:</p>
                <Badge className='w-max !bg-green-300 text-xs !text-stone-900'>
                  ${estimatedPrice}
                </Badge>
              </div>
              <div className='w-full max-w-[220px]'>
                <div className='flex items-center justify-end space-x-2'>
                  <p>tokens:</p>
                  <Badge className='text-xs'>{nTokens}</Badge>
                </div>
                <input
                  type='range'
                  min='1'
                  max='4000'
                  step={50}
                  value={nTokens}
                  onChange={(e) => setMaxTokens(Number(e.target.value))}
                  className='h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 '
                />
              </div>
            </div>
          </div>

          <div className='flex flex-row space-x-2 overflow-y-auto sm:flex-col sm:space-x-0 sm:space-y-2 sm:overflow-auto  sm:overflow-x-hidden'>
            {completionArray.map((completion, i) => (
              <div
                key={i}
                className='relative h-fit min-w-[80%] whitespace-pre-line break-words rounded-r-lg rounded-b-lg border  border-gray-300 p-4 text-left text-xs font-normal shadow hover:scale-100'
              >
                {completion}
                {/* delete btn */}
                <button
                  onClick={() => deleteCompletion(i)}
                  className='absolute top-0 left-0 z-10 h-4 w-4 rounded-br-lg bg-gray-300 text-xs text-white hover:bg-red-900'
                >
                  -
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default GenerateTile;

export const generateOpenAiCompletion = async (
  openAiApiKey: string,
  promptText: string,
  max_tokens = 256,
  model = 'text-davinci-002',
  temperature = 0.7,
  top_p = 1,
  frequency_penalty = 0,
  presence_penalty = 0
): Promise<string> => {
  const configuration = new Configuration({ apiKey: openAiApiKey });
  const openai = new OpenAIApi(configuration);
  const response = await openai.createCompletion({
    prompt: promptText,
    model: model,
    temperature: temperature,
    max_tokens: max_tokens,
    top_p: top_p,
    frequency_penalty: frequency_penalty,
    presence_penalty: presence_penalty,
  });
  if (response.data.choices[0]) {
    return response.data.choices[0].text as string;
  }
  return 'Something went wrong...';
};

type MagicTextAreaProps = {
  prompt: promptSegment[];
};
const MagicTextArea: React.FC<MagicTextAreaProps> = ({ prompt }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { update } = useGraphStore();

  const handleUpdate = (nodeId: string, segment: string, index: number) => {
    update.promptSegment(nodeId, segment, index);
  };

  return (
    <>
      <ButtonCustom
        variant='outline'
        className='flex w-full flex-col items-center justify-center gap-4 rounded-lg border-gray-300 p-4 text-left font-normal shadow hover:scale-100 sm:p-4'
        title='Click to edit prompt'
        onClick={() => setModalOpen(true)}
      >
        {prompt.map(({ segment }, i) => (
          <div
            key={i}
            className='w-full whitespace-pre-wrap break-words rounded border bg-primary-50 bg-opacity-25 p-1 sm:inline'
          >
            {segment}
          </div>
        ))}
      </ButtonCustom>

      <Dialog
        className='relative z-10'
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      >
        <div className='fixed inset-0 bg-black bg-opacity-25' />
        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-10 text-center'>
            <Dialog.Panel className='flex h-[90vh] w-full flex-col gap-4  overflow-y-auto rounded-lg bg-white p-5 text-center shadow'>
              {/* Iteratate over prompt segments and display them in text areas, use global state to update prompt segments */}
              {prompt.map((promptSegment, i) => {
                const { segment, index, nodeId } = promptSegment;
                const nTokens = calcTokens([promptSegment]);
                const estimatedPrice = estimateUSD(nTokens);
                return (
                  <div className='flex flex-col gap-2 text-left' key={i}>
                    <Textarea
                      key={i}
                      className='w-full !bg-white text-xs shadow-sm'
                      value={segment}
                      rows={8}
                      onChange={(e) =>
                        handleUpdate(nodeId, e.target.value, index)
                      }
                    />
                    <div className='flex w-full flex-row items-center justify-start gap-2'>
                      <p>est cost:</p>
                      <Badge className='w-max !bg-green-300 text-xs text-stone-900'>
                        ${estimatedPrice.toFixed(3)}
                      </Badge>
                      <p>tokens:</p>
                      <Badge className='w-max text-xs'>{nTokens}</Badge>
                    </div>
                    <hr className='border' />
                  </div>
                );
              })}
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </>
  );
};
