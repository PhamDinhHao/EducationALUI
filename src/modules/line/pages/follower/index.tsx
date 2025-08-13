import { useEffect } from 'react'
import FollowerTable from '@/modules/line/components/Table/FollowerTable'
import { LineUser } from '@/modules/line/core/types/line-user.type'
import { fetchFollowerList } from '@/modules/line/server-action/line-users'
import useFetchDataTable from '@/shared/hooks/useFetchDataTable'

const FollowerPage = () => {
  const { onFetch, dataTable, pagination } = useFetchDataTable<LineUser>(fetchFollowerList)

  useEffect(() => {
    (async () => {
      await onFetch({ page: 1 })
    })()
  }, [])
  return (
    <div className='p-4'>
      <FollowerTable dataSource={dataTable} pagination={pagination} onFetch={onFetch} />
    </div>
  )
}

export default FollowerPage
