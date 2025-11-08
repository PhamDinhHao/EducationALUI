import { useEffect, useMemo, useState, useRef } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Alert, Breadcrumb, Button, Layout, List, Spin, Typography } from 'antd'
import { VideoPlayer } from '@/shared/components/VideoPlayer'
import { CommentSection } from '@/modules/course/components/CommentSection'
import { updateLessonProgressIfHigher, getLessonProgress } from '@/modules/course/services/courseProgress.service'
import { useBoundStore } from '@/shared/stores'
import env from '@/shared/core/constants/env'
const { Sider, Content } = Layout
const { Title, Text } = Typography

type Lesson = { id: number; title: string; src?: string; duration?: number; description?: string; order?: number; courseId?: number }

export default function LessonPlayerPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const user = useBoundStore((state) => state.user)

  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const lastUpdateTimeRef = useRef<number>(0)
  const lastProgressRef = useRef<number>(0)
  const hasMarkedCompletedRef = useRef<boolean>(false)

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

  useEffect(() => {
    lastUpdateTimeRef.current = 0
    lastProgressRef.current = 0
    hasMarkedCompletedRef.current = false
  }, [lesson?.id])

  useEffect(() => {
    if (!lesson?.id || !user?.id) return

    let hasCheckedProgress = false

    const checkAndUpdateProgress = async () => {
      if (hasCheckedProgress) return
      
      try {
        const progressData = await getLessonProgress(lesson.id)
        const currentProgress = progressData?.progress || 0
        hasCheckedProgress = true

        if (currentProgress >= 100) {
          hasMarkedCompletedRef.current = true
        }

        if (currentProgress === 0) {
          await updateLessonProgressIfHigher(lesson.id, 10, null)
          if (lesson.courseId) {
            window.dispatchEvent(new CustomEvent('lessonProgressUpdated', { 
              detail: { lessonId: lesson.id, courseId: lesson.courseId } 
            }))
          }
        }
      } catch (error) {
        console.error('Error checking lesson progress:', error)
      }
    }

    checkAndUpdateProgress()
  }, [lesson?.id, user?.id, lesson?.courseId])

  const handleVideoEnded = async () => {
    if (!lesson?.id || !user?.id || hasMarkedCompletedRef.current) return
    
    try {
      await updateLessonProgressIfHigher(lesson.id, 100, new Date())
      hasMarkedCompletedRef.current = true
      if (lesson.courseId) {
        window.dispatchEvent(new CustomEvent('lessonProgressUpdated', { 
          detail: { lessonId: lesson.id, courseId: lesson.courseId } 
        }))
      }
    } catch (error) {
      console.error('Error marking lesson as completed:', error)
    }
  }

  const handleTimeUpdate = async (currentTime: number, duration: number) => {
    if (!lesson?.id || !user?.id || !duration || duration === 0) return
    if (hasMarkedCompletedRef.current) return

    const now = Date.now()
    const progressPercent = Math.min(100, Math.round((currentTime / duration) * 100))
    
    let targetMilestone = 0
    if (progressPercent >= 75) {
      targetMilestone = 75
    } else if (progressPercent >= 50) {
      targetMilestone = 50
    } else if (progressPercent >= 25) {
      targetMilestone = 25
    } else if (progressPercent > 0) {
      targetMilestone = 10
    }

    const shouldUpdate = 
      targetMilestone > 0 &&
      (now - lastUpdateTimeRef.current >= 10000) &&
      progressPercent > lastProgressRef.current

    if (shouldUpdate) {
      try {
        const progressData = await getLessonProgress(lesson.id)
        const currentProgressValue = progressData?.progress || 0
        
        if (targetMilestone > currentProgressValue && currentProgressValue < 100) {
          await updateLessonProgressIfHigher(lesson.id, targetMilestone, null)
          lastUpdateTimeRef.current = now
          lastProgressRef.current = progressPercent
          
          if (lesson.courseId) {
            window.dispatchEvent(new CustomEvent('lessonProgressUpdated', { 
              detail: { lessonId: lesson.id, courseId: lesson.courseId } 
            }))
          }
        }
      } catch (error) {
        console.error('Error updating video progress:', error)
      }
    } else {
      if (progressPercent > lastProgressRef.current) {
        lastProgressRef.current = progressPercent
      }
    }
  }

  if (loading) return <Spin size='large' style={{ margin: 24 }} />
  if (error) return <Alert type='error' message='Error' description={error} showIcon style={{ margin: 24 }} />
  if (!lesson) return <p>Không tìm thấy bài học.</p>

  return (
    <Layout style={{ background: '#fff', height: '100vh', overflow: 'hidden' }}>
      <Content style={{ padding: 16, overflowY: 'auto', height: '100%' }}>
        <Breadcrumb style={{ marginBottom: 16 }}>
          <Breadcrumb.Item>
            <Link
              to={`${window.location.origin}/courses/${lesson.courseId}`}
            >
              Quay lại khóa học
            </Link>
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
          youtubeOptions={{
            autoplay: true,
          }}
          onVideoEnded={handleVideoEnded}
          onTimeUpdate={handleTimeUpdate}
        />
        <Title level={3} style={{ marginTop: 16, marginBottom: 8 }}>{lesson.title}</Title>
        <Text type='secondary' style={{ display: 'block', marginBottom: 24 }}>
          {lesson?.description || ''}
        </Text>
        <CommentSection lessonId={lesson.id} />
      </Content>
      <Sider width={360} theme='light' style={{ padding: 16, borderLeft: '1px solid #f0f0f0', overflowY: 'auto', height: '100%' }}>
        <Title level={4} style={{ marginBottom: 12 }}>Nội dung khóa học</Title>

        <List
          dataSource={sortedLessons}
          renderItem={(item, index) => {
            const isCurrentLesson = item.id === lesson.id
            return (
              <List.Item
                key={item.id}
                style={{ background: isCurrentLesson ? '#e6f4ff' : undefined, borderRadius: 8, marginBottom: 8, padding: 8 }}
                actions={[
                  <Button 
                    size='small' 
                    type={isCurrentLesson ? 'primary' : 'default'}
                    disabled={isCurrentLesson}
                    onClick={() => navigate(`/lesson/${item.id}`)}
                  >
                    {isCurrentLesson ? 'Đang xem' : 'Xem'}
                  </Button>
                ]}
              >
                <List.Item.Meta
                  title={<span>{index + 1}. {item.title}</span>}
                  description={<Text type='secondary'>{item.duration ? `${Math.floor((item.duration || 0) / 60)}:${String((item.duration || 0) % 60).padStart(2, '0')}` : ''}</Text>}
                />
              </List.Item>
            )
          }}
        />
      </Sider>
    </Layout>
  )
}
