import { Modal } from 'antd'
import FilterDeliveryList from '@/modules/group/components/Filter/FilterDeliveryList'

const FilterDeliveryModal = ({ isOpen, onClose, useFilter, onSetModalName }: { isOpen: boolean; onClose: () => void, useFilter: any, onSetModalName: (name: string) => void }) => {
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
      <FilterDeliveryList onClose={onClose} useFilter={useFilter} onSetModalName={onSetModalName} />
    </Modal>
  )
}

export default FilterDeliveryModal