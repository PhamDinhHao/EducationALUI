import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Alert, Breadcrumb, Button, Layout, List, Spin, Typography } from 'antd'
import { VideoPlayer } from '@/shared/components/VideoPlayer'
import { CommentSection } from '@/modules/course/components/CommentSection'
import { CourseProgressCard } from '@/modules/course/components/CourseProgressCard'
import env from '@/shared/core/constants/env'
const { Sider, Content } = Layout
const { Title, Text } = Typography

type Lesson = { id: number; title: string; src?: string; duration?: number; description?: string; order?: number; courseId?: number }

export default function LessonPlayerPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError('')
        const res = await fetch(`${env.VITE_HOST_API}/lessons/${id}`)
        const data = await res.json()
        if (res.ok) {
          setLesson(data)
          localStorage.setItem(`course:${data.courseId}:lastLessonId`, String(data.id))
          const resList = await fetch(`${env.VITE_HOST_API}/lessons/course/${data.courseId}`)
          const list = await resList.json()
          if (resList.ok) setLessons(list)
        } else {
          setError(data?.message || 'Không tải được bài học')
        }
      } catch (e: any) {
        setError('Lỗi mạng, vui lòng thử lại')
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchData()
  }, [id])

  const sortedLessons = useMemo(() => [...lessons].sort((a, b) => (a.order || 0) - (b.order || 0)), [lessons])

  if (loading) return <Spin size='large' style={{ margin: 24 }} />
  if (error) return <Alert type='error' message='Error' description={error} showIcon style={{ margin: 24 }} />
  if (!lesson) return <p>Không tìm thấy bài học.</p>

  return (
    <Layout style={{ background: '#fff', height: '100vh', overflow: 'hidden' }}>
      <Content style={{ padding: 16, overflowY: 'auto', height: '100%' }}>
        <Breadcrumb style={{ marginBottom: 16 }}>
          <Breadcrumb.Item>
            <a onClick={() => navigate(-1)}> Quay lại</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {lesson?.title || ''}
          </Breadcrumb.Item>
        </Breadcrumb>
        <VideoPlayer
          src={lesson.src}
          title={lesson.title}
          aspectRatio="16/9"
          emptyMessage="Không có video"
          className='mb-4'
          style={{ marginBottom: 16, width: '100%', height: '80%' }}
        // youtubeOptions={{
        //   autoplay: true,
        // }}
        />
        <Title level={3} style={{ marginTop: 16, marginBottom: 8 }}>{lesson.title}</Title>
        <Text type='secondary' style={{ display: 'block', marginBottom: 24 }}>
          {lesson?.description || ''}
        </Text>
        <CommentSection lessonId={lesson.id} />
      </Content>
      <Sider width={360} theme='light' style={{ padding: 16, borderLeft: '1px solid #f0f0f0', overflowY: 'auto', height: '100%' }}>
        <Title level={4} style={{ marginBottom: 12 }}>Nội dung khóa học</Title>

        {lesson?.courseId && sortedLessons.length > 0 && (
          <CourseProgressCard courseId={lesson.courseId} totalLessons={sortedLessons.length} />
        )}

        <List
          dataSource={sortedLessons}
          renderItem={(item, index) => (
            <List.Item
              key={item.id}
              style={{ background: item.id === lesson.id ? '#e6f4ff' : undefined, borderRadius: 8, marginBottom: 8, padding: 8 }}
              actions={[
                <Button size='small' onClick={() => navigate(`/lesson/${item.id}`)}>Xem</Button>
              ]}
            >
              <List.Item.Meta
                title={<span>{index + 1}. {item.title}</span>}
                description={<Text type='secondary'>{item.duration ? `${Math.floor((item.duration || 0) / 60)}:${String((item.duration || 0) % 60).padStart(2, '0')}` : ''}</Text>}
              />
            </List.Item>
          )}
        />
      </Sider>
    </Layout>
  )
}
