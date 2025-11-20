import { useEffect, useState } from 'react'
import { ICourse } from '@/modules/home/cores/interfaces'
import TitleHeaderHome from '@shared/components/TitleHeaderHome/TitleHeaderHome.tsx'
import ItemTopCourses from '@/modules/home/component/TopCourses/ItemTopCourses.tsx'
import { fetchTopEnrolledCourses } from '@/shared/server-action/courses.server'
import { useNavigate } from 'react-router-dom'
import CarouselSlider from '@shared/components/CarouselSlider/CarouselSlider.tsx'

const TopCourses = () => {

  const naviagte = useNavigate();

  const [courses, setCourses] = useState<ICourse[]>([])

  useEffect(() => {

    const fetchTopEnrolledCourse = async () => {
      const data = await fetchTopEnrolledCourses()
      setCourses(data)
    }

    fetchTopEnrolledCourse()
  }, [])

  const handleNavigate = () => {
    naviagte('/courses')
  }


  return (
    <div>
      <TitleHeaderHome onAction={handleNavigate} heading='Khóa học nổi bật' description='Explore our Popular Courses' buttonLabel='Tất cả khóa học' />
      <CarouselSlider<ICourse>
        data={courses}
        renderItem={(course) => <ItemTopCourses course={course} />}
        itemsPerView={4}
      />
    </div>
  )
}

export default TopCourses

