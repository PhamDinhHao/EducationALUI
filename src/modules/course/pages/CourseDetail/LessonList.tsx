import { Collapse, Typography, Space, Button } from 'antd'

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
  const lastViewedLessonId = currentLessonId || (courseId ? Number(localStorage.getItem(`course:${courseId}:lastLessonId`)) : undefined)
  
  const groups = [{ name: 'Nội dung khóa học', items: [...lessons].sort((a, b) => (a.order || 0) - (b.order || 0)) }]
  return (
    <Collapse defaultActiveKey={['0']} accordion>
      {groups.map((g, idx) => (
        <Panel header={<span><Text strong>{g.name}</Text> <Text type='secondary' style={{ marginLeft: 8 }}>{g.items.length} bài học</Text></span>} key={idx}>
          <Space direction='vertical' style={{ width: '100%' }} size={8}>
            {g.items.map((l, i) => {
              const isLastViewed = lastViewedLessonId === l.id
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
                    {isLastViewed && <Text type='secondary' style={{ fontSize: 12 }}>(Đã xem)</Text>}
                  </Space>
                  <Space>
                    {l.duration ? <Text type='secondary'>{Math.floor(l.duration / 60)}:{String(l.duration % 60).padStart(2, '0')}</Text> : null}
                    <Button 
                      size='small' 
                      type={isLastViewed ? 'primary' : 'default'}
                      onClick={() => onOpenLesson?.(l.id)}
                    >
                      {isLastViewed ? 'Tiếp tục' : 'Bắt đầu học'}
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
