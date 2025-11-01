import { useEffect, useState } from 'react'
import { ICourse } from '@/modules/home/cores/interfaces'
import ResponsiveGrid from '@shared/ResponsiveGrid/ResponsiveGrid.tsx'
import TitleHeaderHome from '@shared/components/TitleHeaderHome/TitleHeaderHome.tsx'
import ItemTopCourses from '@/modules/home/component/TopCourses/ItemTopCourses.tsx'
import { fetchTopEnrolledCourses } from '@/shared/server-action/courses.server'
import { useNavigate } from 'react-router-dom'

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
      <ResponsiveGrid<ICourse>
        data={courses}
        cols={4}
        colSpans={{ xs: 24, sm: 12, md: 8, lg: 6, xl: 6 }}
        renderCell={ItemTopCourses}
      />
    </div>
  )
}

export default TopCourses

