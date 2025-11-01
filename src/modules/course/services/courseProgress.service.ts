import env from '@/shared/core/constants/env'

export interface LessonProgressItem {
  lessonId: number
  order: number
  progress: number
  completedAt: string | null
}

export interface CourseProgressStats {
  totalLessons: number
  completedLessons: number
  inProgressLessons: number
  notStartedLessons: number
  completionPercentage: number
}

export const getCourseProgress = async (courseId: number, userId: number): Promise<LessonProgressItem[]> => {
  if (!userId) {
    return []
  }

  try {
    const res = await fetch(`${env.VITE_HOST_API}/progress/users/${userId}?courseId=${courseId}`)
    if (res.ok) {
      return await res.json()
    }
    return []
  } catch (error) {
    console.error('Error fetching course progress:', error)
    return []
  }
}

export const calculateCourseProgressStats = (
  progressItems: LessonProgressItem[],
  totalLessons: number
): CourseProgressStats => {
  const completedLessons = progressItems.filter((item) => item.progress >= 100).length
  const inProgressLessons = progressItems.filter((item) => item.progress > 0 && item.progress < 100).length
  const notStartedLessons = totalLessons - progressItems.length

  const completionPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

  return {
    totalLessons,
    completedLessons,
    inProgressLessons,
    notStartedLessons,
    completionPercentage
  }
}

