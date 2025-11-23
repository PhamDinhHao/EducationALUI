import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { Collapse, Typography, Space, Button } from 'antd'
import { CheckCircleOutlined, PlayCircleOutlined, RocketOutlined } from '@ant-design/icons'
import { getCourseProgress, LessonProgressItem } from '@/modules/course/services/courseProgress.service'
import { useBoundStore } from '@/shared/stores'

const { Panel } = Collapse
const { Text } = Typography

export type Lesson = {
  id: number
  title: string
  description?: string
  duration?: number
  order?: number
}

export default function LessonList({ lessons, onOpenLesson, currentLessonId, courseId }: { lessons: Lesson[]; onOpenLesson?: (id: number) => void; currentLessonId?: number; courseId?: number }) {
  const user = useBoundStore((state) => state.user)
  const [progressItems, setProgressItems] = useState<LessonProgressItem[]>([])

  const lastViewedLessonId = currentLessonId || (courseId ? Number(localStorage.getItem(`course:${courseId}:lastLessonId`)) : undefined)
  
  useEffect(() => {
    const fetchProgress = async () => {
      if (!courseId || !user?.id) {
        setProgressItems([])
        return
      }

      try {
        const progress = await getCourseProgress(courseId)
        setProgressItems(progress)
      } catch (error) {
        console.error('Error fetching lesson progress:', error)
        setProgressItems([])
      }
    }

    fetchProgress()
  }, [courseId, user?.id])

  useEffect(() => {
    if (!user?.id || !courseId) return

    const handleProgressUpdate = (event: CustomEvent) => {
      if (event.detail?.courseId === courseId) {
        fetchProgress()
      }
    }

    const fetchProgress = async () => {
      try {
        const progress = await getCourseProgress(courseId)
        setProgressItems(progress)
      } catch (error) {
        console.error('Error fetching lesson progress:', error)
      }
    }

    window.addEventListener('lessonProgressUpdated', handleProgressUpdate as EventListener)
    
    return () => {
      window.removeEventListener('lessonProgressUpdated', handleProgressUpdate as EventListener)
    }
  }, [user?.id, courseId])

  const getLessonProgress = (lessonId: number): LessonProgressItem | undefined => {
    return progressItems.find(item => item.lessonId === lessonId)
  }
  
  const groups = [{ name: 'Nội dung khóa học', items: [...lessons].sort((a, b) => (a.order || 0) - (b.order || 0)) }]
  return (
    <Collapse defaultActiveKey={['0']} accordion>
      {groups.map((g, idx) => (
        <Panel header={<span><Text strong>{g.name}</Text> <Text type='secondary' style={{ marginLeft: 8 }}>{g.items.length} bài học</Text></span>} key={idx}>
          <Space direction='vertical' style={{ width: '100%' }} size={8}>
            {g.items.map((l, i) => {
              const lessonProgress = getLessonProgress(l.id)
              const progress = lessonProgress?.progress || 0
              const isCompleted = progress >= 100
              const isInProgress = progress > 0 && progress < 100
              const isLastViewed = lastViewedLessonId === l.id
              
              let buttonText = 'Bắt đầu học'
              let buttonType: 'primary' | 'default' | 'dashed' = 'default'
              let buttonIcon = <RocketOutlined />
              let buttonStyle: CSSProperties = {}
              
              if (isCompleted) {
                buttonText = 'Xem lại'
                buttonType = 'dashed'
                buttonIcon = <CheckCircleOutlined />
                buttonStyle = {
                  borderColor: '#52c41a',
                  color: '#52c41a',
                  fontWeight: 500
                }
              } else if (isInProgress && isLastViewed) {
                buttonText = 'Tiếp tục'
                buttonType = 'primary'
                buttonIcon = <PlayCircleOutlined />
                buttonStyle = {
                  background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                  border: 'none',
                  boxShadow: '0 2px 8px rgba(24, 144, 255, 0.3)',
                  fontWeight: 500
                }
              } else if (isInProgress) {
                buttonText = 'Tiếp tục'
                buttonType = 'default'
                buttonIcon = <PlayCircleOutlined />
                buttonStyle = {
                  fontWeight: 500
                }
              } else {
                buttonStyle = {
                  fontWeight: 500
                }
              }

              return (
                <div 
                  key={l.id} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    padding: '8px 12px', 
                    border: '1px solid #f0f0f0', 
                    borderRadius: 8,
                    background: isLastViewed ? '#f0f7ff' : undefined
                  }}
                >
                  <Space>
                    <span>{i + 1}.</span>
                    <span>{l.title}</span>
                    {isCompleted && (
                      <Text type='success' style={{ fontSize: 12 }}>
                        <CheckCircleOutlined style={{ marginRight: 4 }} />
                        Đã hoàn thành
                      </Text>
                    )}
                    {!isCompleted && isLastViewed && (
                      <Text type='secondary' style={{ fontSize: 12 }}>(Đã xem)</Text>
                    )}
                  </Space>
                  <Space>
                    {l.duration ? <Text type='secondary'>{Math.floor(l.duration / 60)}:{String(l.duration % 60).padStart(2, '0')}</Text> : null}
                    <Button 
                      size='small' 
                      type={buttonType}
                      icon={buttonIcon}
                      onClick={() => onOpenLesson?.(l.id)}
                      style={buttonStyle}
                    >
                      {buttonText}
                    </Button>
                  </Space>
                </div>
              )
            })}
          </Space>
        </Panel>
      ))}
    </Collapse>
  )
}
