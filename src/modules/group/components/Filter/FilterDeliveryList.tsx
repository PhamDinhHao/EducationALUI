import React, { useCallback, useEffect, useMemo } from 'react'
import { Button, Select } from 'antd'
import SearchRow from '@/modules/group/components/SearchRow/SearchRow'
import { searchFieldOptions } from '@/modules/group/core/config/select-options'
import useValidate from '@/modules/group/hooks/useValidate'
import { initQueryParams } from '@/modules/group/core/constants'

const FilterDeliveryList = ({ onClose, useFilter, onSetModalName }: { onClose: () => void; useFilter: any, onSetModalName: (name: string) => void }) => {
  const { filter, onAddGroupSearch, onAddConditions, onRemoveConditions, onChangeFilter, onChangeBaseFilter, onSetFilter } =
    useFilter

  const { errorFields, onHandleCheckDoubleField, onHandleValidateForm } = useValidate(filter)

  useEffect(() => {
    onHandleCheckDoubleField()
  }, [filter])

  const handleSubmit = () => {
    if (!onHandleValidateForm()) return
    onSetModalName('previewDelivery')
  }

  const handleClose = useCallback(()=>{
    onClose()
    onSetFilter(initQueryParams)
  }, [])

  const hasErrors = useMemo(() => Object.keys(errorFields).length > 0, [errorFields])

  return (
    <div className='mx-auto max-w-4xl p-6'>
      <h1 className='mb-6 text-sm font-bold'>絞り込み条件を設定してください</h1>

      <div className='mb-6'>
        {Object.keys(filter.conditions).map((groupKey, index) => {
          if (isNaN(Number(groupKey))) return null
          const group = filter.conditions[Number(groupKey)]
          return (
            <React.Fragment key={groupKey}>
              <div>
                <label className='mb-2 text-sm'>項目</label>
                <Select
                  className='w-full'
                  value={group[0].field}
                  onChange={onChangeBaseFilter('field', Number(groupKey))}
                  options={searchFieldOptions}
                />
                {errorFields[Number(groupKey)] && (
                  <div className='mt-1 text-sm text-red-500'>{errorFields[Number(groupKey)]['field']}</div>
                )}
              </div>
              {group.length > 0 && (
                <>
                  <div className='mb-4 rounded-lg bg-gray-50 p-4'>
                    {group.map((item: any) => (
                      <div key={item.id}>
                        <SearchRow
                          groupId={Number(groupKey)}
                          item={item}
                          onRemoveCriteria={onRemoveConditions}
                          onChangeFilter={onChangeFilter}
                          isRemovable={
                            group.length > 1 ||
                            Object.keys(filter.conditions).filter((key) => !isNaN(Number(key))).length > 1
                          }
                        />
                        {errorFields[Number(groupKey)] && (
                          <div className='ml-6 mt-1 text-sm text-red-500'>{errorFields[Number(groupKey)][item.id]}</div>
                        )}
                      </div>
                    ))}
                    {group[0].field !== 'createdAt' && group[0].field !== 'numberOfError' && (
                      <Button
                        onClick={() => onAddConditions(Number(groupKey))}
                        className='ml-6 mt-2 text-sm text-gray-600'
                      >
                        + 検索ワード追加（or条件）
                      </Button>
                    )}
                  </div>
                  {index < Object.keys(filter.conditions).filter((key) => !isNaN(Number(key))).length - 1 && (
                    <div className='mb-4 text-center text-gray-600'>もしくは</div>
                  )}
                </>
              )}
            </React.Fragment>
          )
        })}

        <Button
          onClick={onAddGroupSearch}
          className='rounded-md border border-gray-300 px-4 py-1.5 text-sm text-gray-600 hover:bg-gray-50'
        >
          + 項目追加（and条件）
        </Button>
      </div>

      <div className='sticky flex justify-end'>
        <div className='flex justify-end gap-4'>
          <Button onClick={handleClose} className='rounded border px-6 py-2 hover:bg-gray-50'>
            キャンセル
          </Button>
          <Button type='primary' danger onClick={handleSubmit} disabled={hasErrors}>
            検索
          </Button>
        </div>
      </div>
    </div>
  )
}

export default FilterDeliveryList
