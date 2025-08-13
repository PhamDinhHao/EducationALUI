import { TestMailFormSchema, TTestMailForm } from '@/modules/editor/core/config/form/test-mail-form'
import useFetchOptionMail from '@/modules/editor/hooks/useFetchOptionMail'
import { sendMailTest } from '@/modules/editor/Service/mail-test.service'
import FormSelect from '@/shared/components/Select/FormSelect'
import { FormField } from '@/shared/components/ui'
import useHandleForm from '@/shared/hooks/useHandleForm'
import { useErrorSendMailStore } from '@/shared/stores/errorSendMail'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from 'antd'
import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'

const SendMailPreviewForm = ({ content, onClose }: { content: string, onClose: () => void }) => {
  const { options } = useFetchOptionMail()
  const { setErrorContent } = useErrorSendMailStore()
  const {
    register,
    handleSubmit,
    setError,
    watch,
    reset,
    formState: { errors }
  } = useForm<TTestMailForm>({
    resolver: zodResolver(TestMailFormSchema),
    values: {
      emailSettingId: options?.[0]?.value || '',
      subject: '',
      content: content
    },
    mode: 'all'
  })

  const handleSubmitForm = async (values: TTestMailForm) => {
    return await sendMailTest(values)
  }

  const handleAfterSubmit = useCallback(() => {
    onClose()
    reset()
  }, [onClose, reset])

  const { onSubmitForm } = useHandleForm({
    onSubmit: handleSubmitForm,
    setError,
    isValidForm: true,
    fnAfterSubmit: handleAfterSubmit
  })

  useEffect(() => {
  if (errors.content) {
    setErrorContent(errors.content.message || '')
    onClose()
  } else {
    setErrorContent('')
  }
}, [errors.content])

  return (
    <form className='flex w-full max-w-xl flex-col gap-4' onSubmit={handleSubmit(onSubmitForm)}>
      <FormSelect
        register={register}
        name='emailSettingId'
        label='送信元アドレス'
        options={options}
        value={watch('emailSettingId') || ''}
        required={true}
      />
      <FormField
        register={register}
        error={errors.subject}
        name='subject'
        label='件名'
        required={true}
      />
      <FormField
        register={register}
        error={errors.email}
        fieldType='textarea'
        name='email'
        label='テスト宛先アドレス'
        required={true}
        note='最大5件のアドレスにテスト送信できます。複数のアドレスは、カンマ(,)で区切って入力してください。'
      />
      <div className='flex justify-end gap-4'>
        <Button type='default'>キャンセル</Button>
        <Button type='primary' htmlType='submit' danger>
          送信
        </Button>
      </div>
    </form>
  )
}

export default SendMailPreviewForm
