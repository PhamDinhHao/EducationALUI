import { Modal } from 'antd'

import { NewSentenceForm } from '@editor/components/forms'

type NewSentenceModalProps = {
  isOpen: boolean
  onClose: () => void
  onFetch: (params: { [key: string]: any }) => void
  queryParams: { [key: string]: any }
}

const NewSentenceModal: React.FC<NewSentenceModalProps> = ({ isOpen, onClose, onFetch, queryParams }) => {
  return (
    <Modal
      centered
      footer={null}
      onCancel={onClose}
      open={isOpen}
      title={<p className='text-center text-lg'>新しい</p>}
    >
      <NewSentenceForm onClose={onClose} onFetch={onFetch} queryParams={queryParams} />
    </Modal>
  )
}

export default NewSentenceModal
