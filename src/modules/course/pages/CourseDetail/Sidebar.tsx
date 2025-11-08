import images from '@/assets/images'
import { VideoPlayer } from '@/shared/components/VideoPlayer'
import { Button, Image } from 'antd'

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
}

export default function Sidebar({ isLesson = false, course, onJoin, isEnrolled = false, loading = false }: CourseSidebarProps) {
    const getButtonText = () => {
        if (!isLesson) return 'Không có bài học'
        if (isEnrolled) return 'Tiếp tục khóa học'
        return 'Tham gia'
    }

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
                type='primary' 
                size='large' 
                block 
                onClick={onJoin}
                loading={loading}
            >
                {getButtonText()}
            </Button>
        </div>
    )
}