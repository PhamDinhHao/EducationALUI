import { Button, Modal } from 'antd'
import React, { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormField } from '@shared/components/ui'
import { createGroup, updateGroup } from '@/modules/group/services/group-list.service'
import { RegistrationGroupSchema, TRegistrationGroup } from '@/modules/group/core/config/form/group-form'
import { Group } from '@/shared/core/types'
import useInitFormGroup from '@/modules/group/hooks/useInitFormGroup'
import useHandleForm from '@/shared/hooks/useHandleForm'

type Props = {
  isOpen: boolean
  onClose: () => void
  data?: Group
  onFetch: (params: { [key: string]: any }) => void
  queryParams: { [key: string]: any }
}

const RegistrationGroupModal: React.FC<Props> = ({ isOpen, onClose, data, onFetch }) => {
  const { initFormData } = useInitFormGroup(data)
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset
  } = useForm<TRegistrationGroup>({
    resolver: zodResolver(RegistrationGroupSchema),
    values: initFormData,
    mode: 'all'
  })

  const handleConfirm = async (values: TRegistrationGroup, groupId?: number | string) => {
    return groupId
      ? await updateGroup(+groupId, values)
      : await createGroup(values)
  }

  const handleAfterSubmit = useCallback(() => {
    handleClose()
    onFetch({ page: 1 })
  }, [])

  const { onSubmitForm } = useHandleForm({
    onSubmit: handleConfirm,
    setError,
    id: data?.id,
    isValidForm: true,
    fnAfterSubmit: handleAfterSubmit
  })

  const handleClose = useCallback(() => {
    onClose()
    reset({
      name: ''
    })
  }, [])

  return (
    <Modal
      centered
      destroyOnClose
      onCancel={handleClose}
      open={isOpen}
      title={<div className='text-center text-xl font-bold'>リスト登録</div>}
      footer={null}
    >
      <form className='flex w-full max-w-xl flex-col gap-4' onSubmit={handleSubmit(onSubmitForm)}>
        <FormField error={errors.name} label='リスト名' name='name' register={register} type='text' required={true} />
        <div className='flex justify-end gap-4'>
          <Button type='default' onClick={handleClose}>
            キャンセル
          </Button>
          <Button type='primary' htmlType='submit' danger>
            登録
          </Button>
        </div>
      </form>
    </Modal>
  )
}
 
export default RegistrationGroupModal