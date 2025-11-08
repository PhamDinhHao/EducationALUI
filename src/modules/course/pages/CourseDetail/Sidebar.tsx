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

    return (
        <div className='sticky top-6 flex flex-col justify-center items-center gap-4'>
            <Image
                preview={{
                    destroyOnHidden: true,
                    imageRender: () => (
                        <VideoPlayer
                            src={course?.url || ''}
                            title={course?.title || ''}
                            aspectRatio="16/9"
                        />

                    ),
                    toolbarRender: () => null,
                }}
                src={course?.img}
                fallback={images.imgeNotFond}
            />
            <Button 
                className='lg:!w-[400px]' 
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