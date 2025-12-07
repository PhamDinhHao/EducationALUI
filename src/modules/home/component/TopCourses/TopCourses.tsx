import { useEffect, useState } from 'react'
import { ICourse } from '@/modules/home/cores/interfaces'
import TitleHeaderHome from '@shared/components/TitleHeaderHome/TitleHeaderHome.tsx'
import ItemTopCourses from '@/modules/home/component/TopCourses/ItemTopCourses.tsx'
import { fetchTopEnrolledCourses } from '@/shared/server-action/courses.server'
import { useNavigate } from 'react-router-dom'
import { Row, Col } from 'antd'

const TopCourses = () => {

  const navigate = useNavigate();

  const [courses, setCourses] = useState<ICourse[]>([])

  useEffect(() => {

    const fetchTopEnrolledCourse = async () => {
      const data = await fetchTopEnrolledCourses()
      setCourses(data)
    }

    fetchTopEnrolledCourse()
  }, [])

  const handleNavigate = () => {
    navigate('/courses')
  }


  // Limit to 8 courses for grid display (2 rows x 4 items)
  const displayCourses = (courses || []).slice(0, 8)

  return (
    <div>
      <TitleHeaderHome
        onAction={handleNavigate}
        heading='TÀI NGUYÊN NỔI BẬT'
        description='Khám phá những đột phá mới và truy cập các tài nguyên trong AI'
        buttonLabel='Tất cả khóa học'
        center={true}
      />
      <Row gutter={[16, 16]}>
        {displayCourses.map((course) => (
          <Col xs={24} sm={12} md={12} lg={6} xl={6} key={course.id}>
            <ItemTopCourses course={course} />
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default TopCourses

