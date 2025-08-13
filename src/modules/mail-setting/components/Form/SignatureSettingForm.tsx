import { useCallback, useEffect, useRef } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Button } from 'antd'
import Quill from 'quill'
import useHandleForm from '@/shared/hooks/useHandleForm'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  SignatureSettingSchema,
  TSignatureSetting
} from '@/modules/mail-setting/core/config/form/signature-setting-form'
import { Mail } from '@/modules/mail-setting/core/types/mail-setting.type'
import { updateMailSetting } from '@/modules/mail-setting/services/mail-setting.service'

type SignatureSettingProps = {
  isOpen: boolean
  onCancel: () => void
  data: Mail | undefined
  onFetchTable: () => void 
}

const SignatureSettingForm = ({ isOpen, onCancel, data, onFetchTable }: SignatureSettingProps) => {
  const quillRef = useRef<Quill | null>(null)
  const editorRef = useRef<HTMLDivElement>(null)
  const isInitializedRef = useRef(false)
  const { handleSubmit, setError, reset, control, setValue } = useForm<TSignatureSetting>({
    resolver: zodResolver(SignatureSettingSchema),
    values: {
      signature: data?.signature || '',
      id: data?.id || ''
    },
    mode: 'all'
  })

  const handleSubmitForm = async (data: TSignatureSetting) => {
    if (!data.id) throw new Error('ID is required')
    return await updateMailSetting(+data.id, { signature: data.signature })
  }
  const handleAfterSubmit = () => {
    onFetchTable()
    reset()
  }
  const { onSubmitForm } = useHandleForm({
    onSubmit: handleSubmitForm,
    id: data?.id,
    setError,
    isValidForm: true,
    fnAfterSubmit: handleAfterSubmit
  })

  const handleClose = useCallback(() => {
    reset()
    onCancel()
  }, [])

  useEffect(() => {
    if (editorRef.current && !isInitializedRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            ['link'],
          ]
        },
        theme: 'snow'
      })

      if (data?.signature) {
        quillRef.current.root.innerHTML = data.signature
      }

      quillRef.current.on('text-change', () => {
        const content = quillRef.current?.root.innerHTML || ''
        const isEmptyContent = quillRef.current?.getText()?.trim() === ''
        setValue('signature', isEmptyContent ? '' : content)
      })

      isInitializedRef.current = true
    }

    return () => {
      if (!isOpen) {
        isInitializedRef.current = false
        if (quillRef.current) {
          quillRef.current = null
        }
      }
    }
  }, [isOpen, data?.signature])

  return (
    <form className='flex w-full flex-col gap-4' onSubmit={handleSubmit(onSubmitForm)}>
      <div className='flex items-center justify-between gap-1'>
        <label className='font-semibold' htmlFor='signature'>
          署名
        </label>
      </div>
      <div className='h-[300px]'>
        <Controller
          name='signature'
          control={control}
          render={({ fieldState: { error } }) => (
            <div>
              <div className="h-[300px] flex flex-col">
                <div ref={editorRef} className="flex-grow overflow-auto" />
              </div>
              {error && <span className='text-red-500'>{error.message}</span>}
            </div>
          )}
        />
      </div>
      <div className='flex justify-end gap-4'>
        <Button onClick={handleClose} type='default'>
          キャンセル
        </Button>
        <Button type='primary' htmlType='submit' danger>
          登録
        </Button>
      </div>
    </form>
  )
}

export default SignatureSettingForm
