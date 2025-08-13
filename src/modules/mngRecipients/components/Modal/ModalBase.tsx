import { Modal } from 'antd'

type ModalBaseProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  content: string
  okText: string
  cancelText: string
}

const ModalBase = ({ isOpen, onClose, onConfirm, title, content, okText, cancelText }: ModalBaseProps) => {
  return (
    <Modal
      cancelText={cancelText}
      okText={okText}
      onCancel={onClose}
      onOk={onConfirm}
      open={isOpen}
      title={
        <p className='flex items-center text-lg'>
          <span className='mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white'>!</span>
          {title}
        </p>
      }
      okButtonProps={{ danger: true }}
    >
      <p className="whitespace-pre-line">{content}</p>
    </Modal>
  )
}

export default ModalBase
