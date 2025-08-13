import { Badge, Button, Dropdown } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { EditOutlined, DownOutlined } from '@ant-design/icons'
import { formattedDate } from '@/shared/utils'
import { Empty, Table } from 'antd'
import { Recipient } from '@/modules/mngRecipients/core/types/recipient.type'
import PaginationDesign from '@/shared/components/Pagination/PaginationDesign'
import { useCallback } from 'react'
import { getSituationName } from '@/modules/mngRecipients/utils'
import { ItemType } from 'antd/es/menu/interface'

type RecipientTrashTableProps = {
  dataSource: Recipient[]
  pagination: { [key: string]: any }
  onFetch: (params: { [key: string]: any }) => void
  onOpenEditModal: (record: Recipient) => () => void
  selectedRowKeys: number[]
  onSetSelectedRowKeys: (keys: number[]) => void
  items: ItemType[] | undefined
  onSetTypeBulk: () => void
}

const RecipientTrashTable = ({
  dataSource,
  onOpenEditModal,
  pagination: { perPage, currentPage, total },
  onFetch,
  selectedRowKeys,
  onSetSelectedRowKeys,
  items,
  onSetTypeBulk
}: RecipientTrashTableProps) => {
  const columnsTrash: ColumnsType<Recipient> = [
    {
      key: 'action',
      render: (record: Recipient) => {
        return (
          <Button className='w-8' onClick={onOpenEditModal(record)}>
            <EditOutlined />
          </Button>
        )
      },
      width: 80
    },
    {
      title: 'E-Mail',
      dataIndex: 'email',
      key: 'email',
      width: 160
    },
    {
      title: '新規登録日時',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (value: string) => <p>{formattedDate(new Date(value))}</p>,
      width: 160
    },
    {
      title: '状態',
      dataIndex: 'situation',
      key: 'situation',
      render: (value: number) => {
        const number = value - 1
        return <p>{getSituationName(number)}</p>
      },
      width: 160
    },
    {
      title: '削除日時',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (value: string) => <p>{formattedDate(new Date(value))}</p>,
      width: 160
    },
    {
      title: 'エラー数',
      dataIndex: 'numberOfError',
      key: 'numberOfError',
      width: 80
    },
    {
      title: 'リスト',
      dataIndex: 'groups',
      key: 'groups',
      render: (value: { id: number; name: string }[]) => (
        <div className='flex flex-wrap gap-1'>
          {value.map((group) => (
            <div className='w-fit rounded-md border p-2' key={group.id}>
              {group.name}
            </div>
          ))}
        </div>
      )
    }
  ]

  const handleSelectionChange = useCallback((keys: React.Key[]) => {
    onSetSelectedRowKeys(keys as number[])
  }, [])

  return (
    <>
      <Table<Recipient>
        columns={columnsTrash}
        dataSource={dataSource || []}
        locale={{
          emptyText: <Empty description='表示できる読者が0件です。' image={Empty.PRESENTED_IMAGE_SIMPLE} />
        }}
        pagination={false}
        rowKey='id'
        scroll={{ y: 60 * 10 }}
        size='small'
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys,
          onChange: handleSelectionChange
        }}
        className='whitespace-normal break-words'
      />
      <div className='flex items-center justify-between'>
          <div className='mt-4 flex items-center gap-4'>
            <Dropdown
              menu={{ items, disabled: selectedRowKeys.length === 0 }}
              trigger={['click']}
              placement='topRight'
            >
              <Badge count={selectedRowKeys.length} offset={[5, 0]}>
                <Button onClick={onSetTypeBulk}>
                  <span>一括操作</span>
                  <DownOutlined />
                </Button>
              </Badge>
            </Dropdown>
          </div>
        <PaginationDesign onChangePage={onFetch} perPage={perPage} currentPage={currentPage} total={total} />
      </div>
    </>
  )
}

export default RecipientTrashTable
