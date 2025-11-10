import { Card } from 'antd'
import { useNavigate } from 'react-router-dom'
import { ITopCategory } from '@/modules/home/cores/interfaces'

const ItemTopCategory = (item: ITopCategory) => {
  const navigate = useNavigate()

  const handleClick = () => {
    if (item.id) {
      navigate(`/categories/${item.id}/courses`)
    }
  }

  return (
    <Card 
      hoverable 
      style={{ textAlign: 'center', borderRadius: 16, border: '1px solid #f0f0f0', cursor: 'pointer' }}
      onClick={handleClick}
    >
      <div style={{ fontSize: 32, color: '#ff6600', marginBottom: 12 }}>{item.icon}</div>
      <div style={{ fontWeight: 'bold', marginBottom: 8 }}>{item.title}</div>
      <div style={{ color: '#888' }}>{item.courses} Courses</div>
    </Card>
  )
}

export default ItemTopCategory
