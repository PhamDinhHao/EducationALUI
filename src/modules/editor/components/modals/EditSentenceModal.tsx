import { Modal } from 'antd'
import { EditSentenceForm } from '../forms'
import { TNewSentence } from '../../schemas'

type EditSentenceModalProps = {
  id: string
  data: TNewSentence
  isOpen: boolean
  onClose: () => void
  onFetch: (params: { [key: string]: any }) => void
  queryParams: { [key: string]: any }
}

const EditSentenceModal: React.FC<EditSentenceModalProps> = ({ id, data, isOpen, onClose, onFetch, queryParams }) => {
  return (
    <Modal
      centered
      footer={null}
      onCancel={onClose}
      open={isOpen}
      title={<p className='text-center text-lg'>編集</p>} // Change This Sentence
    >
      <EditSentenceForm data={data} id={id} onClose={onClose} onFetch={onFetch} queryParams={queryParams} />
    </Modal>
  )
}

export default EditSentenceModal
