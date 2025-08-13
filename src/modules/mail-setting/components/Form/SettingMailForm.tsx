import { useForm } from 'react-hook-form'
import { Button } from 'antd'
import _ from 'lodash'
import { TMailSetting } from '@/modules/mail-setting/core/config/form/mail-setting-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MailSettingSchema } from '@/modules/mail-setting/core/config/form/mail-setting-form'
import { Mail } from '@/modules/mail-setting/core/types/mail-setting.type'
import { FormField } from '@/shared/components/ui'
import useInitFormData from '@/modules/mail-setting/hooks/useInitFormData'
import useHandleForm from '@/shared/hooks/useHandleForm'
import { updateMailSetting } from '@/modules/mail-setting/services/mail-setting.service'
import { createMailSetting } from '@/modules/mail-setting/services/mail-setting.service'
import { encryptionOptions } from '@/modules/mail-setting/core/config/select-option'
import FormSelect from '@/shared/components/Select/FormSelect'
import { useCallback } from 'react'

type SettingMailFormProps = {
  data: Mail | undefined
  onFetchTable: () => void
  onClose: () => void
}

const SettingMailForm = ({ data, onFetchTable, onClose }: SettingMailFormProps) => {
  const { initFormData } = useInitFormData(data)

  const {
    register,
    handleSubmit,
    setError,
    watch,
    reset,
    formState: { errors }
  } = useForm<TMailSetting>({
    resolver: zodResolver(MailSettingSchema),
    values: initFormData,
    mode: 'all'
  })

  const handleSubmitForm = async (values: TMailSetting, id?: number | string) => {
    const transformData = id && !values.password ? _.omit(values, ['password']) : values
    return id ? await updateMailSetting(+id, transformData) : await createMailSetting(transformData);
  }

  const handleAfterSubmit = () => {
    onFetchTable()
    reset()
  }

  const { onSubmitForm } = useHandleForm({
    onSubmit: handleSubmitForm,
    id: initFormData.id,
    setError,
    isValidForm: true,
    fnAfterSubmit: handleAfterSubmit
  })

  const handleCancel = useCallback(() => {
    reset()
    onClose()
  }, [])

  return (
    <form className='flex w-full max-w-xl flex-col gap-4' onSubmit={handleSubmit(onSubmitForm)}>
      <FormField
        error={errors.fromName}
        label='表示名'
        name='fromName'
        register={register}
        type='text'
        required={true}
      />
      <FormField
        error={errors.fromAddress}
        label='メールアドレス'
        name='fromAddress'
        register={register}
        type='text'
        required={true}
      />
      <FormField
        error={errors.username}
        label='ユーザー名'
        name='username'
        register={register}
        type='text'
        required={true}
      />
      <FormField
        error={errors.password}
        label='パスワード'
        name='password'
        register={register}
        type='text'
        required={!initFormData?.id}
      />
      <FormField error={errors.host} label='ホスト' name='host' register={register} type='text' required={true} />
      <FormField error={errors.port} label='ポート' name='port' register={register} type='text' required={true} />
      <FormSelect
        register={register}
        name='encryption'
        label='暗号化'
        options={encryptionOptions}
        value={watch('encryption')}
      />
      <FormField error={errors.ccEmail} label='CCメールアドレス' name='ccEmail' register={register} type='text' />
      <div className='flex justify-end gap-4'>
        <Button type='default' onClick={handleCancel}>キャンセル</Button>
        <Button type='primary' htmlType='submit' danger>
          登録
        </Button>
      </div>
    </form>
  )
}

export default SettingMailForm
