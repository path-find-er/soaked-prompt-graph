import { Badge, Card } from 'flowbite-react'
import { useAtom } from 'jotai'
import { Configuration, OpenAIApi } from 'openai'
import { useState } from 'react'

import clsxm from '@/utils/clsxm'
import type { promptSegment } from '@/utils/graph/types'

import ButtonCustom from '../buttons/ButtonCustom'
import { ApiKeyAtom } from '../inputs/ApiKey'
import MagicTextArea from '../inputs/magic/MagicTextArea'

type GenerateTileProps = {
  prompt: promptSegment[]
  className?: string
} & React.ComponentPropsWithoutRef<'div'>

export const countWords = (promptSegment: promptSegment) => {
  return promptSegment.segment.trim().split(/\s+/).length
}

export const calcTokens = (prompt: promptSegment[]) => {
  const nWords = prompt.reduce((acc, curr) => acc + countWords(curr), 0)
  const nTokens = Math.ceil((1000 / 750) * nWords)
  return nTokens
}

export const estimateUSD = (tokens: number) => {
  const usd = (tokens / 1000) * 0.02
  return usd
}

const GenerateTile: React.FC<GenerateTileProps> = ({ className, prompt }) => {
  const [apiKey] = useAtom(ApiKeyAtom)

  const [loading, setLoading] = useState(false)

  const [nResults, setnResults] = useState(1)

  const [completionArray, setCompletionArray] = useState<string[]>([])

  const [maxTokens, setMaxTokens] = useState(200)

  const promptAsText = prompt
    .map((promptSegment) => promptSegment.segment)
    .join(' ')

  const nTokens = calcTokens(prompt)

  const estimatedPrice = (estimateUSD(nTokens) * nResults).toFixed(3)

  const deleteCompletion = (index: number) => {
    setCompletionArray((prev) => {
      const newArr = [...prev]
      newArr.splice(index, 1)
      return newArr
    })
  }

  const handleCompletion = async () => {
    if (!apiKey) {
      alert('Please enter a api key')
      return
    }

    setLoading(true)
    setCompletionArray([])

    for (let i = 0; i < nResults; i++) {
      const completion = await generateOpenAiCompletion(
        apiKey,
        promptAsText,
        maxTokens
      )
      setCompletionArray((prev) => [...prev, completion.trim()])
    }
    setLoading(false)
  }

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
                  <Badge className='text-xs'>
                    {nTokens} + {maxTokens}
                  </Badge>
                </div>
                <input
                  type='range'
                  min='50'
                  max={4000 - nTokens}
                  step={100}
                  value={maxTokens}
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
  )
}

export default GenerateTile

export const generateOpenAiCompletion = async (
  openAiApiKey: string,
  promptText: string,
  max_tokens = 256,
  temperature = 0.7,
  model = 'text-davinci-003',
  top_p = 1,
  frequency_penalty = 0,
  presence_penalty = 0
): Promise<string> => {
  const configuration = new Configuration({ apiKey: openAiApiKey })
  const openai = new OpenAIApi(configuration)
  const response = await openai.createCompletion({
    prompt: promptText,
    model: model,
    temperature: temperature,
    max_tokens: max_tokens,
    top_p: top_p,
    frequency_penalty: frequency_penalty,
    presence_penalty: presence_penalty,
  })
  if (response.data.choices[0]) {
    return response.data.choices[0].text as string
  }
  return 'Something went wrong...'
}
