import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import useFetchDataTable from '@/shared/hooks/useFetchDataTable'
import { fetchJobList } from '@/modules/mngRecipients/server-action/job-list'
import { Job } from '@/modules/mngRecipients/core/types/job.type'
import RecipientJobTable from '@/modules/mngRecipients/components/Table/RecipientJobTable'

const RecipientsJobsPage: React.FC = () => {
  const { onFetch, dataTable, pagination } = useFetchDataTable<Job>(fetchJobList)

  useEffect(() => {
    (async () => {
      await onFetch({ page: 1 })
    })()
  }, [])

  return (
    <div className='p-4'>
      <div className='flex justify-between p-4'>
        <p>一括処理履歴は30日経過後自動削除します</p>
        <Link className='underline hover:underline' to='/'>
          API一括処理エラーCSVダウンロードはこちら
        </Link>
      </div>
      <RecipientJobTable dataSource={dataTable} pagination={pagination} onFetch={onFetch} />
    </div>
  )
}

export default RecipientsJobsPage
