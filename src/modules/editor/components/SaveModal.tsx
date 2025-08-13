import { DELIVERY_TYPES } from '@/modules/editor/core/enum/distribution-setting.enum'
import { useBoundStore } from '@/shared/stores'
import { Button, Modal } from 'antd'

type SaveModalProps = {
  isOpen: boolean
  onCancel: () => void
  onSubmit: () => Promise<void>
}

const SaveModal = ({ isOpen, onCancel, onSubmit }: SaveModalProps) => {
  const { nameAddressTo, nameFromAddress, deliveryType, date, hours, minutes, isClickMeasure } = useBoundStore()
  return (
    <Modal
      cancelText='キャンセル'
      centered
      okText='削除'
      onCancel={onCancel}
      onOk={onSubmit}
      open={isOpen}
      title={
        <p className='flex items-center text-lg'>
          <span className='mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white'>!</span>
          以下の内容で配信登録します。よろしいですか？
        </p>
      }
      footer={[
        <Button key='cancel' onClick={onCancel}>
          キャンセル
        </Button>,
        <Button key='submit' type='primary' danger onClick={onSubmit}>
          削除
        </Button>
      ]}
    >
      <p className='whitespace-pre-line'>{`宛先：${nameAddressTo}\n送信元アドレス: ${nameFromAddress}\n配信日時: ${deliveryType === DELIVERY_TYPES.SCHEDULED ? `${date.format('YYYY/MM/DD')} ${hours}:${minutes}` : '即時配信'}\nクリック測定: ${isClickMeasure ? '測定する' : '測定しない'}`}</p>
    </Modal>
  )
}

export default SaveModal
