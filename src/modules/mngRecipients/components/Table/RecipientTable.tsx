import React, { useCallback } from 'react'
import { Badge, Button, Dropdown, Table } from 'antd'
import { EditOutlined, DownOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import PaginationDesign from '@/shared/components/Pagination/PaginationDesign'
import { Recipient } from '@/modules/mngRecipients/core/types/recipient.type'
import { getSituationName } from '@/modules/mngRecipients/utils'
import { ItemType } from 'antd/es/menu/interface'

interface RecipientTableProps {
  dataSource: Recipient[]
  pagination: { [key: string]: any }
  onFetch: (params: { [key: string]: any }) => void
  onOpenEditModal: (record: Recipient) => () => void
  selectedRowKeys: number[]
  onSetSelectedRowKeys: (keys: number[]) => void
  items: ItemType[] | undefined
  onSetTypeBulk: () => void
}

const RecipientTable = React.memo(
  ({
    dataSource,
    onOpenEditModal,
    pagination: { perPage, currentPage, total },
    onFetch,
    selectedRowKeys,
    onSetSelectedRowKeys,
    items,
    onSetTypeBulk
  }: RecipientTableProps) => {
    const columns: ColumnsType<Recipient> = [
      {
        key: 'action',
        render: (record: any) => {
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
        width: 320
      },
      {
        title: '新規登録日時',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (value: string) => <p>{new Date(value).toLocaleString()}</p>,
        width: 160
      },
      {
        title: '状態',
        dataIndex: 'situation',
        key: 'situation',
        render: (value: number) => {
          return <p>{getSituationName(value)}</p>
        },
        width: 160
      },
      {
        title: 'エラー数',
        dataIndex: 'numberOfError',
        key: 'numberOfError',
        render: (value: number) => <p>{value}</p>,
        width: 100
      },
      {
        title: '氏名',
        dataIndex: 'name',
        key: 'name',
        width: 160
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
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          rowKey='id'
          scroll={{ y: 60 * 10 }}
          size='small'
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys,
            onChange: handleSelectionChange
          }}
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
)

RecipientTable.displayName = 'RecipientTable'

export default RecipientTable
