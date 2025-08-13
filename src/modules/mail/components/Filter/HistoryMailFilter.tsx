import { useEffect } from 'react'
import { Space, Switch } from 'antd'
import useHandleFilterHistory, { filterKey } from '@/modules/mail/hooks/useHandleFilterHistory'

const HistoryMailFilter = ({ onFetch, onSetQueryParams }: { onFetch: (params: { [key: string]: any }) => void, onSetQueryParams: (params: { [key: string]: any }) => void }) => {
  const { filter, onChangeFilter } = useHandleFilterHistory()

  useEffect(() => {
    (async () => {
      onFetch({
        type: filter[filterKey.TYPE]
      })
      onSetQueryParams({
        type: filter[filterKey.TYPE]
      })
    })()
  }, [filter[filterKey.TYPE]])

  return (
    <div className='flex items-center gap-4'>
      <Space direction='horizontal'>
        <Switch
          checkedChildren='テキスト'
          unCheckedChildren='テキスト'
          checked={filter[filterKey.TEXT]}
          onChange={onChangeFilter(filterKey.TEXT)}
        />
        <Switch
          checkedChildren='HTML'
          unCheckedChildren='HTML'
          checked={filter[filterKey.HTML]}
          onChange={onChangeFilter(filterKey.HTML)}
        />
      </Space>
    </div>
  )
}

export default HistoryMailFilter
