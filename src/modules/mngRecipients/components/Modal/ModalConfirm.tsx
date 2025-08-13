import { Button, Modal } from 'antd'

interface ModalConfirmProps {
  content: string
  isOpen: boolean
  onCancel: () => void
  onOk: () => void
}

const ModalConfirm = ({ content, isOpen, onCancel, onOk }: ModalConfirmProps) => {
  return (
    <Modal
      cancelText='キャンセル'
      centered
      okText='削除'
      onCancel={onCancel}
      onOk={onOk}
      open={isOpen}
      title={
        <p className='flex items-center text-lg'>
          <span className='mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white'>!</span>
          リストを削除してよろしいでしょうか？
        </p>
      }
      footer={[
        <Button onClick={onCancel} key='cancel'>
          キャンセル
        </Button>,
        <Button type='primary' onClick={onOk} key='submit' danger>
          削除
        </Button>
      ]}
    >
      <p>{content}</p>
    </Modal>
  )
}

export default ModalConfirm
