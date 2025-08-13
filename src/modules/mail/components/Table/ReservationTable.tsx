import { useCallback, useState } from 'react'
import { Table, TableColumnsType } from 'antd'
import ButtonDeleteDesign from '@/shared/components/Button/ButtonDeleteDesign'
import { Reservation } from '@/shared/core/types/reservation.type'
import { formatDateTime } from '@/modules/editor/util'
import { TemplateType } from '@/modules/editor/core/enum/distribution-setting.enum'
import { deleteReservation } from '@/shared/services/reservation.service'
import PaginationDesign from '@/shared/components/Pagination/PaginationDesign'
import { getPageDelete } from '@/shared/utils'

const ReservationTable = ({ queryParams, onFetch, dataTable, pagination, onSetQueryParams }: { queryParams: { [key: string]: any }, onFetch: (params: { [key: string]: any }) => void, dataTable: any, pagination: any, onSetQueryParams: (params: { [key: string]: any }) => void }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])
  const columns: TableColumnsType<Reservation> = [
    {
      title: '配信日時',
      dataIndex: 'scheduledAt',
      key: 'scheduledAt',
      render: (_, record: Reservation) => <p>{formatDateTime(record?.date, Number(record?.hour), Number(record?.minute)) || ''}</p>,
      width: 160
    },
    { title: '種別', dataIndex: 'emailType', key: 'emailType', render: (value: string) => <p>{value === TemplateType.TEXT ? 'テキスト' : 'HTML'}</p> },
    { title: '件名', dataIndex: 'subject', key: 'subject', ellipsis: true },
    { title: '宛先', dataIndex: 'addressTo' },
    { title: '配信数', dataIndex: 'numberOfDelivery' },
    { title: '状況', dataIndex: 'deliveryStatus', render: () => <p>配信待ち</p> }
  ]

  const handleConfirm = useCallback(async () => {
    await deleteReservation(selectedRowKeys.join(','))
    onFetch(getPageDelete(dataTable, selectedRowKeys, pagination.currentPage))
    setSelectedRowKeys([])
  }, [selectedRowKeys])
  const onChangePage = useCallback((page: { page: number }) => {
    onFetch({ ...queryParams, page: page.page })
    onSetQueryParams({ ...queryParams, page: page.page })
  }, [queryParams, onFetch, onSetQueryParams])
  return (
    <>
      <div className='py-2'>
        <Table<Reservation>
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
      <div className='flex items-center justify-between'>
      <ButtonDeleteDesign
          selectedKeys={selectedRowKeys}
          title='配信予約を削除してよろしいでしょうか？'
          content='削除した配信データは復元できません。'
          onConfirm={handleConfirm}
        />
        <PaginationDesign onChangePage={onChangePage} perPage={pagination.perPage} currentPage={pagination.currentPage} total={pagination.total} />

      </div>
    </>
  )
}

export default ReservationTable
