import { memo } from 'react'
import { Modal } from 'antd'
import SettingMailForm from '@/modules/mail-setting/components/Form/SettingMailForm'
import { Mail } from '@/modules/mail-setting/core/types/mail-setting.type'

type ModalMailSettingProps = {
  modalName: string
  onClose: () => void
  data: Mail | undefined
  onFetchTable: () => void
}

const ModalMailSetting = memo(
  ({ modalName, onClose, data, onFetchTable }: ModalMailSettingProps) => {
    return (
      <Modal
        centered
        destroyOnClose
        onCancel={onClose}
        open={modalName === 'mailSetting'}
        title={<div className='text-center text-xl font-bold'>送信元アドレス</div>}
        footer={null}
      >
        <SettingMailForm data={data} onFetchTable={onFetchTable} onClose={onClose} />
      </Modal>
    )
  },
  (prevProps, nextProps) => {
    return prevProps.modalName === nextProps.modalName && prevProps.data === nextProps.data
  }
)

export default ModalMailSetting
