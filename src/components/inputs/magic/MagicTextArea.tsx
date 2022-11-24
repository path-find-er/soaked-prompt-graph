import { Dialog } from '@headlessui/react'
import { Badge, Textarea } from 'flowbite-react'
import { useState } from 'react'

import ButtonCustom from '@/components/buttons/ButtonCustom'
import { calcTokens, estimateUSD } from '@/components/display/GenerateTile'

import { useGraphStore } from '@/utils/graph/store'
import type { promptSegment } from '@/utils/graph/types'

type MagicTextAreaProps = {
  prompt: promptSegment[]
}

const MagicTextArea: React.FC<MagicTextAreaProps> = ({ prompt }) => {
  const [modalOpen, setModalOpen] = useState(false)
  const { update } = useGraphStore()

  const handleUpdate = (nodeId: string, segment: string, index: number) => {
    update.promptSegment(nodeId, segment, index)
  }

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
                const { segment, index, nodeId } = promptSegment
                const nTokens = calcTokens([promptSegment])
                const estimatedPrice = estimateUSD(nTokens)
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
                )
              })}
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </>
  )
}

export default MagicTextArea
