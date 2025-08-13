import { SendMailPreviewForm } from "@/modules/editor/components/forms"
import { Modal } from "antd"

type SendMailPreviewModalProps = {
  isOpen: boolean
  onClose: () => void
  content: string
}

const SendMailPreviewModal = ({ isOpen, onClose, content }: SendMailPreviewModalProps) => {
  return (
    <Modal
      centered
      onCancel={onClose}
      open={isOpen}
      title={<div className='text-center text-xl font-bold'>テスト送信</div>}
      footer={false}
    >
      <SendMailPreviewForm content={content} onClose={onClose} />
    </Modal>
  )
}

export default SendMailPreviewModal