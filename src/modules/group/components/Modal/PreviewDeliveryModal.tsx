import { Modal } from 'antd'
import RecipientFilterForm from '@/modules/group/components/Form/RecipientFilterForm'
import { RecipientFilter } from '@/modules/group/core/types/recipient-filter.type'

const PreviewDeliveryModal = ({
  isOpen,
  onClose,
  useFilter,
  onSetModalName,
  onFetch,
  editData
}: {
  isOpen: boolean
  onClose: () => void
  useFilter: any
  onSetModalName: (name: string) => void
  onFetch: (params: { [key: string]: any }) => void
  editData: RecipientFilter | null
}) => {
  const { filter, onSetFilter } = useFilter
  return (
    <Modal
      cancelText='キャンセル'
      centered
      destroyOnClose
      okText='次へ'
      onCancel={onClose}
      open={isOpen}
      title={<div className='text-center text-xl font-bold'>フィルタ登録</div>}
      footer={null}
      width={800}
    >
      <RecipientFilterForm
        filter={filter}
        onSetModalName={onSetModalName}
        onSetFilter={onSetFilter}
        onFetch={onFetch}
        editData={editData}
      />
    </Modal>
  )
}

export default PreviewDeliveryModal
