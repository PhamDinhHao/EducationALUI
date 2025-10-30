import { Button, Image } from 'antd'

export type CourseSidebarProps = {
    course: {
        id: number
        title: string
        description: string
        img?: string
    }
    onJoin?: () => void
}

export default function Sidebar({ course, onJoin }: CourseSidebarProps) {
    return (
        <div style={{ position: 'sticky', top: 24 }}>
            <Image
                src={course?.img}
                fallback="https://via.placeholder.com/600x400?text=Course"
                style={{ width: '100%', borderRadius: 8, marginBottom: 16, objectFit: 'cover' }}
              />
            <Button type='primary' size='large' block onClick={onJoin}>Tham gia</Button>
        </div>
    )
}