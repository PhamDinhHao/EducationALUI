import { useCallback } from 'react'
import { bulkDeleteRecipient } from '@/modules/mngRecipients/services/recipient.service'

const useHandleActionList = (onResetBulkModal: () => void, selectedRowKeys: number[], typeBulk: string) => {
  const handleMoveToTrash = useCallback(async () => {
    const transformData = typeBulk === 'all' ? { recipientId: '' } : { recipientId: selectedRowKeys.join(',') }

    try {
      await bulkDeleteRecipient(transformData)
    } finally {
      onResetBulkModal()
    }
  }, [typeBulk, selectedRowKeys])

  return {
    onMoveToTrash: handleMoveToTrash
  }
}

export default useHandleActionList