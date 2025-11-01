import React, { useEffect, useState } from 'react'
import { Card, Progress, Typography } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'
import { useBoundStore } from '@/shared/stores'
import { getCourseProgress, calculateCourseProgressStats, CourseProgressStats } from '@/modules/course/services/courseProgress.service'

const { Title, Text } = Typography

export interface CourseProgressCardProps {
  courseId: number
  totalLessons: number
  showDetails?: boolean
}

const CourseProgressCard: React.FC<CourseProgressCardProps> = ({ courseId, totalLessons, showDetails = true }) => {
  const user = useBoundStore((state) => state.user)
  const [stats, setStats] = useState<CourseProgressStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user?.id) {
        setLoading(false)
        return
      }

      setLoading(true)
      const progressItems = await getCourseProgress(courseId, user.id)
      const calculatedStats = calculateCourseProgressStats(progressItems, totalLessons)
      setStats(calculatedStats)
      setLoading(false)
    }

    if (courseId && totalLessons > 0) {
      fetchProgress()
    } else {
      setLoading(false)
    }
  }, [courseId, totalLessons, user?.id])

  if (loading) {
    return (
      <Card style={{ marginBottom: 16 }}>
        <Text type="secondary">Đang tải tiến độ...</Text>
      </Card>
    )
  }

  if (!stats) {
    return null
  }

  return (
    <Card
      style={{
        marginBottom: 16,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        border: 'none'
      }}
      bodyStyle={{ padding: 16 }}
    >
      <div style={{ color: '#fff' }}>
        <Title level={5} style={{ color: '#fff', marginBottom: 8 }}>
          Tiến độ khóa học
        </Title>
        <div style={{ marginBottom: 12 }}>
          <Progress
            percent={stats.completionPercentage}
            strokeColor="#fff"
            trailColor="rgba(255, 255, 255, 0.3)"
            showInfo={true}
            format={(percent) => `${percent}%`}
          />
        </div>
        {showDetails && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <Text style={{ color: '#fff', fontSize: 14 }}>
              <CheckCircleOutlined style={{ marginRight: 4 }} />
              {stats.completedLessons}/{stats.totalLessons} bài học đã hoàn thành
            </Text>
            {stats.inProgressLessons > 0 && (
              <Text style={{ color: '#fff', fontSize: 12, opacity: 0.9 }}>
                {stats.inProgressLessons} bài đang học
              </Text>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}

export default CourseProgressCard

