// src/modules/Course/components/CourseMenu.tsx
import { useState, memo } from 'react'
import { Card, Row, Col, Button, Drawer } from 'antd'
import { MenuOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { Course } from '@/modules/course/types/Course'
import { useBoundStore } from '@/shared/stores'

const courses: Course[] = [
  { id: 1, title: 'React cơ bản', description: 'Nhập môn React', img: 'https://via.placeholder.com/150', url: '/courses/1' },
  { id: 2, title: 'Node.js nâng cao', description: 'Backend Node.js', img: 'https://via.placeholder.com/150', url: '/courses/2' },
  { id: 3, title: 'AI cơ bản', description: 'Trí tuệ nhân tạo', img: 'https://via.placeholder.com/150', url: '/courses/3' },
]

const { Meta } = Card

const CourseMenu = () => {
  const { user } = useBoundStore(state => state)
  const navigate = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const renderCourses = () => (
    <Row gutter={[16, 16]}>
      {courses.map(course => (
        <Col xs={24} sm={12} md={8} lg={6} key={course.id}>
          <Card
            hoverable
            cover={<img alt={course.title} src={course.img} />}
            actions={[
              <Button
                type="primary"
                onClick={() => {
                  if (!user) {
                    alert('Vui lòng đăng nhập để xem chi tiết')
                    return
                  }
                  course.url && navigate(course.url)
                }}
              >
                Xem chi tiết
              </Button>
            ]}
          >
            <Meta title={course.title} description={course.description} />
          </Card>
        </Col>
      ))}
    </Row>
  )

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block">{renderCourses()}</div>

      {/* Mobile */}
      <div className="lg:hidden">
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={() => setDrawerOpen(true)}
          style={{ marginBottom: 16 }}
        >
          Khóa học
        </Button>
        <Drawer
          title="Danh sách khóa học"
          placement="right"
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
          width={280}
        >
          {renderCourses()}
        </Drawer>
      </div>
    </>
  )
}

export default memo(CourseMenu)
