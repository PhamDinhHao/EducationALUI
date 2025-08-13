import { useState } from 'react'
import { Button, Modal } from 'antd'
import { EditOutlined } from '@ant-design/icons'

import { useEditor } from '@editor/hooks'

type ButtonEditNameProps = {
  templateId: string
  name: string
}

const ButtonEditName: React.FC<ButtonEditNameProps> = ({ templateId, name }) => {
  const [isModalEditName, setIsModalEditName] = useState(false)
  const { onEditNameTemplate, onSetNameTemplate } = useEditor()

  const handleEditName = () => {
    onEditNameTemplate(templateId)
    handleCloseModalEditName()
  }

  const handleShowModalEditName = () => {
    setIsModalEditName(true)
  }

  const handleCloseModalEditName = () => {
    onSetNameTemplate('')
    setIsModalEditName(false)
  }
  return (
    <>
      <Button className='rounded-md border p-2' onClick={handleShowModalEditName}>
        <EditOutlined />
      </Button>
      <Modal
        cancelText='キャンセル'
        centered
        okText='変更する'
        onCancel={handleCloseModalEditName}
        onOk={handleEditName}
        open={isModalEditName}
        title={<p className='text-center text-lg'>編集</p>}
      >
        <div className='flex flex-col gap-2'>
          <label className='text-lg' htmlFor='name'>
            Myテンプレート名
          </label>
          <input
            className='rounded-lg border p-2'
            defaultValue={name}
            id='name'
            onChange={(e) => onSetNameTemplate(e.target.value)}
            required
            type='text'
          />
        </div>
      </Modal>
    </>
  )
}

export default ButtonEditName
