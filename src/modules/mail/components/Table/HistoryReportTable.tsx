import { memo, useCallback } from 'react'
import _ from 'lodash'
import { Table } from 'antd'
import { historyReportColumns } from '@/modules/mail/core/config/columns/history-report-list'
import { Distribution } from '@/modules/mail/core/types/distribution-history.type'
import {
  exportDistributionHistory,
  exportDistributionHistoryTracking
} from '@/modules/mail/services/distribution-history.service'
import { cn, handleDownloadCSV } from '@/shared/utils'
import ClickTableList from '@/modules/mail/components/Table/ClickTableList'

type HistoryReportTableProps = {
  data: Distribution
}

const HistoryReportTable = memo(
  ({ data }: HistoryReportTableProps) => {
    const handleDownloadClickCount = useCallback(
      (status: string) => {
        return async () => {
          const res = await exportDistributionHistory(data.id.toString(), status)
          if (res.data) handleDownloadCSV(res.data)()
        }
      },
      [data.id]
    )

    const handleDownloadTrack = useCallback(
      (type: string) => {
        return async () => {
          const res = await exportDistributionHistoryTracking(data.id.toString(), type)
          if (res.data) handleDownloadCSV(res.data)()
        }
      },
      [data.id]
    )

    const tableData = [
      { key: '配信No', value: data.id },
      { key: '登録日時', value: data.createdAt },
      { key: '配信予約日時', value: data.createdAt },
      { key: '配信完了日時', value: data.createdAt },
      { key: '種別', value: data.type },
      { key: '宛先', value: data.address },
      { key: '送信元アドレス', value: data.sourceAddress },
      { key: '総送信数', value: data.deliveryStatus.numberOfDelivery },
      {
        key: '送信成功数',
        value: (
          <span
            onClick={handleDownloadClickCount('success')}
            className={cn({ 'cursor-pointer text-blue-500': data.deliveryStatus.successCount > 0 })}
          >
            {data.deliveryStatus.successCount}
          </span>
        )
      },
      {
        key: '送信失敗数',
        value: (
          <span
            onClick={handleDownloadClickCount('failed')}
            className={cn({ 'cursor-pointer text-blue-500': data.deliveryStatus.failedCount > 0 })}
          >
            {data.deliveryStatus.failedCount}
          </span>
        )
      },
      {
        key: '開封率/数',
        value: data.trackingStatus.openRate === '-' ? (
          <span className="text-gray-600">- ※テキストメールでは開封率/数は取得できません。</span>
        ) : (
          <span
            className="cursor-pointer text-blue-500"
            onClick={handleDownloadTrack('opened')}
          >
            {data.trackingStatus.openRate}
          </span>
        )
      },
      {
        key: 'クリック数',
        value:
          data.trackingStatus.clickDetails.length > 0 ? (
            <ClickTableList
              clickCount={data.trackingStatus.clickCount}
              data={data.trackingStatus.clickDetails}
              handleDownloadTrack={handleDownloadTrack}
            />
          ) : (
            'クリックURLはありません'
          )
      }
    ]
    return (
      <div className='mx-auto mt-8 max-w-4xl'>
        <Table
          rowKey={(record) => record.key}
          columns={historyReportColumns}
          dataSource={tableData}
          pagination={false}
          showHeader={false}
          bordered
        />
      </div>
    )
  },
  (prevProps, nextProps) => {
    return _.isEqual(prevProps.data, nextProps.data)
  }
)

HistoryReportTable.displayName = 'HistoryReportTable'

export default HistoryReportTable
