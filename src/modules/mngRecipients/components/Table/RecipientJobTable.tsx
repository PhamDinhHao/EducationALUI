import { Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { formattedDate, handleDownloadCSV } from '@/shared/utils'
import { Row } from 'antd'
import { CheckCircleTwoTone, ExclamationCircleTwoTone, DownloadOutlined, LoadingOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { Empty } from 'antd'
import { Job } from '@/modules/mngRecipients/core/types/job.type'
import PaginationDesign from '@/shared/components/Pagination/PaginationDesign'

type RecipientJobTableProps = {
  dataSource: Job[]
  pagination: { [key: string]: any }
  onFetch: (params: { [key: string]: any }) => void
}

const RecipientJobTable = ({
  dataSource,
  pagination: { currentPage, perPage, total },
  onFetch
}: RecipientJobTableProps) => {

  const columnsRecipientsJobs: ColumnsType<Job> = [
    {
      title: '状態',
      dataIndex: 'status',
      key: 'status',
      render: (value: string, record: Job) => (
        <>
          {value === 'success' ? (
            <Row className='items-center gap-2 flex-nowrap'>
              <div className="flex items-center gap-2 w-24">
                <CheckCircleTwoTone className='text-lg' twoToneColor='#52c41a' />
                <span>処理完了</span>
              </div>
              {record.filePath && (
                <Button className="ml-2" onClick={handleDownloadCSV(record.filePath)}>
                  <DownloadOutlined />
                  <span>読者CSV</span>
                </Button>
              )}
            </Row>
          ) : value === 'error' ? (
            <Row className='items-center gap-2 flex-nowrap'>
              <div className="flex items-center gap-2 w-24">
                <ExclamationCircleTwoTone className='text-lg' twoToneColor='#ff4d4f' />
                <span>処理エラー</span>
              </div>
              <Button className="ml-2" onClick={handleDownloadCSV(record.filePath)}>
                <DownloadOutlined />
                <span>エラー内容一覧</span>
              </Button>
            </Row>
          ) : (
            <Row className='items-center gap-2 flex-nowrap'>
              <LoadingOutlined className='text-lg' spin />
              <span>処理中</span>
            </Row>
          )}
        </>
      ),
      width: 320
    },
    {
      title: '処理名',
      dataIndex: 'name',
      key: 'name',
      width: 200
    },
    {
      title: '処理受付',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value: string) => <p>{formattedDate(new Date(value))}</p>,
      width: 200
    },
    {
      title: '成功数',
      dataIndex: 'successCount',
      key: 'successCount',
      render: (value: number) => <p className='text-center'>{value}</p>,
      width: 80
    },
    {
      title: 'エラー数',
      dataIndex: 'errorCount',
      key: 'errorCount',
      render: (value: number) => <p className='text-center'>{value}</p>,
      width: 100
    },
    {
      dataIndex: 'errorMessage',
      key: 'errorMessage',
      render: (value: string) => <p className='text-red-500'>{value}</p>
    }
  ]
  return (
    <>
      <Table
        columns={columnsRecipientsJobs}
        dataSource={dataSource}
        rowKey='id'
        pagination={false}
        scroll={{ y: 60 * 10 }}
        size='small'
        locale={{
          emptyText: <Empty description='表示できる一括処理が0件です。' image={Empty.PRESENTED_IMAGE_SIMPLE} />
        }}
      />
      <PaginationDesign onChangePage={onFetch} perPage={perPage} currentPage={currentPage} total={total} />
    </>
  )
}

export default RecipientJobTable
