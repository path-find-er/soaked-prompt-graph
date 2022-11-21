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

  const promptArr = prompt.map((promptSegment) => promptSegment.segment);
  const promptAsText = promptArr.join(' ');

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
        ' flex h-full  min-w-[300px] max-w-prose flex-col space-y-5 rounded-lg border p-5 sm:min-w-[600px]',
        className
      )}
    >
      <MagicTextArea promptAsText={promptAsText} prompt={prompt} />

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
  const promptAsText = prompt
    .map((promptSegment) => promptSegment.segment)
    .join(' ');
  return (
    <>
      <ButtonCustom
        variant='outline'
        className='flex flex-row flex-wrap overflow-hidden rounded-lg p-4 text-left font-normal shadow hover:scale-100'
        title='Click to edit prompt'
        onClick={() => setModalOpen(true)}
      >
        {prompt.map(({ segment, nodeId, index }, i) => (
          <span
            key={i}
            className='m-1 rounded bg-primary-50 bg-opacity-25 px-1'
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
                  <Badge key={i} className='w-min'>
                    {1}
                  </Badge>
                  <Textarea
                    key={i}
                    className='m-2 w-full !bg-white shadow-sm'
                    defaultValue={segment}
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
