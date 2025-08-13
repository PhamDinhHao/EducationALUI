import { useCallback, useState } from 'react'

export const useOpen = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleOpen = useCallback(() => {
    setIsOpen(isOpen)
  }, [isOpen])

  const onClose = useCallback(() => {
    setIsOpen(false)
  }, [])

  return {
    isOpen,
    setIsOpen,
    toggleOpen,
    onClose
  }
}
