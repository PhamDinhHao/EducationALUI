import { Modal } from 'antd'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useBoundStore } from '@/shared/stores'
import { useErrorSendMailStore } from '@/shared/stores/errorSendMail'

const ButtonGoBack: React.FC = () => {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
  const { setIsConfirm } = useErrorSendMailStore()

  const navigate = useNavigate()
  const {
    reset
  } = useBoundStore()

  const handleCancel = useCallback(() => {
    setIsOpenModal(false)
  }, [])

  const handleOpenModal = useCallback(() => {
    setIsOpenModal(true)
  }, [])

  const handleOk = useCallback(() => {
    reset()
    setIsConfirm(true)
    handleCancel()
    navigate('..')
  }, [handleCancel, navigate])

  return (
    <>
      <button
        className='flex items-center justify-center gap-2 rounded-lg border bg-[#ccc] px-4 py-2'
        onClick={handleOpenModal}
        type='button'
      >
        <ArrowLeftOutlined />
        <span>戻る</span>
      </button>
      {isOpenModal ? (
        <Modal
          cancelText='編集を続ける'
          centered
          okButtonProps={{
            danger: true
          }}
          okText='終了'
          onCancel={handleCancel}
          onOk={handleOk}
          open={isOpenModal}
          title={<div className='text-center text-xl font-bold'>メール編集を終了しますか?</div>}
        >
          保存していない編集内容は破棄されます。
        </Modal>
      ) : null}
    </>
  )
}

export default ButtonGoBack
