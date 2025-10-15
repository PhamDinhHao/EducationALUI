import { Card } from 'antd'
import { ICourse } from '@/modules/home/cores/interfaces'

const ItemTopArticles = (item: ICourse) => {
  return (
    <Card hoverable style={{ textAlign: 'center', borderRadius: 16, border: '1px solid #f0f0f0' }}>
      <div style={{ fontWeight: 'bold', marginBottom: 8 }}>{item.title}</div>
      <div style={{ color: '#888' }}>{item.courses} Courses</div>
    </Card>
  )
}

export default ItemTopArticles
