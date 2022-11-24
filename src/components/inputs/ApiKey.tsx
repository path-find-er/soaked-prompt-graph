import { TextInput } from 'flowbite-react'
import { atom, useAtom } from 'jotai'
import { useState } from 'react'
import * as React from 'react'
import { AiFillEyeInvisible } from 'react-icons/ai'
import { HiCheckCircle } from 'react-icons/hi'
import SimpleCrypto from 'simple-crypto-js'

import ButtonCustom from '@/components/buttons/ButtonCustom'

import clsxm from '@/utils/clsxm'

const mk = () => 'NgqUCBFoLq7qn1RhOKNy'

const sc = mk()

const useSC = new SimpleCrypto(sc)

export const ApiKeyAtom = atom('')

type ApiKeyProps = {
  className?: string
} & React.ComponentPropsWithoutRef<'div'>

const ApiKey: React.FC<ApiKeyProps> = ({ className }) => {
  const [apiKey, setApiKey] = useAtom(ApiKeyAtom)
  const [apiDisplay, setApiDisplay] = useState(apiKey)

  const handleApiKeySave = (value: string) => {
    setApiKey(value)
    const encryptedApiKey = useSC.encrypt(value)
    localStorage.setItem('prompt-engine-save-data', encryptedApiKey)
  }

  const handleApiKeyLoad = () => {
    const localStorageItem = localStorage.getItem('prompt-engine-save-data')
    if (localStorageItem) {
      const decryptedApiKey = useSC.decrypt(localStorageItem) as string
      setApiKey(decryptedApiKey)
      setApiDisplay(decryptedApiKey)
    }
  }
  return (
    <div
      className={clsxm('mb-5 flex grow items-center justify-center', className)}
    >
      <div className='group/ApiKey relative'>
        <div className='absolute inset-y-2 left-12 right-2 z-10 flex items-center justify-center rounded-lg bg-primary-50 group-hover/ApiKey:hidden'>
          <AiFillEyeInvisible className='fill-primary-200' />
        </div>
        <TextInput
          id='api-key'
          type='text'
          placeholder='API key'
          className='w-full max-w-[300px] text-sm '
          value={apiDisplay}
          onChange={(e) => setApiDisplay(e.target.value)}
          addon={
            <HiCheckCircle
              className={
                (clsxm('mx-4'),
                apiKey === '' || apiKey !== apiDisplay
                  ? 'text-gray-50'
                  : 'text-green-500')
              }
            />
          }
        />
      </div>
      <ButtonCustom
        variant='outline'
        className=' rounded-r-none rounded-l-none border-x-0 border-gray-300 '
        onClick={() => handleApiKeySave(apiDisplay)}
      >
        save
      </ButtonCustom>
      <ButtonCustom
        variant='outline'
        className=' rounded-l-none border-gray-300'
        onClick={() => handleApiKeyLoad()}
      >
        load
      </ButtonCustom>
    </div>
  )
}

export default ApiKey
