import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Row, Col, Spin, Alert, Typography, Empty, Image } from 'antd'
import { ClockCircleOutlined, UserOutlined } from '@ant-design/icons'
import { fetchMyEnrollments } from '@/shared/server-action/enrollment.server'
import { ICourse } from '@/modules/home/cores/interfaces'
import images from '@/assets/images'

const { Title } = Typography
const { Meta } = Card

interface Enrollment {
  id: number
  enrolledAt: string
  status: string
  course: ICourse
}

export default function MyCourses() {
  const navigate = useNavigate()
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchEnrollments = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await fetchMyEnrollments()
        if (data && Array.isArray(data)) {
          setEnrollments(data)
        }
      } catch (err: any) {
        setError(err.message || 'Lỗi khi tải danh sách khóa học')
      } finally {
        setLoading(false)
      }
    }

    fetchEnrollments()
  }, [])

  if (loading) {
    return <Spin size="large" style={{ margin: 24, display: 'block', textAlign: 'center' }} />
  }

  if (error) {
    return <Alert message="Lỗi" description={error} type="error" showIcon style={{ margin: 24 }} />
  }

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <Title level={2} style={{ marginBottom: 24 }}>Khóa học của bạn</Title>

      {enrollments.length === 0 ? (
        <Empty
          description="Bạn chưa đăng ký khóa học nào"
          style={{ marginTop: 48 }}
        />
      ) : (
        <Row gutter={[16, 16]}>
          {enrollments.map((enrollment) => (
            <Col xs={24} sm={12} md={8} lg={6} key={enrollment.id}>
              <Card
                cover={
                  <Image
                    preview={false}
                    src={enrollment.course?.img}
                    alt={`Khoá học ${enrollment.course.title}`}
                    fallback={images.imgeNotFond}
                    style={{ width: '100%', height: 200, objectFit: 'cover' }}
                  />
                }
                hoverable
                style={{ borderRadius: 16, border: '1px solid #f0f0f0', height: '100%' }}
                onClick={() => {
                  navigate(`/courses/${enrollment.course.id}`)
                }}
                actions={[
                  <span
                    key="view"
                    style={{ color: '#1890ff', cursor: 'pointer' }}
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/courses/${enrollment.course.id}`)
                    }}
                  >
                    Xem chi tiết
                  </span>
                ]}
              >
                <Meta title={enrollment.course.title} />
                <div style={{ marginTop: 12, fontSize: 14, color: '#666' }}>
                  <div style={{ marginBottom: 8 }}>
                    <UserOutlined style={{ marginRight: 4 }} />
                    <span>{enrollment.course?.students || 0} học viên</span>
                    {enrollment.course?.duration && (
                      <>
                        <span style={{ margin: '0 8px' }}>•</span>
                        <ClockCircleOutlined style={{ marginRight: 4 }} />
                        <span>{enrollment.course.duration}</span>
                      </>
                    )}
                  </div>
                  <div style={{ color: '#888', fontSize: 12 }}>{enrollment.course.teacher}</div>
                  <div style={{ color: '#52c41a', fontSize: 12, marginTop: 4 }}>
                    Đã đăng ký: {new Date(enrollment.enrolledAt).toLocaleDateString('vi-VN')}
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  )
}

