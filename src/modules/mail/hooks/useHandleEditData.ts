import { Distribution } from '@/modules/mail/core/types/distribution-history.type'
import useHandleModal from '@/shared/hooks/useHandleModal'
import { useCallback, useState } from 'react'

const useHandleEditData = () => {
  const [editData, setEditData] = useState<Distribution | null>(null)
  const { modalName, onSetModalName } = useHandleModal()

  const handleCloseModal = useCallback(() => {
    setEditData(null)
    onSetModalName('')
  }, [])

  const handleEditData = useCallback((data: Distribution) => {
    return () => {
      setEditData(data)
      onSetModalName('sentMail')
    }
  }, [])

  return {
    modalName,
    editData,
    onSetEditData: handleEditData,
    onCloseModal: handleCloseModal
  }
}

export default useHandleEditData
