import { useState, useCallback } from 'react'
import { MenuProps } from 'antd'
import { Recipient } from '@/modules/mngRecipients/core/types/recipient.type'
import { exportRecipient } from '@/modules/mngRecipients/services/recipient.service'
import { exportCSV } from '@/modules/mngRecipients/services/trash.service'
import { getPageDelete } from '@/shared/utils'

interface BulkOperationsReturnHook {
  itemsBulkOperations: MenuProps['items']
  onResetBulkModal: () => void
  selectedRowKeys: number[]
  onSetSelectedRowKeys: React.Dispatch<React.SetStateAction<number[]>>
  editData: Recipient | undefined
  onSetEditData: React.Dispatch<React.SetStateAction<Recipient | undefined>>
  onRegisterRecipient: (data: Recipient) => () => void
  typeBulk: string
  onSetTypeBulk: React.Dispatch<React.SetStateAction<string>>
  itemsBulkOperationsTrash: MenuProps['items']
}

const useHandleBulkOperations = (
  onSetModalName: (modalName: string) => void,
  onFetch: (params: { [key: string]: any }) => void,
  dataTable: Recipient[],
  pagination: { [key: string]: any }
): BulkOperationsReturnHook => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])
  const [typeBulk, setTypeBulk] = useState<string>('')
  const [editData, setEditData] = useState<Recipient>()

  const handleRegisterRecipient = useCallback((data: Recipient) => {
    return () => {
      setEditData(data)
      onSetModalName('registration')
    }
  }, [])

  const handleAddBulkGroup = useCallback(async () => {
    onSetModalName('addGroup')
  }, [])

  const handleRemoveBulkGroup = useCallback(async () => {
    onSetModalName('removeGroup')
  }, [])

  const handleDownloadCSV = useCallback(async () => {
    await exportRecipient(selectedRowKeys.join(','))
  }, [])

  const handleBulkDelete = useCallback(async () => {
    onSetModalName('delete')
  }, [])

  const handleResetModalName = useCallback(() => {
    const newPage = getPageDelete(dataTable, selectedRowKeys, pagination.currentPage)
    onSetModalName('')
    setSelectedRowKeys([])
    onFetch(newPage)
  }, [dataTable, selectedRowKeys, pagination.currentPage])

  const handleRestore = useCallback(async () => {
    onSetModalName('restoreTrash')
  }, [])

  const handleRemove = useCallback(async () => {
    onSetModalName('removeTrash')
  }, [])

  const handleDownloadCSVTrash = useCallback(async () => {
    await exportCSV({ recipientId: typeBulk === 'all' ? '' : selectedRowKeys.join(',') })
  }, [])

  const itemsBulkOperations: MenuProps['items'] = [
    {
      key: '1',
      label: 'リストへ追加',
      onClick: handleAddBulkGroup
    },
    {
      key: '2',
      label: 'リストから除外',
      onClick: handleRemoveBulkGroup
    },
    {
      key: '3',
      label: 'CSVダウンロード',
      onClick: handleDownloadCSV
    },
    {
      key: '4',
      label: 'ゴミ箱へ移動',
      onClick: handleBulkDelete
    }
  ]

  const itemsBulkOperationsTrash: MenuProps['items'] = [
    {
      key: '1',
      label: '読者一覧へ移動（配信中に戻す）',
      onClick: handleRestore
    },
    {
      key: '2',
      label: 'CSVダウンロード',
      onClick: handleDownloadCSVTrash
    },
    {
      key: '3',
      label: '完全削除する',
      onClick: handleRemove
    },
  ]

  return {
    itemsBulkOperations,
    onResetBulkModal: handleResetModalName,
    selectedRowKeys,
    onSetSelectedRowKeys: setSelectedRowKeys,
    editData,
    onSetEditData: setEditData,
    onRegisterRecipient: handleRegisterRecipient,
    typeBulk,
    onSetTypeBulk: setTypeBulk,
    itemsBulkOperationsTrash
  }
}

export default useHandleBulkOperations
