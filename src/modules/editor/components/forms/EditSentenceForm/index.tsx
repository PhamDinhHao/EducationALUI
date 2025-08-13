import { FormField } from '@/shared/components/ui'
import { NewSentenceSchema, TNewSentence } from '@/modules/editor/schemas'
import { useForm } from 'react-hook-form'
import { updateSentence } from '@/modules/editor/Service/sentence.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler } from 'react-hook-form'
import { useBoundStore } from '@/shared/stores'

type EditSentenceFormProps = {
  id: string
  data: TNewSentence
  onFetch: (params: { [key: string]: any }) => void
  queryParams: { [key: string]: any }
  onClose: () => void
}

const EditSentenceForm: React.FC<EditSentenceFormProps> = ({ id, data, onFetch, queryParams, onClose }) => {
  const { setStatusLoading } = useBoundStore()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<TNewSentence>({ resolver: zodResolver(NewSentenceSchema), defaultValues: data })

  const onSubmit: SubmitHandler<TNewSentence> = async (data) => {
    setStatusLoading(true)
    const res = await updateSentence(id, data)
    if (res.status === 200) {
      setStatusLoading(false)
      onClose()
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

export default EditSentenceForm
