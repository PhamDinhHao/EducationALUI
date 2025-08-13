import { useForm } from 'react-hook-form'
import { Button } from 'antd'
import _ from 'lodash'
import { DownloadOutlined } from '@ant-design/icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { RecipientFilterSchema, TRecipientFilter } from '@/modules/group/core/config/form/recipient-filter-form'
import useHandleForm from '@/shared/hooks/useHandleForm'
import { FormField } from '@/shared/components/ui'
import useFetchDataPreview from '@/modules/group/hooks/useFetchDataPreview'
import { useCallback } from 'react'
import { createRecipientFilter, exportRecipientFilter, updateRecipientFilter } from '@/modules/group/services/recipient-filter.service'
import { initQueryParams } from '@/modules/group/core/constants'
import { RecipientFilter } from '@/modules/group/core/types/recipient-filter.type'
import { handleDownloadCSV } from '@/shared/utils'
import { handleTransformCondition, transformToSnakeCase } from '@/modules/group/utils'

type RecipientFilterFormProps = {
  filter: any
  onSetModalName: (name: string) => void
  onSetFilter: any
  onFetch: (params: { [key: string]: any }) => void
  editData: RecipientFilter | null
}

const RecipientFilterForm = ({ filter, onSetModalName, onSetFilter, onFetch, editData }: RecipientFilterFormProps) => {
  const { conditions, resultFilter, initData } = useFetchDataPreview(filter, editData)

  const {
    handleSubmit,
    setError,
    register,
    formState: { errors }
  } = useForm<TRecipientFilter>({
    resolver: zodResolver(RecipientFilterSchema),
    values: initData,
    mode: 'all'
  })

  const handleSubmitForm = async (values: TRecipientFilter, id?: number | string) => {
    const transformValues = {
      ...values,
      conditions: Object.values(filter.conditions)
        .flat()
        .map((condition) => handleTransformCondition(condition))
        .map((condition) => transformToSnakeCase(condition))
    }

    return id ? await updateRecipientFilter(id, transformValues) : await createRecipientFilter(transformValues)
  }

  const handleAfterSubmit = useCallback(() => {
    onSetModalName('')
    onSetFilter(initQueryParams)
    onFetch({ page: 1 })
  }, [])

  const { onSubmitForm } = useHandleForm({
    onSubmit: handleSubmitForm,
    setError,
    isValidForm: true,
    id: editData?.id,
    fnAfterSubmit: handleAfterSubmit
  })

  const handleCancel = useCallback(() => {
    onSetModalName(editData ? '' : 'filterDelivery')
  }, [editData])

  const handleDownload = useCallback(async () => {
    const transformValues = Object.values(editData ? editData.conditions : filter.conditions)
      .flat()
      .map((condition: any) => transformToSnakeCase(condition))

    const res = await exportRecipientFilter({ conditions: transformValues })
    if (res.data) handleDownloadCSV(res.data)()
  }, [filter, editData])

  return (
    <form className='flex w-full flex-col gap-4' onSubmit={handleSubmit(onSubmitForm)}>
      <FormField error={errors.name} label='フィルタ名' name='name' register={register} type='text' required />

      <div className='flex items-center justify-end gap-2'>
        <span>該当読者数/全登録者数：{resultFilter ? resultFilter : '0/0'}</span>
        <Button onClick={handleDownload} icon={<DownloadOutlined />}>
          読者CSV
        </Button>
      </div>

      {conditions && (
        <table className='mt-4 w-full border-collapse'>
          <tbody>
            {Object.entries(conditions).map(([key]) => (
              <tr key={key}>
                <th className='border p-2 text-left'>{key}</th>
                <td className='border p-2'>{conditions[key]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className='flex justify-end gap-4'>
        <Button type='default' onClick={handleCancel}>
          戻る
        </Button>
        <Button type='primary' htmlType='submit' danger>
          保存
        </Button>
      </div>
    </form>
  )
}

export default RecipientFilterForm
