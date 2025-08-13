import { Button } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import { useSearchParams } from 'react-router-dom'

const ButtonEdit: React.FC<{ id: string | number }> = ({ id }) => {
  const [_, setSearchParams] = useSearchParams()

  const handleActionEdit = () => {
    setSearchParams({ action: 'edit', id: String(id) })
  }

  return (
    <Button className='rounded-md border p-2' onClick={handleActionEdit}>
      <EditOutlined />
    </Button>
  )
}

export default ButtonEdit
