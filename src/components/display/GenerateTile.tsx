import { Badge, Card, Modal, Textarea } from 'flowbite-react';
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

const GenerateTile: React.FC<GenerateTileProps> = ({ className, prompt }) => {
  const [apiKey] = useAtom(ApiKeyAtom);

  const [loading, setLoading] = useState(false);

  const [nResults, setnResults] = useState(1);

  const [completionArray, setCompletionArray] = useState<string[]>([]);

  const deleteCompletion = (index: number) => {
    setCompletionArray((prev) => {
      const newArr = [...prev];
      newArr.splice(index, 1);
      return newArr;
    });
  };

  const promptAsText = prompt
    .map((promptSegment) => promptSegment.segment)
    .join(' ');

  const handleCompletion = async () => {
    if (!apiKey) {
      alert('Please enter a api key');
      return;
    }

    setLoading(true);
    setCompletionArray([]);
    for (let i = 0; i < nResults; i++) {
      const completion = await generateOpenAiCompletion(apiKey, promptAsText);
      setCompletionArray((prev) => [...prev, completion.trim()]);
    }
    setLoading(false);
  };

  return (
    <div
      className={clsxm(
        ' flex h-full min-h-[500px] w-full min-w-[100%] max-w-prose flex-col space-y-5 rounded-lg border bg-white p-5 text-xs sm:min-w-[40%]',
        className
      )}
    >
      {promptAsText === '' ? (
        <Card className='m-1 rounded bg-primary-50 bg-opacity-25 px-1'>
          Enter your prompt segment in template ^ above ^ to generate a prompt
          here
        </Card>
      ) : (
        <>
          <div className='flex flex-col items-start justify-between space-y-4'>
            <MagicTextArea prompt={prompt} />

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
          </div>

          <div className='flex flex-row space-x-2 overflow-auto sm:flex-col sm:space-x-0  sm:space-y-2'>
            {completionArray.map((completion, i) => (
              <div
                key={i}
                className='relative h-fit min-w-[80%] rounded-r-lg rounded-b-lg border  border-gray-300 p-4 text-left text-xs font-normal shadow hover:scale-100'
              >
                {promptAsText} <strong> {completion} </strong>
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
  return 'Something went wrong...';
};

type MagicTextAreaProps = {
  prompt: promptSegment[];
};
const MagicTextArea: React.FC<MagicTextAreaProps> = ({ prompt }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { graph, update } = useGraphStore();

  const handleUpdate = (nodeId: string, segment: string, index: number) => {
    update.promptSegment(nodeId, segment, index);
  };

  return (
    <>
      <ButtonCustom
        variant='outline'
        className='inline rounded-lg border-gray-300 p-4 text-left font-normal shadow hover:scale-100'
        title='Click to edit prompt'
        onClick={() => setModalOpen(true)}
      >
        {prompt.map(({ segment }, i) => (
          <span
            key={i}
            className='mr-1 rounded bg-primary-50 bg-opacity-25 px-1'
          >
            {segment}
          </span>
        ))}
      </ButtonCustom>

      <Modal
        show={modalOpen}
        popup={true}
        size='2xl'
        onClose={() => setModalOpen(false)}
        position='center'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='m-auto text-center'>
            {/* Iteratate over prompt segments and display them in text areas, use global state to update prompt segments */}
            {prompt.map((promptSegment, i) => {
              const { segment, index, nodeId } = promptSegment;
              return (
                <>
                  <Badge key={i} className='w-max'>
                    {i + 1}
                  </Badge>
                  <Textarea
                    key={i}
                    className='m-2 w-full !bg-white shadow-sm'
                    value={segment}
                    rows={5}
                    onChange={(e) =>
                      handleUpdate(nodeId, e.target.value, index)
                    }
                  />
                </>
              );
            })}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
