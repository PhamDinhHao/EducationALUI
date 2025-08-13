import { Modal } from 'antd'
import SignatureSettingForm from '@/modules/mail-setting/components/Form/SignatureSettingForm'
import { Mail } from '@/modules/mail-setting/core/types/mail-setting.type'

interface ModalSignatureSettingProps {
  isOpen: boolean
  onCancel: () => void
  data: Mail | undefined
  onFetchTable: () => void
}

const ModalSignatureSetting = ({ isOpen, onCancel, data, onFetchTable }: ModalSignatureSettingProps) => {
  return (
    <Modal
      title={<div className='text-center text-xl font-bold'>署名</div>}
      open={isOpen}
      onCancel={onCancel}
      width={800}
      footer={null}
    >
      <SignatureSettingForm isOpen={isOpen} onCancel={onCancel} data={data} onFetchTable={onFetchTable} />
    </Modal>
  )
}

export default ModalSignatureSetting
