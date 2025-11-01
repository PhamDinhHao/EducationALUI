import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Spin, Alert, Typography, Card } from 'antd'
import { fetchCourseDetail } from '@/shared/server-action/courses.server'
import { CourseProgressCard } from '@/modules/course/components/CourseProgressCard'
import Sidebar from './Sidebar'
import LessonList from './LessonList'

const { Title } = Typography

export type Lesson = {
    id: number
    title: string
    description?: string
    duration?: number
    order?: number
}

export type Course = {
    id: number
    title: string
    description: string
    img?: string
}

export default function CourseDetail() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    const [course, setCourse] = useState<Course | null>(null)
    const [lessons, setLessons] = useState<Lesson[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchCourseAndLessons = async () => {
            setLoading(true)
            setError('')
            try {
                if (!id) return setLoading(false);
                const res = await fetchCourseDetail(id);
                if (res) {
                    setCourse({ id: res.id, title: res.title, description: res.description, img: res.img || '' })
                    setLessons(res.lessons || [])
                }
            } catch (err: any) {
                setError(err.response?.message || 'Lỗi khi tải dữ liệu khóa học')
            } finally {
                setLoading(false)
            }
        }
        if (id) fetchCourseAndLessons()
    }, [id])

    const openLesson = (lessonId: number) => {
        if (!lessonId) return
        localStorage.setItem(`course:${course?.id}:lastLessonId`, String(lessonId))
        navigate(`/lesson/${lessonId}`)
    }

    const handleJoin = () => {
        if (!lessons?.length) return
        const lastId = localStorage.getItem(`course:${course?.id}:lastLessonId`)
        const fallbackId = [...lessons].sort((a, b) => (a.order || 0) - (b.order || 0))[0]?.id
        openLesson(Number(lastId) || fallbackId)
    }

    if (loading) return <Spin size='large' style={{ margin: 24 }} />
    if (error) return <Alert message='Error' description={error} type='error' showIcon style={{ margin: 24 }} />
    if (!course) return <p>Không tìm thấy khóa học.</p>

    return (
        <div style={{ display: 'flex', gap: 24, padding: 24 }}>
            <div style={{ flex: 2 }}>
                <Title level={2} style={{ marginBottom: 16 }}>{course.title}</Title>

                <Card
                    style={{
                        marginBottom: 24,
                        background: 'linear-gradient(135deg,#f5f7fa 0%,#c3cfe2 100%)',
                        border: 'none',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
                    }}
                    bodyStyle={{ padding: 28 }}
                >
                    <Typography.Text style={{
                        color: '#4b4b4b',
                        fontSize: 16,
                        lineHeight: 1.65,
                        whiteSpace: 'pre-line'
                    }}>
                        {course.description || 'Chưa có mô tả về khóa học này.'}
                    </Typography.Text>
                </Card>

                {course.id && lessons.length > 0 && (
                    <CourseProgressCard courseId={course.id} totalLessons={lessons.length} />
                )}

                <LessonList lessons={lessons} onOpenLesson={openLesson} />
            </div>
            <div style={{ flex: 1 }}>
                <Sidebar isLesson={lessons && lessons.length > 0} course={course} onJoin={handleJoin} />
            </div>
        </div>
    )
}
