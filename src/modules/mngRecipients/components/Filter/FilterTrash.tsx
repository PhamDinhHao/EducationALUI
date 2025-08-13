import { useCallback } from 'react'
import { Button, Dropdown, MenuProps } from 'antd'
import { DownOutlined, FilterOutlined } from '@ant-design/icons'
import { getSearchFieldName, getSearchTypeName, getSituationName } from '@/modules/mngRecipients/utils'
import { Pagination } from '@/shared/core/types/common.type'
import _ from 'lodash'
import { initQueryParams } from '@/modules/mngRecipients/core/constants'
import { Recipient } from '@/modules/mngRecipients/core/types/recipient.type'

const FilterTrash = ({
  pagination,
  onSetModalName,
  queryParams,
  onGetGroupName,
  items,
  onSetTypeBulk,
  dataTable
}: {
  pagination: Pagination | {}
  onSetModalName: (modalName: string) => void
  queryParams: { [key: string]: any }
  onGetGroupName: (groupId: string | number) => string
  items: MenuProps['items']
  onSetTypeBulk: React.Dispatch<React.SetStateAction<string>>
  dataTable: Recipient[]
}) => {
  const { criteria } = queryParams

  const handleOpenSearch = useCallback(() => {
    onSetModalName('searchTrash')
  }, [])

  const handleSetTypeBulk = useCallback(() => {
    onSetTypeBulk('all')
  }, [])

  return (
    <div className='flex justify-between p-4'>
      <div className='flex items-center gap-4'>
        <Button onClick={handleOpenSearch}>
          <FilterOutlined className={!_.isEmpty(queryParams) && !_.isEqual(queryParams, initQueryParams) ? 'text-red-500' : ''} />
          <span>読者検索</span>
        </Button>
        <p>
          リスト(<span className='font-bold'>{onGetGroupName(criteria?.groupId)}</span>) and 状態 (
          <span className='font-bold'>{getSituationName(criteria?.situation)}</span>)
          <span>
            {queryParams?.criteria &&
              Object.keys(queryParams.criteria).map((groupKey, index) => {
                if (isNaN(Number(groupKey))) return null
                const group = queryParams.criteria[Number(groupKey)]

                return group?.length > 0 ? (
                  <span key={groupKey}>
                    {index === 0 && (group[0]?.searchValue || group[0]?.min || group[0]?.start) && ' and '}
                    {index > 0 && ' or '}
                    <span>
                      {group.map((criterion: any, i: number) => {
                        let displayValue

                        if (criterion.field === 'numberOfError') {
                          if (!criterion.min && !criterion.max) return null
                          displayValue = `${criterion.min ?? ''}~${criterion.max ?? ''}`
                        } else if (criterion.field === 'createdAt') {
                          if (!criterion.start && !criterion.end) return null
                          displayValue = `${criterion.start || ''}~${criterion.end || ''}`
                        } else {
                          if (!criterion.searchValue) return null
                          displayValue = criterion.searchValue
                        }

                        return (
                          <span key={i}>
                            {i > 0 && ' and '}
                            {getSearchFieldName(criterion.field)}(
                            <span className='font-bold'>{`${displayValue} ${getSearchTypeName(criterion.field, criterion.searchType)}`}</span>
                            )
                          </span>
                        )
                      })}
                    </span>
                  </span>
                ) : null
              })}
          </span>
        </p>
      </div>
      <div className='flex items-center gap-1'>
        <p className='font-semibold'>
          読者数: <span>{(pagination as { total?: number }).total || '----'} を</span>
        </p>
        <Dropdown menu={{ items: items, disabled: dataTable.length === 0 }} trigger={['click']} placement='bottomRight'>
          <Button onClick={handleSetTypeBulk}>
            <span>一括操作</span>
            <DownOutlined />
          </Button>
        </Dropdown>
      </div>
    </div>
  )
}

export default FilterTrash
