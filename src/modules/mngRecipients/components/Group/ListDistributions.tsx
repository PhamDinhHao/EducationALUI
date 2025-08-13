import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Checkbox } from 'antd'
import { Group } from '@/shared/core/types/group.type'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import { FormField } from '@/shared/components/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { createGroup } from '@/shared/services/group.service'
import { GroupSchema, TGroup } from '@/shared/core/config/form/group-form'
import useHandleForm from '@/shared/hooks/useHandleForm'

const ListDistributions: React.FC<{
  groupList: Group[]
  onCheckboxChange: (checked: boolean, id: number) => void
  checkedIds: (string | number)[]
  onFetchGroupList: () => void
}> = ({ groupList, onCheckboxChange, checkedIds, onFetchGroupList }) => {
  const {
    register,
    handleSubmit,
    setError,
    watch,
    setValue,
    formState: { errors }
  } = useForm<TGroup>({
    resolver: zodResolver(GroupSchema),
    values: { name: '' },
    mode: 'all'
  })

  const handleCreateGroup = async (data: TGroup) => {
    return await createGroup(data)
  }

  const handleAfterSubmit = useCallback(() => {
    setValue('name', '')
    onFetchGroupList()
  }, [])

  const { onSubmitForm } = useHandleForm({
    onSubmit: handleCreateGroup,
    setError,
    isValidForm: true,
    fnAfterSubmit: handleAfterSubmit
  })

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
    }
  }, [])

  const handleCheckboxChange = useCallback((e: CheckboxChangeEvent) => {
    const { checked, value } = e.target
    onCheckboxChange(checked, value)
  }, [])

  return (
    <div className='flex flex-col gap-2 rounded-md border p-4'>
      <p className='font-semibold'>リスト</p>
      <div>
        {groupList?.map((item) => (
          <Checkbox
            className='flex items-center'
            key={item.id}
            value={item.id}
            checked={checkedIds.includes(Number(item.id))}
            onChange={handleCheckboxChange}
          >
            {item.name}
          </Checkbox>
        ))}
      </div>
      <div className='flex items-center gap-4'>
        <FormField
          className='h-9 w-full rounded-lg border p-2'
          defaultValue=''
          error={errors.name}
          name='name'
          register={register}
          type='input'
          onKeyDown={handleKeyDown}
        />
        <Button htmlType='button' onClick={handleSubmit(onSubmitForm)} className='h-9' disabled={!watch('name')}>
          新規リスト登録
        </Button>
      </div>
    </div>
  )
}

export default ListDistributions
