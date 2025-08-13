import { useCallback, useState } from 'react'
import { Button, Modal } from 'antd'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import ListDistributions from '@/modules/mngRecipients/components/Group/ListDistributions'
import { Group } from '@/shared/core/types/group.type'
import useHandleForm from '@/shared/hooks/useHandleForm'
import { bulkAddGroup } from '@/modules/mngRecipients/services/recipient.service'
import { RegistrationRecipientSchemaGroup } from '@/modules/mngRecipients/core/config/form/bulk-add-group'
import { TRegistrationRecipientGroup } from '@/modules/mngRecipients/core/config/form/bulk-add-group'

type Props = {
  isOpen: boolean
  onClose: () => void
  ids: number[]
  onResetBulkModal: () => void
  groupList: Group[]
  onFetchGroupList: () => void
}

const AddGroupRecipientModal: React.FC<Props> = ({
  isOpen,
  onClose,
  ids,
  onResetBulkModal,
  groupList,
  onFetchGroupList
}) => {
  const [checkedIds, setCheckedIds] = useState<number[]>([])
  const { handleSubmit, setError } = useForm<TRegistrationRecipientGroup>({
    resolver: zodResolver(RegistrationRecipientSchemaGroup),
    values: {
      groupId: '',
      recipientId: ''
    },
    mode: 'all'
  })
  const handleConfirm = async () => {
    const transformedValue = {
      groupId: Array.from(checkedIds).join(','),
      recipientId: ids.join(',')
    }
    return await bulkAddGroup(transformedValue)
  }

  const { onSubmitForm } = useHandleForm({
    onSubmit: handleConfirm,
    setError,
    isValidForm: true,
    fnAfterSubmit: onResetBulkModal
  })

  const handleCheckboxChange = useCallback((checked: boolean, id: number) => {
    setCheckedIds((prev) => {
      const newCheckedIds = [...prev]
      if (checked) {
        newCheckedIds.push(id)
      } else {
        newCheckedIds.splice(newCheckedIds.indexOf(id), 1)
      }
      return newCheckedIds
    })
  }, [])

  return (
    <Modal
      cancelText='キャンセル'
      centered
      destroyOnClose
      okText='登録'
      onCancel={onClose}
      open={isOpen}
      title={<div className='text-center text-xl font-bold'>リストへ追加・新規リスト登録</div>}
      okButtonProps={{ danger: true }}
      onOk={handleSubmit(onSubmitForm)}
      footer={[
        <Button key='cancel' onClick={onClose}>
          キャンセル
        </Button>,
        <Button key='submit' type='primary' disabled={checkedIds.length === 0} onClick={handleSubmit(onSubmitForm)} danger>
          登録
        </Button>
      ]}
    >
      <form className='flex w-full max-w-xl flex-col gap-4'>
        <div className='flex flex-col gap-4 rounded-md border bg-[#dddd]'>
          <ListDistributions
            onCheckboxChange={handleCheckboxChange}
            checkedIds={checkedIds}
            groupList={groupList}
            onFetchGroupList={onFetchGroupList}
          />
        </div>
      </form>
    </Modal>
  )
}

export default AddGroupRecipientModal
