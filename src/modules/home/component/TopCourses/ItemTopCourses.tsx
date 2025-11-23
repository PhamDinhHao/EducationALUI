import { ClockCircleOutlined, UserOutlined } from '@ant-design/icons'
import { Card, Image, Tag } from 'antd'
import { useNavigate } from 'react-router-dom'
import { ICourse } from '@/modules/home/cores/interfaces'
import images from '@/assets/images'

const { Meta } = Card

const ItemTopCourses = ({ course }: { course: ICourse }) => {
  const navigate = useNavigate()
  
  // Lấy tag từ backend
  const getCourseTag = () => {
    if (!course?.level) return null
    
    // level từ backend là enum: "BASIC" hoặc "APPLICATION"
    if (course.level === 'APPLICATION' || course.level === 'application') {
      return { text: 'Ứng dụng', color: 'blue' }
    }
    if (course.level === 'BASIC' || course.level === 'basic') {
      return { text: 'Cơ bản', color: 'green' }
    }
    return { text: course.level, color: 'default' }
  }

  const courseTag = getCourseTag()

  return (
    <Card
      cover={
        <div style={{ position: 'relative' }}>
          <Image
            preview={false}
            src={course?.img}
            alt={`Khoá học ${course.title}`}
            fallback={images.imgeNotFond}
            style={{ 
              width: '100%', 
              height: '200px',
              objectFit: 'cover',
              borderRadius: '16px 16px 0 0'
            }}
          />
          {courseTag && (
            <Tag
              color={courseTag.color}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                margin: 0,
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '12px',
                padding: '4px 12px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                zIndex: 2
              }}
            >
              {courseTag.text}
            </Tag>
          )}
        </div>
      }
      hoverable
      className="group text-center rounded-2xl bg-white transition-all duration-300"
      style={{
        borderRadius: '16px',
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
      }}
      bodyStyle={{
        padding: '16px',
        borderTop: '1px solid #f3f4f6'
      }}
      onClick={() => {
        navigate(`/courses/${course.id}`)
      }}
      actions={[
        <span
          key='view'
          className="transition-colors duration-300 cursor-pointer group-hover:text-blue-500 text-gray-600 font-medium"
          style={{ 
            padding: '12px 0',
            borderTop: '1px solid #f3f4f6',
            display: 'block'
          }}
        >
          Xem chi tiết
        </span>
      ]}
      onMouseEnter={(e) => {
        const card = e.currentTarget
        card.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        card.style.borderColor = '#3b82f6'
      }}
      onMouseLeave={(e) => {
        const card = e.currentTarget
        card.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
        card.style.borderColor = '#e5e7eb'
      }}
    >
      <Meta
        title={
          <div className="text-gray-800 font-semibold text-base line-clamp-2" style={{ minHeight: '48px' }}>
            {course.title}
          </div>
        }
      />
      <div className="mt-3 text-sm text-gray-500">
        <div className="flex items-center justify-center gap-2">
          <UserOutlined className="text-gray-500 group-hover:text-blue-500 transition-colors" />
          <span className="text-gray-500 group-hover:text-blue-500 transition-colors">{course?.enrollCount || 0} học viên</span>
          <span className="text-gray-400">•</span>
          <ClockCircleOutlined className="text-gray-500 group-hover:text-blue-500 transition-colors" />
          <span className="text-gray-500 group-hover:text-blue-500 transition-colors">{course?.duration || 'N/A'}</span>
        </div>
      </div>
    </Card>
  )
}

export default ItemTopCourses