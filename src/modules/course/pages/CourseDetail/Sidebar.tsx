import images from '@/assets/images'
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
}

export default function Sidebar({ isLesson = false, course, onJoin }: CourseSidebarProps) {
    return (
        <div className='sticky top-6 flex flex-col justify-center items-center gap-4'>
            <Image
                preview={{
                    destroyOnHidden: true,
                    imageRender: () => (
                        <video
                            muted
                            width="60%"
                            controls
                            src={course?.url}
                        />
                    ),
                    toolbarRender: () => null,
                }}
                src={course?.img}
                fallback={images.imgeNotFond}
            />
            <Button className='lg:!w-[400px]' disabled={!isLesson} type='primary' size='large' block onClick={onJoin}>{isLesson ? 'Tham gia' : 'Không có bài học'}</Button>
        </div>
    )
}