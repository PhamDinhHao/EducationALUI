import { useState, useCallback } from 'react'

const useHandleModal = () => {
  const [modalName, setModalName] = useState('')

  const resetModalName = useCallback(() => {
    setModalName('')
  }, [])

  return {
    modalName,
    onSetModalName: setModalName,
    onResetModalName: resetModalName
  }
}

export default useHandleModal
