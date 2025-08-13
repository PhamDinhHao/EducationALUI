import { useCallback } from 'react'
import { Button, Modal, Badge } from 'antd'
import useHandleModal from '@/shared/hooks/useHandleModal'
import { deleteSentence } from '@/modules/editor/Service/sentence.service'

type ButtonDeleteTemplateProps = {
  ids: string[]
  setSelectedRowKeys: (keys: string[]) => void
  onFetch: (params: {
    [key: string]: any;
  }) => void
}

const ButtonDeleteSentence: React.FC<ButtonDeleteTemplateProps> = ({ ids, setSelectedRowKeys, onFetch }) => {
  const { modalName, onSetModalName, onResetModalName } = useHandleModal()

  const handleConfirm = useCallback(async () => {
    const res = await deleteSentence(ids.join(','))
    if (res.status === 204) {
      onResetModalName()
      setSelectedRowKeys([])
      onFetch({ page: 1 })
    }
  }, [ids])

  const handleOpen = useCallback(() => {
    onSetModalName('deleteSentence')
  }, [])

  return (
    <>
      <Badge count={ids.length} offset={[5, 0]}>
        <Button className='border-red-700 text-red-700' onClick={handleOpen}>
          削除
        </Button>
      </Badge>
      <Modal
        cancelText='キャンセル'
        centered
        okText='削除'
        okButtonProps={{
          danger: true
        }}
        onCancel={onResetModalName}
        onOk={handleConfirm}
        open={modalName === 'deleteSentence'}
        title={<p className='text-lg'>削除してよろしいでしょうか？</p>}
      >
        <p>削除したデータは復元できません。</p>
      </Modal>
    </>
  )
}

export default ButtonDeleteSentence
