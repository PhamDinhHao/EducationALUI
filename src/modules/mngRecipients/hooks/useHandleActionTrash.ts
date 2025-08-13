import { removeTrash, restoreTrash } from '@/modules/mngRecipients/services/trash.service'
import { useCallback } from 'react'

const useHandleActionTrash = (selectedRowKeys: number[], typeBulk: string, onResetBulkModal: () => void) => {
  const handleRestore = useCallback(async () => {
    const transformData = typeBulk === 'all' ? { recipientId: '' } : { recipientId: selectedRowKeys.join(',') }

    try {
      await restoreTrash(transformData)
    } finally {
      onResetBulkModal()
    }
  }, [typeBulk, selectedRowKeys, ])

  const handleRemove = useCallback(async () => {
    const transformData = typeBulk === 'all' ? { recipientId: '' } : { recipientId: selectedRowKeys.join(',') }

    try {
      await removeTrash(transformData)
    } finally {
      onResetBulkModal()
    }
  }, [typeBulk, selectedRowKeys])

  return {
    onRestoreTrash: handleRestore,
    onRemoveTrash: handleRemove
  }
}

export default useHandleActionTrash
