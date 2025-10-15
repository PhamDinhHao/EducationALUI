// src/modules/Course/pages/CourseList.tsx
import { useEffect, useState } from 'react'
import { Spin, message } from 'antd'
import axios from 'axios'
import { Course } from '@/modules/course/types/Course.ts'
import CourseTypeSection from './CourseTypeSection.tsx'

const CourseList = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const isAdmin = true

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get<Course[]>('http://localhost:5000/api/v1/courses')
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

  const handleUpdated = (updated: Course) => {
    setCourses((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
  }

  return (
    <>
      {Object.entries(coursesByType).map(([type, coursesOfType]) => (
        <CourseTypeSection key={type} type={type} courses={coursesOfType} isAdmin={isAdmin} onUpdated={handleUpdated} />
      ))}
    </>
  )
}

export default CourseList
