import _ from 'lodash'
import { Modal } from 'antd'
import HistoryReportTable from '@/modules/mail/components/Table/HistoryReportTable'
import { Distribution } from '@/modules/mail/core/types/distribution-history.type'
import { memo } from 'react'

type HistoryReportModalProps = {
  isOpen: boolean
  onClose: () => void
  data: Distribution
}

const HistoryReportModal = memo(({ isOpen, onClose, data }: HistoryReportModalProps) => {
  return (
    <Modal
      centered
      destroyOnClose
      onCancel={onClose}
      open={isOpen}
      title={<div className='text-center text-xl font-bold'>配信レポート</div>}
      footer={null}
      width='100%'
      className='top-0 h-screen w-full'
      styles={{
        body: {
          height: 'calc(100vh - 110px)',
          overflow: 'auto'
        },
        content: {
          height: '100vh',
          overflow: 'hidden'
        }
      }}
    >
      <div className='h-full overflow-auto'>
        <HistoryReportTable data={data} />
      </div>
    </Modal>
  )
}, (prevProps, nextProps) => {
    return _.isEqual(prevProps.data, nextProps.data)
  }
)

export default HistoryReportModal
