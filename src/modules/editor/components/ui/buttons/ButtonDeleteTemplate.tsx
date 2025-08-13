import { useCallback } from 'react'
import { Button, Modal, Badge } from 'antd'
import useHandleModal from '@/shared/hooks/useHandleModal'
import { deleteTemplate } from '@/shared/services/template.service'
import { useQueryClient } from '@tanstack/react-query'
import { TEMPLATE_QUERY_KEY } from '@/modules/templates/services/config'

type ButtonDeleteTemplateProps = {
  ids: string[]
  setSelectedRowKeys: (keys: string[]) => void
}

const ButtonDeleteTemplate: React.FC<ButtonDeleteTemplateProps> = ({ ids, setSelectedRowKeys }) => {
  const { modalName, onSetModalName, onResetModalName } = useHandleModal()
  const queryClient = useQueryClient()

  const handleConfirm = useCallback(async () => {
    const res = await deleteTemplate(ids.join(','))
    if (res.status === 204) {
      onResetModalName()
      setSelectedRowKeys([])
      queryClient.invalidateQueries({ queryKey: [TEMPLATE_QUERY_KEY] })
    }
  }, [ids])

  const handleOpen = useCallback(() => {
    onSetModalName('deleteTemplate')
  }, [])

  return (
    <>
      <Badge count={ids.length} offset={[5, 0]}>
        <Button className='border-red-700 text-red-700' onClick={handleOpen}>
          削 除
        </Button>
      </Badge>
      <Modal
        cancelText='キャンセル'
        centered
        okButtonProps={{ danger: true }}
        okText='削除'
        onCancel={onResetModalName}
        onOk={handleConfirm}
        open={modalName === 'deleteTemplate'}
        title={<p className='text-lg'>Myテンプレートを削除してよろしいでしょうか？</p>}
      >
        <p>削除したMyテンプレートは復元できません。</p>
      </Modal>
    </>
  )
}

export default ButtonDeleteTemplate
