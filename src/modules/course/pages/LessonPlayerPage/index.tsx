import { useEffect, useMemo, useState, useRef } from 'react'
import type { CSSProperties } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Alert, Breadcrumb, Button, Layout, List, Spin, Typography, Modal, Tag } from 'antd'
import { CheckCircleOutlined, PlayCircleOutlined, RocketOutlined, TrophyOutlined, FileTextOutlined } from '@ant-design/icons'
import { VideoPlayer, type VideoPlayerRef } from '@/shared/components/VideoPlayer'
import { CommentSection } from '@/modules/course/components/CommentSection'
import { updateLessonProgressIfHigher, getLessonProgress, getCourseProgress, calculateCourseProgressStats } from '@/modules/course/services/courseProgress.service'
import { createCertificate } from '@/modules/course/services/certificate.service'
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
  const [lessonProgresses, setLessonProgresses] = useState<Map<number, number>>(new Map())
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [hasShownCompletion, setHasShownCompletion] = useState(false)
  const [videoStartTime, setVideoStartTime] = useState<number | undefined>(undefined)
  const [videoDuration, setVideoDuration] = useState<number | undefined>(undefined)

  const lastUpdateTimeRef = useRef<number>(0)
  const lastProgressRef = useRef<number>(0)
  const hasMarkedCompletedRef = useRef<boolean>(false)
  const videoPlayerRef = useRef<VideoPlayerRef | null>(null)

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

  // Fetch progress for all lessons
  useEffect(() => {
    const fetchAllProgress = async () => {
      if (!lesson?.courseId || !user?.id || sortedLessons.length === 0) return

      try {
        const courseId = lesson.courseId
        const progressItems = await getCourseProgress(courseId)
        const progressMap = new Map<number, number>()
        
        progressItems.forEach(item => {
          progressMap.set(item.lessonId, item.progress)
        })

        setLessonProgresses(progressMap)

        // Check if course is completed
        const stats = calculateCourseProgressStats(progressItems, sortedLessons.length)
        if (stats.completionPercentage === 100 && !hasShownCompletion) {
          // Create certificate when course is completed
          try {
            await createCertificate(courseId)
          } catch (error) {
            console.error('Error creating certificate:', error)
            // Continue even if certificate creation fails
          }
          setShowCompletionModal(true)
          setHasShownCompletion(true)
        }
      } catch (error) {
        console.error('Error fetching lesson progresses:', error)
      }
    }

    fetchAllProgress()
  }, [lesson?.courseId, user?.id, sortedLessons.length, hasShownCompletion])

  // Listen for progress updates
  useEffect(() => {
    if (!lesson?.courseId || !user?.id) return

    const courseId = lesson.courseId

    const handleProgressUpdate = async (event: Event) => {
      const customEvent = event as CustomEvent
      if (customEvent.detail?.courseId === courseId) {
        try {
          const progressItems = await getCourseProgress(courseId)
          const progressMap = new Map<number, number>()
          
          progressItems.forEach(item => {
            progressMap.set(item.lessonId, item.progress)
          })

          setLessonProgresses(progressMap)

          // Check if course is completed
          const stats = calculateCourseProgressStats(progressItems, sortedLessons.length)
          if (stats.completionPercentage === 100 && !hasShownCompletion) {
            // Create certificate when course is completed
            try {
              await createCertificate(courseId)
            } catch (error) {
              console.error('Error creating certificate:', error)
              // Continue even if certificate creation fails
            }
            setShowCompletionModal(true)
            setHasShownCompletion(true)
          }
        } catch (error) {
          console.error('Error updating lesson progresses:', error)
        }
      }
    }

    window.addEventListener('lessonProgressUpdated', handleProgressUpdate)
    
    return () => {
      window.removeEventListener('lessonProgressUpdated', handleProgressUpdate)
    }
  }, [lesson?.courseId, user?.id, sortedLessons.length, hasShownCompletion])

  useEffect(() => {
    lastUpdateTimeRef.current = 0
    lastProgressRef.current = 0
    hasMarkedCompletedRef.current = false
  }, [lesson?.id])

  // Fix video display when modal closes
  useEffect(() => {
    if (!showCompletionModal) {
      // Modal just closed, fix video display
      const fixVideoDisplay = () => {
        // Remove all modal masks that might be blocking
        const masks = document.querySelectorAll('.ant-modal-mask')
        masks.forEach(mask => {
          const maskEl = mask as HTMLElement
          if (maskEl) {
            maskEl.style.display = 'none'
            maskEl.style.pointerEvents = 'none'
            maskEl.style.zIndex = '-1'
          }
        })
        
        // Fix video container
        const videoContainer = document.getElementById('video-player-container')
        if (videoContainer) {
          videoContainer.style.zIndex = '10'
          videoContainer.style.position = 'relative'
        }
        
        // Fix video elements
        const videoElements = document.querySelectorAll('video')
        videoElements.forEach(video => {
          video.style.display = 'block'
          video.style.visibility = 'visible'
          video.style.opacity = '1'
          video.style.zIndex = '10'
          video.style.position = 'relative'
        })
        
        // Fix YouTube iframe if exists
        const iframes = document.querySelectorAll('iframe[src*="youtube"], iframe[id*="youtube"]')
        iframes.forEach(iframe => {
          const iframeEl = iframe as HTMLElement
          iframeEl.style.display = 'block'
          iframeEl.style.visibility = 'visible'
          iframeEl.style.opacity = '1'
          iframeEl.style.zIndex = '10'
          iframeEl.style.position = 'relative'
        })
        
        // Trigger resize for YouTube player
        window.dispatchEvent(new Event('resize'))
      }
      
      // Run immediately and after delays
      fixVideoDisplay()
      setTimeout(fixVideoDisplay, 50)
      setTimeout(fixVideoDisplay, 200)
      setTimeout(fixVideoDisplay, 500)
    }
  }, [showCompletionModal])

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

        // Calculate start time from progress percentage
        // We'll update this when we get the video duration
        if (currentProgress > 0 && currentProgress < 100 && lesson.duration) {
          const calculatedStartTime = Math.floor((currentProgress / 100) * lesson.duration)
          setVideoStartTime(calculatedStartTime)
        } else {
          setVideoStartTime(undefined)
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
  }, [lesson?.id, lesson?.duration, user?.id, lesson?.courseId])

  const handleVideoEnded = async () => {
    if (!lesson?.id || !user?.id || hasMarkedCompletedRef.current) return
    
    try {
      await updateLessonProgressIfHigher(lesson.id, 100, new Date())
      hasMarkedCompletedRef.current = true
      
      // Update local progress map
      setLessonProgresses(prev => {
        const newMap = new Map(prev)
        newMap.set(lesson.id, 100)
        return newMap
      })

      if (lesson.courseId) {
        window.dispatchEvent(new CustomEvent('lessonProgressUpdated', { 
          detail: { lessonId: lesson.id, courseId: lesson.courseId } 
        }))
      }

      // Auto navigate to next lesson
      const currentIndex = sortedLessons.findIndex(l => l.id === lesson.id)
      if (currentIndex >= 0 && currentIndex < sortedLessons.length - 1) {
        const nextLesson = sortedLessons[currentIndex + 1]
        // Small delay to ensure progress is saved
        setTimeout(() => {
          navigate(`/lesson/${nextLesson.id}`)
        }, 500)
      }
    } catch (error) {
      console.error('Error marking lesson as completed:', error)
    }
  }

  const handleTimeUpdate = async (currentTime: number, duration: number) => {
    if (!lesson?.id || !user?.id || !duration || duration === 0) return
    if (hasMarkedCompletedRef.current) return

    // Store duration for calculating start time
    if (!videoDuration || Math.abs(videoDuration - duration) > 1) {
      setVideoDuration(duration)
      
      // Recalculate start time if we have progress but no start time yet
      if (!videoStartTime) {
        try {
          const progressData = await getLessonProgress(lesson.id)
          const currentProgress = progressData?.progress || 0
          if (currentProgress > 0 && currentProgress < 100) {
            const calculatedStartTime = Math.floor((currentProgress / 100) * duration)
            setVideoStartTime(calculatedStartTime)
            // Set current time for HTML5 video
            if (videoPlayerRef.current?.setCurrentTime) {
              videoPlayerRef.current.setCurrentTime(calculatedStartTime)
            }
          }
        } catch (error) {
          console.error('Error calculating start time:', error)
        }
      }
    }

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
            <Button
              type="link"
              onClick={() => {
                // Dispatch event to refresh course detail
                if (lesson.courseId) {
                  window.dispatchEvent(new CustomEvent('courseDetailRefresh', { 
                    detail: { courseId: lesson.courseId } 
                  }))
                }
                navigate(`/courses/${lesson.courseId}`)
              }}
              style={{ padding: 0 }}
            >
              Quay lại khóa học
            </Button>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {lesson?.title || ''}
          </Breadcrumb.Item>
        </Breadcrumb>
        <div 
          id="video-player-container"
          style={{ 
            position: 'relative', 
            zIndex: 10,
            width: '100%',
            height: '80%',
            isolation: 'isolate'
          }}
        >
          <VideoPlayer
            ref={videoPlayerRef}
            src={lesson.src}
            title={lesson.title}
            aspectRatio="16/9"
            emptyMessage="Không có video"
            className='mb-4'
            style={{ marginBottom: 16, width: '100%', height: '100%', position: 'relative', zIndex: 10 }}
            youtubeOptions={{
              autoplay: true,
              start: videoStartTime ? Math.floor(videoStartTime) : undefined,
            }}
            onVideoEnded={handleVideoEnded}
            onTimeUpdate={handleTimeUpdate}
          />
        </div>
        <Title level={3} style={{ marginTop: 16, marginBottom: 8 }}>{lesson.title}</Title>
        <Text type='secondary' style={{ display: 'block', marginBottom: 24 }}>
          {lesson?.description || ''}
        </Text>
        <CommentSection lessonId={lesson.id} />
      </Content>
      <Modal
        open={showCompletionModal}
        onCancel={() => {
          setShowCompletionModal(false)
        }}
        afterClose={() => {
          // Force remove any remaining modal masks
          const masks = document.querySelectorAll('.ant-modal-mask')
          masks.forEach(mask => {
            const maskEl = mask as HTMLElement
            if (maskEl) {
              maskEl.style.display = 'none'
              maskEl.style.pointerEvents = 'none'
            }
          })
          
          // Fix video container z-index
          const videoContainer = document.getElementById('video-player-container')
          if (videoContainer) {
            videoContainer.style.zIndex = '10'
            videoContainer.style.position = 'relative'
          }
          
          // Fix all video elements
          const fixVideoElements = () => {
            const videoElements = document.querySelectorAll('video')
            videoElements.forEach(video => {
              video.style.display = 'block'
              video.style.visibility = 'visible'
              video.style.opacity = '1'
              video.style.zIndex = '10'
              video.style.position = 'relative'
            })
            
            const iframes = document.querySelectorAll('iframe[src*="youtube"], iframe[id*="youtube"]')
            iframes.forEach(iframe => {
              const iframeEl = iframe as HTMLElement
              iframeEl.style.display = 'block'
              iframeEl.style.visibility = 'visible'
              iframeEl.style.opacity = '1'
              iframeEl.style.zIndex = '10'
              iframeEl.style.position = 'relative'
            })
            
            window.dispatchEvent(new Event('resize'))
          }
          
          setTimeout(fixVideoElements, 50)
          setTimeout(fixVideoElements, 200)
          setTimeout(fixVideoElements, 500)
        }}
        maskClosable={false}
        destroyOnClose={false}
        getContainer={() => document.body}
        maskStyle={{ zIndex: 999 }}
        style={{ zIndex: 1000 }}
        footer={[
          <Button key="back" onClick={() => setShowCompletionModal(false)}>
            Đóng
          </Button>,
          <Button 
            key="certificate" 
            type="default"
            icon={<FileTextOutlined />}
            onClick={() => {
              setShowCompletionModal(false)
              navigate('/profile?tab=certificates', { state: { courseId: lesson?.courseId } })
            }}
          >
            Xem chứng chỉ
          </Button>,
          <Button 
            key="course" 
            type="primary" 
            onClick={() => {
              setShowCompletionModal(false)
              navigate(`/courses/${lesson?.courseId}`)
            }}
          >
            Xem khóa học
          </Button>
        ]}
        width={600}
        centered
      >
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <div style={{ 
            fontSize: 80, 
            color: '#ffc53d', 
            marginBottom: 16,
            display: 'flex',
            justifyContent: 'center'
          }}>
            <TrophyOutlined />
          </div>
          <Title level={2} style={{ marginBottom: 16 }}>
            Chúc mừng bạn đã hoàn thành khóa học!
          </Title>
          <Text style={{ fontSize: 16, display: 'block', marginBottom: 24 }}>
            Bạn đã hoàn thành tất cả các bài học trong khóa học này. 
            Bạn có thể xem lại bất kỳ bài học nào hoặc tiếp tục với các khóa học khác.
          </Text>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '20px',
            borderRadius: '8px',
            color: '#fff',
            marginTop: 24
          }}>
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: 600 }}>
              🎓 Bạn đã nhận được chứng nhận hoàn thành khóa học!
            </Text>
          </div>
        </div>
      </Modal>
      <Sider width={360} theme='light' style={{ padding: 16, borderLeft: '1px solid #f0f0f0', overflowY: 'auto', height: '100%' }}>
        <Title level={4} style={{ marginBottom: 12 }}>Nội dung khóa học</Title>

        <List
          dataSource={sortedLessons}
          renderItem={(item, index) => {
            const isCurrentLesson = item.id === lesson.id
            const progress = lessonProgresses.get(item.id) || 0
            const isCompleted = progress >= 100
            const isInProgress = progress > 0 && progress < 100

            let buttonText = 'Xem'
            let buttonType: 'primary' | 'default' | 'dashed' = 'default'
            let buttonIcon = <RocketOutlined />
            let buttonStyle: CSSProperties = {}

            if (isCurrentLesson) {
              buttonText = 'Đang xem'
              buttonType = 'primary'
              buttonIcon = <PlayCircleOutlined />
              buttonStyle = {
                background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                border: 'none',
                boxShadow: '0 2px 8px rgba(24, 144, 255, 0.3)'
              }
            } else if (isCompleted) {
              buttonText = 'Đã xem'
              buttonType = 'dashed'
              buttonIcon = <CheckCircleOutlined />
              buttonStyle = {
                borderColor: '#52c41a',
                color: '#52c41a'
              }
            } else if (isInProgress) {
              buttonText = 'Tiếp tục xem'
              buttonType = 'default'
              buttonIcon = <PlayCircleOutlined />
            } else {
              buttonText = 'Xem'
              buttonType = 'default'
              buttonIcon = <RocketOutlined />
            }

            return (
              <List.Item
                key={item.id}
                style={{ 
                  background: isCurrentLesson ? '#e6f4ff' : isCompleted ? '#f6ffed' : undefined, 
                  borderRadius: 8, 
                  marginBottom: 8, 
                  padding: 8 
                }}
                actions={[
                  <Button 
                    size='small' 
                    type={buttonType}
                    icon={buttonIcon}
                    disabled={isCurrentLesson}
                    onClick={() => navigate(`/lesson/${item.id}`)}
                    style={buttonStyle}
                  >
                    {buttonText}
                  </Button>
                ]}
              >
                <List.Item.Meta
                  title={
                    <span>
                      {index + 1}. {item.title}
                      {isCompleted && (
                        <Tag color="success" icon={<CheckCircleOutlined />} style={{ marginLeft: 8 }}>
                          Hoàn thành
                        </Tag>
                      )}
                    </span>
                  }
                  description={
                    <Text type='secondary'>
                      {item.duration ? `${Math.floor((item.duration || 0) / 60)}:${String((item.duration || 0) % 60).padStart(2, '0')}` : ''}
                      {isInProgress && !isCurrentLesson && (
                        <span style={{ marginLeft: 8, color: '#1890ff' }}>
                          • {progress}% đã xem
                        </span>
                      )}
                    </Text>
                  }
                />
              </List.Item>
            )
          }}
        />
      </Sider>
    </Layout>
  )
}
