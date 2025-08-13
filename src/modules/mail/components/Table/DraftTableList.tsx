import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { Reservation } from '@/shared/core/types/reservation.type'
import { formattedDate, getPageDelete } from '@/shared/utils'
import { Button, Table, TableColumnsType } from 'antd'
import { TemplateType } from '@/modules/editor/core/enum/distribution-setting.enum'
import { PagePath } from '@/shared/core/enum/page.enum'
import { EditOutlined } from '@ant-design/icons'
import PaginationDesign from '@/shared/components/Pagination/PaginationDesign'
import { deleteReservation } from '@/shared/services/reservation.service'
import ButtonDeleteDesign from '@/shared/components/Button/ButtonDeleteDesign'

type DraftTableListProps = {
  dataTable: Reservation[]
  onFetch: (params: { [key: string]: any }) => void
  pagination: { [key: string]: any }
  setQueryParams: (params: { [key: string]: any }) => void
  queryParams: { [key: string]: any }
}

const DraftTableList = ({ dataTable, onFetch, pagination: { perPage, currentPage, total }, setQueryParams, queryParams }: DraftTableListProps) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])
  const columns: TableColumnsType<Reservation> = [
    {
      key: 'action',
      render: (record: any) => {
        return (
          <Button className='w-8'>
            <Link
              className='rounded-lg px-6 py-2'
              to={`${record.emailType === TemplateType.TEXT ? PagePath.TEXT_EDITOR : PagePath.HTML_EDITOR}?type=draff&id=${record.id}&action=edit`}
            >
              <EditOutlined />
            </Link>
          </Button>
        )
      },
      width: 80
    },
    {
      title: '更新日時',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value: string) => <p>{formattedDate(new Date(value))}</p>,
      width: 160
    },
    {
      title: '内容',
      dataIndex: 'subject',
      key: 'subject',
      render: (subject: string) => (
        <div>
          <div className='font-bold'>{subject ? subject : '(件名なし)'}</div>
        </div>
      )
    },
    {
      title: '種別',
      dataIndex: 'emailType',
      key: 'emailType',
      render: (value: string) => <p>{value === TemplateType.TEXT ? 'テキスト' : 'HTML'}</p>
    },
    { title: '宛先', dataIndex: 'addressTo' },
    { title: '送信元アドレス', dataIndex: 'sourceAddress' }
  ]

  const handleConfirm = useCallback(async () => {
    await deleteReservation(selectedRowKeys.join(','))
    onFetch(getPageDelete(dataTable, selectedRowKeys, currentPage))
    setSelectedRowKeys([])
  }, [selectedRowKeys])

  const onChangePage = useCallback((page: { page: number }) => {
    onFetch({ ...queryParams, page: page.page })
    setQueryParams({ ...queryParams, page: page.page })
  }, [queryParams, onFetch, setQueryParams])

  return (
    <div className='h-screen w-full p-4'>
      <div className='w-full'>
        <Table<Reservation>
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
          scroll={{ y: 'calc(100vh - 300px)' }}
        />
      </div>
      <div className='flex items-center justify-between p-2'>
        <div className='mt-4 flex items-center gap-4'>
          <ButtonDeleteDesign selectedKeys={selectedRowKeys} title='下書きを削除してよろしいでしょうか？' content='削除した下書きは復元できません。' onConfirm={handleConfirm} />
        </div>
        <PaginationDesign onChangePage={onChangePage} perPage={perPage} currentPage={currentPage} total={total} />
      </div>
    </div>
  )
}

export default DraftTableList
