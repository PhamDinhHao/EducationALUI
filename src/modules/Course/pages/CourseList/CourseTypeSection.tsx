//-> render từng nhóm courseType (Divider + Row)// src/modules/Course/components/CourseTypeSection.tsx
import { Divider, Row, Col } from 'antd';
import { Course } from '../../types/Course';
import CourseCardItem from './CourseCardItem';

type Props = {
  type: string;
  courses: Course[];
  isAdmin?: boolean;
  onUpdated?: (course: Course) => void;
};

export default function CourseTypeSection({ type, courses, isAdmin, onUpdated }: Props) {
  return (
    <div style={{ marginBottom: 40 }}>
      <Divider orientation="left">{type}</Divider>
      <Row gutter={[16, 16]} justify="start" style={{ padding: '0 40px' }}>
        {courses.map((course) => (
          <Col xs={24} sm={12} md={8} key={course.id}>
            <CourseCardItem course={course} isAdmin={isAdmin} onUpdated={onUpdated} />
          </Col>
        ))}
      </Row>
    </div>
  );
}
