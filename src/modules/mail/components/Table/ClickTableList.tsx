import { memo } from 'react'
import { Button, Table } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import { clickList } from '@/modules/mail/core/config/columns/history-report-list'
import { ClickDetail } from '@/modules/mail/core/types/distribution-history.type'
import _ from 'lodash'

type ClickTableListProps = {
  clickCount: number
  data: ClickDetail[]
  handleDownloadTrack: (type: string) => () => void
}

const ClickTableList = memo(
  ({ clickCount, data, handleDownloadTrack }: ClickTableListProps) => {
    return (
      <div>
        合計：{clickCount}件
        <Table
          className='mb-2'
          rowKey={(record) => `${record.url}-${Math.random()}`}
          columns={clickList}
          dataSource={data}
          pagination={false}
          bordered
          scroll={data.length > 2 ? { y: 110 } : undefined}
        />
        <Button onClick={handleDownloadTrack('clicked')}>
          <DownloadOutlined />
          <span>ダウンロード</span>
        </Button>
      </div>
    )
  },
  (prevProps, nextProps) => {
    return prevProps.clickCount === nextProps.clickCount && _.isEqual(prevProps.data, nextProps.data)
  }
)

ClickTableList.displayName = 'ClickTableList'

export default ClickTableList
