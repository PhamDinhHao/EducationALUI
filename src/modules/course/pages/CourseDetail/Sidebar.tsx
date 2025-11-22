import { useEffect, useState } from 'react'
import images from '@/assets/images'
import { VideoPlayer } from '@/shared/components/VideoPlayer'
import { Button, Image } from 'antd'
import { PlayCircleOutlined, CheckCircleOutlined, RocketOutlined } from '@ant-design/icons'
import { getCourseProgress, calculateCourseProgressStats, CourseProgressStats } from '@/modules/course/services/courseProgress.service'
import { useBoundStore } from '@/shared/stores'

export type CourseSidebarProps = {
    isLesson: boolean
    course: {
        id: number
        title: string
        description: string
        img?: string
        url?: string
    }
    onJoin?: () => void
    isEnrolled?: boolean
    loading?: boolean
    totalLessons?: number
}

export default function Sidebar({ isLesson = false, course, onJoin, isEnrolled = false, loading = false, totalLessons = 0 }: CourseSidebarProps) {
    const user = useBoundStore((state) => state.user)
    const [stats, setStats] = useState<CourseProgressStats | null>(null)

    useEffect(() => {
        const fetchProgress = async () => {
            if (!course.id || !totalLessons || !user?.id || !isEnrolled) {
                setStats(null)
                return
            }

            try {
                const progressItems = await getCourseProgress(course.id)
                const calculatedStats = calculateCourseProgressStats(progressItems, totalLessons)
                setStats(calculatedStats)
            } catch (error) {
                console.error('Error loading course progress:', error)
                setStats(null)
            }
        }

        fetchProgress()
    }, [course.id, totalLessons, user?.id, isEnrolled])

    useEffect(() => {
        if (!user?.id || !course.id || !totalLessons || !isEnrolled) return

        const handleProgressUpdate = (event: CustomEvent) => {
            if (event.detail?.courseId === course.id) {
                fetchProgress()
            }
        }

        const fetchProgress = async () => {
            try {
                const progressItems = await getCourseProgress(course.id)
                const calculatedStats = calculateCourseProgressStats(progressItems, totalLessons)
                setStats(calculatedStats)
            } catch (error) {
                console.error('Error loading course progress:', error)
            }
        }

        window.addEventListener('lessonProgressUpdated', handleProgressUpdate as EventListener)
        
        return () => {
            window.removeEventListener('lessonProgressUpdated', handleProgressUpdate as EventListener)
        }
    }, [user?.id, course.id, totalLessons, isEnrolled])

    const getButtonConfig = () => {
        if (!isLesson) {
            return {
                text: 'Không có bài học',
                icon: null,
                type: 'default' as const,
                style: {}
            }
        }

        if (!isEnrolled) {
            return {
                text: 'Tham gia khóa học',
                icon: <RocketOutlined />,
                type: 'primary' as const,
                style: {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                    height: '48px',
                    fontSize: '16px',
                    fontWeight: 600
                }
            }
        }

        const isCompleted = stats?.completionPercentage === 100
        const hasProgress = stats && stats.completionPercentage > 0

        if (isCompleted) {
            return {
                text: 'Xem lại khóa học',
                icon: <CheckCircleOutlined />,
                type: 'default' as const,
                style: {
                    background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
                    border: 'none',
                    color: '#fff',
                    boxShadow: '0 4px 15px rgba(82, 196, 26, 0.3)',
                    height: '48px',
                    fontSize: '16px',
                    fontWeight: 600
                }
            }
        }

        if (hasProgress) {
            return {
                text: 'Tiếp tục khóa học',
                icon: <PlayCircleOutlined />,
                type: 'primary' as const,
                style: {
                    background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                    border: 'none',
                    boxShadow: '0 4px 15px rgba(24, 144, 255, 0.4)',
                    height: '48px',
                    fontSize: '16px',
                    fontWeight: 600
                }
            }
        }

        return {
            text: 'Bắt đầu khóa học',
            icon: <PlayCircleOutlined />,
            type: 'primary' as const,
            style: {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                height: '48px',
                fontSize: '16px',
                fontWeight: 600
            }
        }
    }

    const buttonConfig = getButtonConfig()

    const hasVideo = course?.url && course.url.trim() !== ''
    const hasImage = course?.img && course.img.trim() !== ''

    return (
        <div className='sticky top-6 flex flex-col justify-center items-center gap-4 w-full max-w-[400px]'>
            {hasImage ? (
                <div className='w-full' style={{ aspectRatio: '16/9', borderRadius: '8px', overflow: 'hidden' }}>
                    <Image
                        src={course.img}
                        fallback={images.imgeNotFond}
                        alt={course.title}
                        className='w-full h-full'
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                        preview={{
                            mask: hasVideo ? 'Xem video' : 'Xem ảnh',
                            destroyOnHidden: true,
                            imageRender: hasVideo ? () => (
                                <div style={{ width: '100%', maxWidth: '40vw', aspectRatio: '16/9' }}>
                                    <VideoPlayer
                                        src={course.url || ''}
                                        title={course.title || ''}
                                        aspectRatio="16/9"
                                        className="w-full"
                                    />
                                </div>
                            ) : undefined,
                            toolbarRender: () => null,
                        }}
                    />
                </div>
            ) : (
                <div 
                    className='w-full bg-gray-200 flex items-center justify-center rounded-lg'
                    style={{ 
                        aspectRatio: '16/9',
                        minHeight: '200px'
                    }}
                >
                    <span className='text-gray-400'>Không có ảnh/video</span>
                </div>
            )}
            <Button 
                className='lg:!w-[400px] w-full' 
                disabled={!isLesson} 
                type={buttonConfig.type}
                size='large' 
                block 
                onClick={onJoin}
                loading={loading}
                icon={buttonConfig.icon}
                style={buttonConfig.style}
            >
                {buttonConfig.text}
            </Button>
        </div>
    )
}