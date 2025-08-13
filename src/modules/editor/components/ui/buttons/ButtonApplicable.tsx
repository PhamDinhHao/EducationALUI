import { useCallback } from 'react'
import { Button, Modal } from 'antd'
import useHandleTemplate from '@/modules/editor/hooks/useHandleTemplate'
import useHandleModal from '@/shared/hooks/useHandleModal'

type ButtonApplicableProps = {
  templateId: string
}

const ButtonApplicable: React.FC<ButtonApplicableProps> = ({ templateId }) => {
  const { modalName, onSetModalName, onResetModalName } = useHandleModal()
  const { onApplicable } = useHandleTemplate()

  const handleOpenModal = useCallback(() => {
    onSetModalName('confirm')
  }, [])

  const handleConfirm = useCallback(() => {
    onApplicable(templateId)
    onResetModalName()
  }, [])

  return (
    <>
      <Button className='rounded-md border p-2' onClick={handleOpenModal}>
        適用
      </Button>
      <Modal
        cancelText='キャンセル'
        centered
        okButtonProps={{
          danger: true
        }}
        okText='適用'
        onCancel={onResetModalName}
        onOk={handleConfirm}
        open={modalName === 'confirm'}
        title={<p className='text-lg'>Myテンプレートを適用してよろしいでしょうか？</p>}
      >
        <p>入力中の内容は上書きされ、復元できません。</p>
      </Modal>
    </>
  )
}

export default ButtonApplicable
