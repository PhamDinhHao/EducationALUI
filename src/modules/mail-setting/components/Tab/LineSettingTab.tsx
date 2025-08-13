import { initFormLineSetting, LineSettingSchema, TLineSetting } from '@/modules/mail-setting/core/config/form/line-setting-form'
import { FormField } from '@/shared/components/ui'
import { Button } from 'antd'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { fetchProfile } from '@/modules/line/server-action/profile-me'
import { useEffect, useState } from 'react'
import { updateProfile } from '@/shared/services/auth.service'

const LineSettingTab = () => {
  const [initFormData, setInitFormData] = useState<TLineSetting>(initFormLineSetting)

  useEffect(() => {
    (async () => {
      const profile = await fetchProfile()
      setInitFormData(profile)
    })()
  }, [])

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<TLineSetting>({
    resolver: zodResolver(LineSettingSchema),
    values: initFormData,
    mode: 'all'
  })

  const onSubmitForm = async (data: TLineSetting) => {
    await updateProfile(data)
  }

  return (
    <div className='p-4'>
      <form className='flex w-full flex-col gap-4' onSubmit={handleSubmit(onSubmitForm)}>
      <FormField error={errors.lineChannelAccessToken} label='チャネルアクセストークンライン' name='lineChannelAccessToken' register={register} type='text' />
      <FormField error={errors.lineChannelSecret} label='チャネルシークレットライン' name='lineChannelSecret' register={register} type='text' />
      <FormField error={errors.lineChannelId} label='チャネルIDライン' name='lineChannelId' register={register} type='text' />
      <div className='flex justify-end gap-4'>
        <Button type='primary' htmlType='submit'>
          保存
        </Button>
      </div>
    </form>
    </div>
  )
}

export default LineSettingTab
