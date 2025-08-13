import toast from 'react-hot-toast'

export const convertStyleToString = (styles: Record<string, string>) => {
  let result = ''
  for (const style in styles) {
    result += `${style}: ${styles[style]};`
  }
  return result
}

export const copyTextToClipboard = (text: string) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      toast.success('Copied!')
    })
    .catch(() => {
      toast.success('Failed!')
    })
}