import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Alert, Button, Layout, List, Spin, Typography } from 'antd'
import env from '@/shared/core/constants/env'

const { Sider, Content } = Layout
const { Title, Text } = Typography

type Lesson = { id: number; title: string; src?: string; duration?: number; order?: number; courseId?: number }

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
    <Layout style={{ background: '#fff' }}>
      <Content style={{ padding: 16 }}>
        <div style={{ background: '#000', aspectRatio: '16/9', borderRadius: 8, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {lesson.src ? (
            <video src={lesson.src} controls style={{ width: '100%', height: '100%' }} />
          ) : (
            <Title level={3} style={{ color: '#fff' }}>Không có video</Title>
          )}
        </div>
        <Title level={3} style={{ marginTop: 16 }}>{lesson.title}</Title>
      </Content>
      <Sider width={360} theme='light' style={{ padding: 16, borderLeft: '1px solid #f0f0f0' }}>
        <Title level={4} style={{ marginBottom: 12 }}>Nội dung khóa học</Title>
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
