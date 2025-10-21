import { Course } from '../../types/Course';
import CourseCard from '@/modules/Course/Component/CourseCard';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';

type Props = {
  course: Course;
  isAdmin?: boolean;
  user?: { id: number; role: string; courses?: number[] }; 
  // user: danh sách khóa học đã mua
};

export default function CourseCardItem({ course, isAdmin, user }: Props) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (course.price === 0) {
      // miễn phí => ai cũng vào được
      navigate(`/courses/${course.id}`);
    } else {
      // trả phí => cần quyền
      if (!user) {
        message.warning("Vui lòng đăng nhập để truy cập khóa học trả phí");
        return;
      }

      const hasAccess = user.role === "admin" || user.courses?.includes(course.id);

      if (hasAccess) {
        navigate(`/courses/${course.id}`);
      } else {
        message.error("Bạn chưa có quyền truy cập khóa học này");
      }
    }
  };

  return (
    <div onClick={handleClick} style={{ cursor: 'pointer' }}>
      <CourseCard course={course} isAdmin={isAdmin} />
    </div>
  );
}
