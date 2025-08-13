import { Modal } from 'antd'
import React, { memo } from 'react'

import type { ModalProps } from 'antd'

type EditModalProps = ModalProps & {
  title?: string
  children: React.ReactNode
}

const EditModal: React.FC<EditModalProps> = memo(function EditModal({ title = '編集', children, ...props }) {
  return (
    <Modal
      cancelText='キャンセル'
      centered
      okText='変更する'
      title={<p className='text-center text-lg'>{title}</p>}
      {...props}
    >
      <div className='flex flex-col gap-2'>{children}</div>
    </Modal>
  )
})

export default EditModal
