import { Spinner } from 'flowbite-react'
import { useEffect, useId, useRef, useState } from 'react'

type InlineTextProps = {
  prompt: string
  className?: string
} & React.ComponentPropsWithoutRef<'input'>

export const avgCharWidth = 10
export const avgCharHeight = 16
export const avgSpaceWidth = 2

const InlineText: React.FC<InlineTextProps> = ({ prompt }) => {
  const [inputValues, setInputValues] = useState([prompt])
  const [loaded, setLoaded] = useState(false)

  const handleSizing = (Target: HTMLInputElement, index: number) => {
    setInputValues((prev) => {
      const newValues = [...prev]
      newValues[index] = Target.value
      return newValues
    })

    const parentWidth = Target.parentElement?.clientWidth

    if (!parentWidth) return

    const style = Target.style
    const value = Target.value

    const numChars = (value.match(/./g) || []).length
    const numSpaces = (value.match(/ /g) || []).length

    const maxChars = Math.floor(parentWidth / avgCharWidth)
    const widthChars = maxChars * avgCharWidth

    if (numChars < maxChars) {
      const maxSpaces = Math.floor((parentWidth - widthChars) / avgSpaceWidth)

      if (numSpaces < maxSpaces) {
        style.width = `${numChars * avgCharWidth + numSpaces * avgSpaceWidth}px`
      } else {
        const lastSpaceIndex = value.lastIndexOf(' ', maxChars)
        const firstHalf = value.slice(0, lastSpaceIndex)
        const secondHalf = value.slice(lastSpaceIndex + 1)

        setInputValues((prev) => {
          const newValues = [...prev]
          newValues[index] = firstHalf
          newValues.splice(index + 1, 0, secondHalf)
          return newValues
        })
      }
    }

    const newWidth =
      8 + Math.ceil(numChars * avgCharWidth + numSpaces * avgSpaceWidth)

    if (newWidth > parentWidth) {
      style.width = `${parentWidth}px`
      setInputValues([...inputValues, ''])
    } else {
      style.width = `${newWidth}px`
    }
  }

  const handleOnChange = (
    eventSynth: React.SyntheticEvent<HTMLInputElement>,
    index: number
  ) => {
    const Target = eventSynth.target as HTMLInputElement

    handleSizing(Target, index)
  }

  const id = useId()

  // QUESTION: how can we get useeffect to run only twice?
  // ANSWER: use a ref to keep track of the number of times useEffect has run
  // and then use that ref to determine if useEffect should run again
  const countRef = useRef(0)
  useEffect(() => {
    countRef.current += 1
    if (countRef.current < 3) {
      const count = inputValues.length
      // input  id={`input-${i}-${id}`}
      // find inputs by iterating using count as index and run handleSizing on each input
      for (let i = 0; i < count; i++) {
        const input = document.getElementById(
          `input-${i}-${id}`
        ) as HTMLInputElement
        if (input) {
          // add space and remove space to trigger handleSizing
          input.value = input.value + ' '
          input.value = input.value.slice(0, -1)
        }
      }
    }
    setLoaded(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countRef])

  return (
    <>
      {loaded ? (
        inputValues.map((inputValue, i) => (
          <input
            key={i}
            type='test'
            id={`input-${i}-${id}`}
            value={inputValue}
            onChange={(e) => handleOnChange(e, i)}
            // run handleOnChange when the component is mounted
            onLoad={(e) => handleOnChange(e, i)}
            className='m-1 w-max border-none bg-primary-50 px-[4px]  py-0 font-mono'
            style={{
              appearance: 'none',
              fontSize: `${avgCharHeight}px`,
              fontKerning: 'none',
              letterSpacing: '1px',
              wordSpacing: `${avgSpaceWidth}px`,
            }}
          />
        ))
      ) : (
        <Spinner />
      )}
    </>
  )
}

export default InlineText
