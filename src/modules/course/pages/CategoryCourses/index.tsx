import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Spin, Alert, Typography, Row, Col, Card, Image } from 'antd'
import { ClockCircleOutlined, UserOutlined } from '@ant-design/icons'
import { fetchCoursesByCategoryId } from '@/shared/server-action/courses.server'
import { fetchCourseTypeById } from '@/shared/server-action/courseTypes.server'
import { ICourse } from '@/modules/home/cores/interfaces'
import images from '@/assets/images'

const { Title } = Typography
const { Meta } = Card

export default function CategoryCourses() {
  const { categoryId } = useParams<{ categoryId: string }>()
  const navigate = useNavigate()

  const [courses, setCourses] = useState<ICourse[]>([])
  const [categoryName, setCategoryName] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true)
      setError('')
      try {
        if (!categoryId) return setLoading(false)

        const categoryData = await fetchCourseTypeById(categoryId)
        if (categoryData) {
          setCategoryName(categoryData.name || '')
        }

        const data = await fetchCoursesByCategoryId(categoryId)
        if (data && Array.isArray(data)) {
          setCourses(data)
        }
      } catch (err: any) {
        setError(err.message || 'Lỗi khi tải danh sách khóa học')
      } finally {
        setLoading(false)
      }
    }

    if (categoryId) fetchCourses()
  }, [categoryId])

  if (loading) return <Spin size="large" style={{ margin: 24, display: 'block' }} />

  if (error) return <Alert message="Lỗi" description={error} type="error" showIcon style={{ margin: 24 }} />

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <Title level={2} style={{ marginBottom: 24 }}>
        {categoryName ? `Khóa học ${categoryName}` : 'Danh sách khóa học'}
      </Title>

      {courses.length === 0 ? (
        <Alert
          message="Không có khóa học"
          description="Hiện tại chưa có khóa học nào trong danh mục này."
          type="info"
          showIcon
          style={{ marginTop: 24 }}
        />
      ) : (
        <Row gutter={[16, 16]}>
          {courses.map((course) => (
            <Col xs={24} sm={12} md={8} lg={6} key={course.id}>
              <Card
                cover={
                  <Image
                    preview={false}
                    src={course?.img}
                    alt={`Khoá học ${course.title}`}
                    fallback={images.imgeNotFond}
                    style={{ width: '100%', height: 200, objectFit: 'cover' }}
                  />
                }
                hoverable
                style={{ borderRadius: 16, border: '1px solid #f0f0f0' }}
                onClick={() => {
                  navigate(`/courses/${course.id}`)
                }}
                actions={[
                  <span
                    key="view"
                    style={{ color: '#1890ff', cursor: 'pointer' }}
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/courses/${course.id}`)
                    }}
                  >
                    Xem chi tiết
                  </span>
                ]}
              >
                <Meta title={course.title} />
                <div style={{ marginTop: 12, fontSize: 14, color: '#666' }}>
                  <div style={{ marginBottom: 8 }}>
                    <UserOutlined style={{ marginRight: 4 }} />
                    <span>{course?.students || 0} học viên</span>
                    {course?.duration && (
                      <>
                        <span style={{ margin: '0 8px' }}>•</span>
                        <ClockCircleOutlined style={{ marginRight: 4 }} />
                        <span>{course.duration}</span>
                      </>
                    )}
                  </div>
                  <div style={{ color: '#888', fontSize: 12 }}>{course.teacher}</div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  )
}

