import { Modal } from 'antd'
import React, { memo } from 'react'

import type { ModalProps } from 'antd'

type SaveModalProps = ModalProps & {
  title?: string
  children: React.ReactNode
}

const SaveModal: React.FC<SaveModalProps> = memo(function SaveModal({ title = '保存', children, ...props }) {
  return (
    <Modal
      cancelText='キャンセル'
      centered
      okText='保存'
      title={<p className='text-center text-lg'>{title}</p>}
      {...props}
    >
      <div className='flex flex-col gap-2'>{children}</div>
    </Modal>
  )
})

export default SaveModal
