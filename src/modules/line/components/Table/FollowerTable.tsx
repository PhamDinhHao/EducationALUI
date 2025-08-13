import { useMemo } from 'react'
import { Avatar, Empty, Table } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { ColumnsType } from 'antd/es/table'
import { LineUser } from '@/modules/line/core/types/line-user.type'
import PaginationDesign from '@/shared/components/Pagination/PaginationDesign'

type FollowerTableProps = {
  dataSource: LineUser[]
  pagination: { [key: string]: any }
  onFetch: (params: { [key: string]: any }) => void
}

const FollowerTable = ({ dataSource, pagination: { currentPage, perPage, total }, onFetch }: FollowerTableProps) => {
  const columnsRecipientsJobs: ColumnsType<LineUser> = useMemo(
    () => [
      {
        title: 'ユーザーID',
        dataIndex: 'lineUserId',
        key: 'lineUserId'
      },
      {
        title: 'ユーザー名',
        dataIndex: 'displayName',
        key: 'displayName'
      },
      {
        title: '画像',
        dataIndex: 'pictureUrl',
        key: 'pictureUrl',
        render: (text: string) => <Avatar src={text} icon={<UserOutlined />} />,
        width: 80
      },
      {
        title: '作成日',
        dataIndex: 'createdAt',
        key: 'createdAt'
      }
    ],
    [dataSource]
  )
  return (
    <div>
      <Table
        columns={columnsRecipientsJobs}
        dataSource={dataSource}
        rowKey='id'
        pagination={false}
        scroll={{ y: 60 * 10 }}
        size='small'
        locale={{
          emptyText: <Empty description='表示できるフォロワーが0件です。' image={Empty.PRESENTED_IMAGE_SIMPLE} />
        }}
      />
      <PaginationDesign onChangePage={onFetch} perPage={perPage} currentPage={currentPage} total={total} />
    </div>
  )
}

export default FollowerTable
