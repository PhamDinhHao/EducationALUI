// src/modules/Course/pages/CourseList.tsx
import { useEffect, useState } from 'react'
import { Spin, message } from 'antd'
import axios from 'axios'
import { Course } from '../../types/Course'
import CourseTypeSection from './CourseTypeSection'
import env from '@/shared/core/constants/env'

const CourseList = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const isAdmin = true

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get<Course[]>(`${env.VITE_HOST_API}/courses`)
        setCourses(res.data)
      } catch (error: any) {
        console.error(error)
        message.error('Lấy dữ liệu khóa học thất bại!')
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  if (loading) return <Spin size='large' style={{ display: 'block', margin: '50px auto' }} />

  const coursesByType: Record<string, Course[]> = {}

  courses.forEach((course) => {
    const type = course.courseType ?? 'Chung'
    if (!coursesByType[type]) coursesByType[type] = []
    coursesByType[type].push(course)
  })

  return (
    <>
      {Object.entries(coursesByType).map(([type, coursesOfType]) => (
        <CourseTypeSection key={type} type={type} courses={coursesOfType} isAdmin={isAdmin} />
      ))}
    </>
  )
}

export default CourseList
