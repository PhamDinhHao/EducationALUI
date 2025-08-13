import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Modal } from 'antd'
import _ from 'lodash'
import { FormField } from '@shared/components/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import ListDistributions from '@/modules/mngRecipients/components/Group/ListDistributions'
import useHandleForm from '@/shared/hooks/useHandleForm'
import { createRecipient, updateRecipient } from '@/modules/mngRecipients/services/recipient.service'
import { Recipient, RecipientForm } from '@/modules/mngRecipients/core/types/recipient.type'
import {
  RegistrationRecipientSchema,
  TRegistrationRecipient
} from '@/modules/mngRecipients/core/config/form/recipient-form'
import useInitFormRecipient from '@/modules/mngRecipients/hooks/useInitFormRecipient'
import { Group } from '@/shared/core/types/group.type'
import { situationOptions } from '@/modules/mngRecipients/core/config/select-options'

type Props = {
  isOpen: boolean
  onClose: () => void
  data?: Recipient
  groupList: Group[]
  onFetchTable: () => void
  onFetchGroupList: () => void
}

const RegistrationRecipientModal: React.FC<Props> = ({
  isOpen,
  onClose,
  data,
  groupList,
  onFetchTable,
  onFetchGroupList
}) => {
  const { initFormData, checkedIds, onSetCheckedIds } = useInitFormRecipient(data)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<RecipientForm>({
    resolver: zodResolver(RegistrationRecipientSchema),
    values: initFormData,
    mode: 'all'
  })

  const onSubmit = async (values: TRegistrationRecipient, recipientId?: number | string) => {
    const transformedValues = {
      ...values,
      groupId: Array.from(checkedIds).join(',')
    }
    return recipientId
      ? await updateRecipient(+recipientId, transformedValues)
      : await createRecipient(transformedValues)
  }

  const { onSubmitForm } = useHandleForm({
    onSubmit,
    setError,
    id: data?.id,
    isValidForm: true,
    fnAfterSubmit: onFetchTable
  })

  const handleCheckboxChange = useCallback((checked: boolean, id: number) => {
    onSetCheckedIds((prev) => {
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
      title={<div className='text-center'>読者個別編集</div>}
      footer={null}
    >
      <form className='flex w-full max-w-xl flex-col gap-4' onSubmit={handleSubmit(onSubmitForm)}>
        <FormField error={errors.email} label='Email' name='email' register={register} type='input' required={true} />
        <FormField
          error={errors.situation}
          label='状態'
          name='situation'
          register={register}
          options={situationOptions.slice(1)}
          type='select'
          fieldType='select'
          required={true}
        />
        <FormField error={errors.name} label='氏名' name='name' register={register} type='input' />
        <div className='flex flex-col gap-4 rounded-md border bg-[#dddd]'>
          <ListDistributions
            groupList={groupList}
            onCheckboxChange={handleCheckboxChange}
            checkedIds={checkedIds}
            onFetchGroupList={onFetchGroupList}
          />
        </div>

        <div className='flex justify-center gap-4'>
          <Button type='default' onClick={onClose}>
            キャンセル
          </Button>
          <Button type='primary' htmlType='submit' danger>
            更新
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default RegistrationRecipientModal
