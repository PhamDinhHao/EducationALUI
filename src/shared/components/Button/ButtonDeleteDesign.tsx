import useHandleModal from '@/shared/hooks/useHandleModal'
import { Badge, Button, Modal } from 'antd'
import { memo, useCallback } from 'react'

type ButtonDeleteDesignProps = {
  title: string
  content: string
  selectedKeys: number[]
  onConfirm: () => void
}

const ButtonDeleteDesign = memo(
  ({ title, content, selectedKeys, onConfirm }: ButtonDeleteDesignProps) => {
    const { modalName, onSetModalName, onResetModalName } = useHandleModal()
    const handleOpen = useCallback(() => {
      onSetModalName('delete-confirm')
    }, [])

    const handleConfirm = useCallback(() => {
      onConfirm()
      onResetModalName()
    }, [selectedKeys])

    return (
      <>
        <Badge count={selectedKeys.length} offset={[5, 0]}>
          <Button danger onClick={handleOpen} disabled={selectedKeys.length === 0}>
            削除
          </Button>
        </Badge>
        <Modal
          cancelText='キャンセル'
          centered
          okText='削除'
          onCancel={onResetModalName}
          onOk={handleConfirm}
          open={modalName === 'delete-confirm'}
          title={
            <p className='flex items-center text-lg'>
              <span className='mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white'>
                !
              </span>
              {title}
            </p>
          }
          footer={[
            <Button key='cancel' onClick={onResetModalName}>
              キャンセル
            </Button>,
            <Button key='submit' type='primary' danger onClick={handleConfirm}>
              削除
            </Button>
          ]}
        >
          <p className='whitespace-pre-line'>{content}</p>
        </Modal>
      </>
    )
  },
  (prevProps, nextProps) => {
    if (
      prevProps.selectedKeys === nextProps.selectedKeys &&
      prevProps.title === nextProps.title &&
      prevProps.content === nextProps.content
    )
      return true
    return false
  }
)

export default ButtonDeleteDesign
