import React, { useCallback } from 'react'
import { Button, Modal, Select } from 'antd'
import _ from 'lodash'
import dayjs from 'dayjs'
import SearchRow from '@/modules/mngRecipients/components/SearchRow/SearchRow'
import { FilterState } from '@/modules/mngRecipients/hooks/useHandleFilterRecipient'
import { situationOptions } from '@/modules/mngRecipients/core/config/select-options'
import { OptionSelect } from '@/shared/core/types/common.type'
import { decamelize } from 'humps'

type Props = {
  isOpen: boolean
  onClose: () => void
  isSituation?: boolean
  onFetch: (params: { [key: string]: any }) => void
  onSetQueryParams: (params: { [key: string]: any }) => void
  filter: FilterState
  onAddGroupSearch: () => void
  onAddCriteria: (groupId: number) => void
  onRemoveCriteria: (groupId: number, itemId: number) => () => void
  onChangeFilter: (groupId: number, itemId: number, field: string, value: any) => void
  onChangeBaseFilter: (field: string, buttonValue?: any) => (value: any) => void
  onReset: () => void
  optionsGroup: OptionSelect[]
}

const SearchRecipientTrashModal: React.FC<Props> = ({
  isOpen,
  onClose,
  isSituation = true,
  onFetch,
  onSetQueryParams,
  filter,
  onAddGroupSearch,
  onAddCriteria,
  onRemoveCriteria,
  onChangeFilter,
  onChangeBaseFilter,
  onReset,
  optionsGroup
}) => {
  const handleSubmit = useCallback(() => {
    const processedFilter = _.cloneDeep(filter)
    Object.keys(processedFilter.criteria).forEach(groupKey => {
      if (isNaN(Number(groupKey))) return;
      const group = processedFilter.criteria[Number(groupKey)];
      group.forEach(item => {
        if (item.field === '' && item.searchValue) {
          const [min, max] = item.searchValue.split(',').map(Number);
          item.min = min;
          item.max = max;
          delete item.searchValue;
          delete item.searchType;
        }
        if (item.field === 'createdAt' && Array.isArray(item.searchValue)) {
          const [startDate, endDate] = item.searchValue.map((date: string | Date) => 
            dayjs(date).format('YYYY-MM-DD')
          );
          item.start = startDate;
          item.end = endDate;
          delete item.searchValue;
        }
        item.field = decamelize(item.field)
        item.field = decamelize(item.field)
      });
    });

    const { criteria, ...restFilter } = processedFilter;
    const transformedFilter = {
      ...restFilter,
      criteriaTrash: criteria
    };
    
    onSetQueryParams(transformedFilter)
    onFetch(transformedFilter)
    onClose()
  }, [filter]);

  return (
    <Modal
      cancelText='キャンセル'
      centered
      destroyOnClose
      okText='検索'
      onCancel={onClose}
      open={isOpen}
      title={<div className='text-center text-xl font-bold'>読者検索条件</div>}
      footer={null}
      width={800}
    >
      <div className='mx-auto max-w-4xl p-6'>
        <h1 className='mb-6 text-sm font-bold'>検索条件を設定してください</h1>
        <div className='mb-4 flex items-center justify-between'>
          <div className='flex flex-col'>
            <label className='w-20'>リスト</label>
            <Select
              className='w-40'
              options={optionsGroup}
              value={filter.criteria.groupId}
              onChange={onChangeBaseFilter('groupId')}
            />
          </div>
          {isSituation && <div className='flex gap-2'>
            <div className='text-left'>
              <div className='flex flex-col'>
                <span className='mr-2'>状態</span>
                <div className='flex flex-wrap'>
                  {situationOptions.slice(0, -1).map((situation) => (
                    <Button
                      key={situation.value}
                      className={`rounded px-3 py-1 text-sm transition-all ${
                        filter.criteria.situation === situation.value
                          ? 'border-red-500 bg-red-500 text-white'
                          : 'bg-white text-black hover:border-red-500 hover:text-red-500'
                      }`}
                      onClick={onChangeBaseFilter('situation', situation.value)}
                    >
                      {situation.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>}
        </div>
        <div className='mb-6'>
          {Object.keys(filter.criteria).map((groupKey, index) => {
            if (isNaN(Number(groupKey))) return null
            const group = filter.criteria[Number(groupKey)]

            return (
              <React.Fragment key={groupKey}>
                {group.length > 0 && (
                  <>
                    <div className='mb-4 rounded-lg bg-gray-50 p-4'>
                      {group.map((item: any) => (
                        <SearchRow
                          key={item.id}
                          groupId={Number(groupKey)}
                          item={item}
                          onRemoveCriteria={onRemoveCriteria}
                          onChangeFilter={onChangeFilter}
                          isRemovable={
                            group.length > 1 ||
                            Object.keys(filter.criteria).filter((key) => !isNaN(Number(key))).length > 1
                          }
                        />
                      ))}
                      <Button onClick={() => onAddCriteria(Number(groupKey))} className='mt-2 text-sm text-gray-600'>
                        + 項目追加 (and条件)
                      </Button>
                    </div>
                    {index < Object.keys(filter.criteria).filter((key) => !isNaN(Number(key))).length - 1 && (
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
            + 項目追加 (or条件)
          </Button>
        </div>
        <div className='sticky flex justify-end'>
          <Button onClick={onReset} className='absolute left-0 rounded border px-6 py-2 hover:bg-gray-50'>
            全ての条件をリセット
          </Button>
          <div className='flex justify-end gap-4'>
            <Button onClick={onClose} className='rounded border px-6 py-2 hover:bg-gray-50'>
              キャンセル
            </Button>
            <Button type='primary' danger onClick={handleSubmit}>
              検索
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default SearchRecipientTrashModal
