import { memo, useCallback, useState } from 'react'
import { Button, Table, TableColumnsType } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import { RecipientFilter } from '@/modules/group/core/types/recipient-filter.type'
import ButtonDeleteDesign from '@/shared/components/Button/ButtonDeleteDesign'
import PaginationDesign from '@/shared/components/Pagination/PaginationDesign'
import { deleteRecipientFilter } from '@/modules/group/services/recipient-filter.service'
import { getPageDelete } from '@/shared/utils'

type RecipientFilterTableProps = {
  dataTable: RecipientFilter[]
  onFetch: (params: { [key: string]: any }) => void
  pagination: { [key: string]: any }
  onEditData: (data: RecipientFilter) => () => void
}

const RecipientFilterTable = memo(
  ({ dataTable, onFetch, pagination: { perPage, currentPage, total }, onEditData }: RecipientFilterTableProps) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])
    const columns: TableColumnsType<RecipientFilter> = [
      {
        dataIndex: 'id',
        key: 'action',
        render: (_, record) => {
          return (
            <Button onClick={onEditData(record)} className='w-8'>
              <EditOutlined />
            </Button>
          )
        },
        width: 80
      },
      { title: 'フィルタ名', dataIndex: 'name' }
    ]
    const handleDelete = useCallback(async () => {
      const newPage = getPageDelete(dataTable, selectedRowKeys, currentPage)
      await deleteRecipientFilter(selectedRowKeys.join(','))
      onFetch(newPage)
      setSelectedRowKeys([])
    }, [selectedRowKeys, currentPage, dataTable])

    return (
      <div className='py-2'>
        <Table<RecipientFilter>
          className='h-full'
          columns={columns}
          dataSource={dataTable}
          pagination={false}
          rowKey='id'
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys as number[])
          }}
          scroll={{ y: 'calc(100vh - 130px)' }}
        />
        <div className='flex items-center justify-between'>
          <div className='mt-4 flex items-center gap-4'>
            <ButtonDeleteDesign
              selectedKeys={selectedRowKeys}
              title='下書きを削除してよろしいでしょうか？'
              content='削除した下書きは復元できません。'
              onConfirm={handleDelete}
            />
          </div>
          <PaginationDesign onChangePage={onFetch} perPage={perPage} currentPage={currentPage} total={total} />
        </div>
      </div>
    )
  },
  (prevProps, nextProps) => {
    if (prevProps.dataTable !== nextProps.dataTable) {
      return false
    }
    return true
  }
)

export default RecipientFilterTable
