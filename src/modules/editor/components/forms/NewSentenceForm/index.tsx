import React from 'react'
import { FormField } from '@/shared/components/ui'
import { SubmitHandler } from 'node_modules/react-hook-form/dist/types'
import { NewSentenceSchema } from '@/modules/editor/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { createSentence } from '@/modules/editor/Service/sentence.service'
import { useForm } from 'react-hook-form'
import { TNewSentence } from '@/modules/editor/schemas'
import { useBoundStore } from '@/shared/stores'

type NewSentenceFormProps = {
  onClose: () => void
  onFetch: (params: { [key: string]: any }) => void
  queryParams: { [key: string]: any }
}

const NewSentenceForm: React.FC<NewSentenceFormProps> = ({ onClose, onFetch, queryParams }) => {
  const { setStatusLoading } = useBoundStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<TNewSentence>({ resolver: zodResolver(NewSentenceSchema)})

  const onSubmit: SubmitHandler<TNewSentence> = async (data) => {
    setStatusLoading(true)
    const res = await createSentence(data)
    if (res.status === 200) {
      onClose()
      setStatusLoading(false)
      onFetch(queryParams)
      reset()
    }
  }

  const submitHandler = handleSubmit(onSubmit)

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form className='flex w-full max-w-xl flex-col gap-4' onSubmit={submitHandler}>
      <FormField
        error={errors.name}
        label='ネーム'
        name='name'
        placeholder='Enter your name'
        register={register}
        type='text'
      />
      <FormField
        error={errors.content}
        fieldType='textarea'
        label='内容'
        name='content'
        placeholder='Enter your content'
        register={register}
        type='text'
      />
      <button className='mt-2 rounded-xl border py-2' type='submit'>
        保存
      </button>
    </form>
  )
}

export default NewSentenceForm
