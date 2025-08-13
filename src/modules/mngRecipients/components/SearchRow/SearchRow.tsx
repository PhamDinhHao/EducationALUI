import { Button, Select, DatePicker, Input } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import dayjs, { Dayjs } from 'dayjs'
import { searchFieldOptions, typeSearchDateOptions, typeSearchDefaultOptions } from '@/modules/mngRecipients/core/config/select-options'
import { TypeSearchDate, TypeSearchDefault } from '@/modules/mngRecipients/core/enum/type-search.enum'
const { RangePicker } = DatePicker

interface SearchRowProps {
  groupId: number
  item: {
    id: number
    field: string
    searchValue: string
    searchType: string
  }
  onRemoveCriteria: (groupId: number, criteriaId: number) => () => void
  onChangeFilter: any
  isRemovable: boolean
}

const SearchRow: React.FC<SearchRowProps> = ({ groupId, item, onRemoveCriteria, isRemovable, onChangeFilter }) => {
  const renderSearchContent = () => {
    switch (item.field) {
      case 'email':
      case 'name':
        return (
          <>
            <div className='flex flex-1 flex-col'>
              <label className='pb-2'>検索ワード</label>
              <Input
                type='text'
                className='h-[30px] w-full rounded border'
                value={item.searchValue}
                onChange={onChangeFilter(groupId, item.id, 'searchValue')}
                disabled={item.searchType === TypeSearchDefault.ONLY_BLANK || item.searchType === TypeSearchDefault.EXCLUDE_BLANK}
              />
            </div>
            <div className='flex w-32 flex-col'>
              <label className='pb-2'>検索方法</label>
              <Select
                className='w-full rounded border'
                value={item.searchType}
                onChange={onChangeFilter(groupId, item.id, 'searchType')}
                options={typeSearchDefaultOptions}
              />
            </div>
          </>
        )
      case 'createdAt':
        const [startDateString, endDateString] = Array.isArray(item.searchValue) 
          ? item.searchValue 
          : (typeof item.searchValue === 'string' && item.searchValue ? item.searchValue.split(',') : [])
        
        const startDate = startDateString ? dayjs(startDateString) : null
        const endDate = endDateString ? dayjs(endDateString) : null

        return (
          <>
            <div className='flex flex-1 flex-col'>
              <label className='pb-2'>期間</label>
              <RangePicker
                showTime
                format='DD/MM/YYYY HH:mm'
                onChange={onChangeFilter(groupId, item.id, 'searchValue')}
                value={[startDate, endDate] as [Dayjs | null, Dayjs | null]}
                disabled={item.searchType === TypeSearchDate.ONLY_BLANK || item.searchType === TypeSearchDate.EXCLUDE_BLANK}
              />
            </div>
            <div className='flex w-32 flex-col'>
              <label className='pb-2'>検索方法</label>
              <Select
                className='w-32 rounded border'
                value={item.searchType}
                onChange={onChangeFilter(groupId, item.id, 'searchType')}
                options={typeSearchDateOptions}
              />
            </div>
          </>
        )
      case 'numberOfError':
        return (
          <>
            <div className='flex flex-1 flex-col'>
              <label className='pb-2'>期間</label>
              <Input
                type='number'
                className='h-[30px] rounded border'
                value={item.searchValue.split(',')[0] || ''}
                onChange={(e) => {
                  const [_, end] = item.searchValue.split(',');
                  const newValue = `${e.target.value}${end ? `,${end}` : ''}`;
                  onChangeFilter(groupId, item.id, 'searchValue')(newValue);
                }}
                placeholder='0'
              />
            </div>
            <label className='mt-4 text-xl opacity-30'>~</label>
            <div className='flex flex-1 flex-col'>
              <label className='pb-2'>期間</label>
              <Input
                type='number'
                className='h-[30px] rounded border'
                value={item.searchValue.split(',')[1] || ''}
                onChange={(e) => {
                  const [start] = item.searchValue.split(',');
                  const newValue = `${start || ''},${e.target.value}`;
                  onChangeFilter(groupId, item.id, 'searchValue')(newValue);
                }}
                placeholder='0'
              />
            </div>
          </>
        )
      default:
        return null
    }
  }

  return (
    <div className='mb-2 flex items-center gap-2'>
      <div className='flex flex-col'>
        <label className='pb-2'>項目</label>
        <Select
          className='w-40'
          value={item.field}
          onChange={onChangeFilter(groupId, item.id, 'field')}
          options={searchFieldOptions}
        />
      </div>
      {renderSearchContent()}
      {isRemovable ? (
        <Button onClick={onRemoveCriteria(groupId, item.id)} className='rounded p-2 hover:bg-gray-100'>
          <DeleteOutlined />
        </Button>
      ) : null}
    </div>
  )
}

export default SearchRow
