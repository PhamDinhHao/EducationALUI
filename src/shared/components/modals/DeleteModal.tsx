import { Modal } from 'antd'
import React, { memo } from 'react'

import type { ModalProps } from 'antd'

type DeleteModalProps = ModalProps & {
  title: string | React.ReactNode
  description: string
}

const DeleteModal: React.FC<DeleteModalProps> = memo(function DeleteModal({ title, description, ...props }) {
  return (
    <Modal cancelText='キャンセル' centered okText='削除' title={title} {...props}>
      {description}
    </Modal>
  )
})

export default DeleteModal
