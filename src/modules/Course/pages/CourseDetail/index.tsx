import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { Spin, Alert } from 'antd'
import { Course, Lesson } from '../../types/Course'
import LessonList from './LessonList'
import CourseSidebar from './CourseSidebar'
import env from '@/shared/core/constants/env'

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>()

  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCourseAndLessons = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await axios.get(`${env.VITE_HOST_API}/courses/${id}`)
        if (res.data) {
          setCourse({
            id: res.data.id,
            title: res.data.title,
            description: res.data.description,
            img: res.data.img || '',
            value: res.data.id,
            introductions: res.data.introductions || '[]', // ⬅️ Parse ở đây
            price: 1000000,
            teacher: 'Nguyễn Văn A',
            students: 120,
            duration: '116h50p'
          })
          setLessons(res.data.lessons || [])
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Lỗi khi tải dữ liệu khóa học')
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchCourseAndLessons()
  }, [id])

  if (loading) return <Spin size='large' style={{ margin: 24 }} />
  if (error) return <Alert message='Error' description={error} type='error' showIcon style={{ margin: 24 }} />
  if (!course) return <p>Không tìm thấy khóa học.</p>

  return (
    <div style={{ display: 'flex', gap: 24, padding: 24 }}>
      <div style={{ flex: 2 }}>
        {/*<CourseInfo course={course} />*/}
        <LessonList lessons={lessons} />
      </div>
      <div style={{ flex: 1 }}>
        <CourseSidebar course={course} />
      </div>
    </div>
  )
}
