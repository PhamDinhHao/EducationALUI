import { ClickDetail } from '@/modules/mail/core/types/distribution-history.type'
import { TableColumnsType } from 'antd'

export const clickList: TableColumnsType<ClickDetail> = [
  { title: '行数', dataIndex: 'index', key: 'index', render: (_, __, index) => index + 1, },
  { title: 'URL', dataIndex: 'url', key: 'url' },
  { title: 'クリック数', dataIndex: 'totalClicks', key: 'totalClicks' }
]

export const historyReportColumns = [
  {
    title: '',
    dataIndex: 'key',
    key: 'key',
    width: '25%',
    className: 'font-medium text-gray-700 bg-gray-50'
  },
  {
    title: '',
    dataIndex: 'value',
    key: 'value',
    width: '75%',
  }
]