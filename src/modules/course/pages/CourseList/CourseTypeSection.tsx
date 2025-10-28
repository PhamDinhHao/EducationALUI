//-> render từng nhóm courseType (Divider + Row)// src/modules/Course/components/CourseTypeSection.tsx
import { Divider, Row, Col } from 'antd'
import { Course } from '@/modules/course/types/Course.ts'
import CourseCardItem from './CourseCardItem.tsx'

type Props = {
  type: string
  courses: Course[]
  isAdmin?: boolean
}

export default function CourseTypeSection({ type, courses, isAdmin }: Props) {
  return (
    <div style={{ marginBottom: 40 }}>
      <Divider orientation='left'>{type === 'general' ? 'Tổng quan' : type}</Divider>
      <Row gutter={[16, 16]} justify='start' style={{ padding: '0 40px' }}>
        {courses.map((course) => (
          <Col xs={24} sm={12} md={8} key={course.id}>
            <CourseCardItem course={course} isAdmin={isAdmin} />
          </Col>
        ))}
      </Row>
    </div>
  )
}
