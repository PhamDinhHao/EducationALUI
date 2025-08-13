import { memo, useCallback, useState } from 'react'
import _ from 'lodash'
import { Button, Table, TableColumnsType } from 'antd'
import ButtonDeleteDesign from '@/shared/components/Button/ButtonDeleteDesign'
import { Distribution } from '@/modules/mail/core/types/distribution-history.type'
import PaginationDesign from '@/shared/components/Pagination/PaginationDesign'
import { deleteDistributionHistory } from '@/modules/mail/services/distribution-history.service'

type MailHistoryTableProps = {
  dataTable: Distribution[]
  pagination: { [key: string]: any }
  onFetch: (params: { [key: string]: any }) => void
  onSetEditData: (data: Distribution) => () => void
}

const MailHistoryTable = memo(
  ({ dataTable, pagination: { perPage, currentPage, total }, onFetch, onSetEditData }: MailHistoryTableProps) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])
    const columns: TableColumnsType<Distribution> = [
      {
        title: '配信日時',
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: 160
      },
      { title: '種別', dataIndex: 'type' },
      { title: '件名', dataIndex: 'subject', key: 'subject', ellipsis: true },
      { title: '宛先', dataIndex: 'address', key: 'address', ellipsis: true },
      {
        title: '配信数',
        key: 'numberOfDelivery',
        render: (record: Distribution) => record.deliveryStatus.numberOfDelivery
      },
      {
        title: '成功',
        key: 'successCount',
        render: (record: Distribution) => record.deliveryStatus.successCount
      },
      {
        title: '失敗',
        key: 'failedCount',
        render: (record: Distribution) => record.deliveryStatus.failedCount
      },
      {
        key: 'action',
        render: (record: Distribution) => {
          return <Button onClick={onSetEditData(record)}>配信結果を確認</Button>
        },
        width: 160
      }
    ]

    const handleConfirm = useCallback(async () => {
      await deleteDistributionHistory(selectedRowKeys.join(','))
      setSelectedRowKeys([])
    }, [selectedRowKeys])

    return (
      <>
        <div className='py-2'>
          <Table<Distribution>
            columns={columns}
            dataSource={dataTable}
            pagination={false}
            rowKey='id'
            rowSelection={{
              type: 'checkbox',
              selectedRowKeys,
              onChange: (keys) => setSelectedRowKeys(keys as number[])
            }}
          />
        </div>
        <div className='flex items-center justify-between gap-4'>
          <ButtonDeleteDesign
            selectedKeys={selectedRowKeys}
            title='配信履歴を削除してよろしいでしょうか？'
            content={`削除した配信履歴データは復元できません。また、「開封/クリック測定データ」「バックナンバー（公開中の場合）」「添付ファイル」も削除されます。\n\n また、削除した配信履歴に含まれるクリック測定用に変換されたURLはアクセス不可となります。`}
            onConfirm={handleConfirm}
          />
          <PaginationDesign onChangePage={onFetch} perPage={perPage} currentPage={currentPage} total={total} />
        </div>
      </>
    )
  },
)

MailHistoryTable.displayName = 'MailHistoryTable'

export default MailHistoryTable
