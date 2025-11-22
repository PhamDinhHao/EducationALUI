import { ApiService } from '@/shared/services'

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

export const getCourseProgress = async (courseId: number): Promise<LessonProgressItem[]> => {
  try {
    const res = await ApiService.get('progress/me', { courseId })
    const progressItems = Array.isArray(res.data) ? res.data : (res.data?.data || res.data || [])
    console.log('Progress API response:', { courseId, progressItems, rawResponse: res.data })
    return progressItems
  } catch (error) {
    console.error('Error fetching course progress:', error)
    return []
  }
}

export const getLessonProgress = async (lessonId: number): Promise<{ progress: number; completedAt: string | null } | null> => {
  try {
    const res = await ApiService.get(`progress/me/lessons/${lessonId}`)
    return res.data?.data || res.data || null
  } catch (error) {
    console.error('Error fetching lesson progress:', error)
    return null
  }
}

export const updateLessonProgress = async (lessonId: number, progress: number, completedAt?: Date | null) => {
  try {
    const res = await ApiService.put('progress', {
      lessonId,
      progress,
      completedAt: completedAt ? completedAt.toISOString() : null
    })
    return res.data?.data || res.data
  } catch (error) {
    console.error('Error updating lesson progress:', error)
    throw error
  }
}

export const updateLessonProgressIfHigher = async (lessonId: number, newProgress: number, completedAt?: Date | null) => {
  try {
    const currentProgress = await getLessonProgress(lessonId)
    const currentProgressValue = currentProgress?.progress || 0

    if (newProgress > currentProgressValue) {
      return await updateLessonProgress(lessonId, newProgress, completedAt)
    }

    if (currentProgressValue >= 100 && newProgress >= 100) {
      return currentProgress
    }

    return currentProgress
  } catch (error) {
    console.error('Error updating lesson progress:', error)
    throw error
  }
}

export const calculateCourseProgressStats = (
  progressItems: LessonProgressItem[],
  totalLessons: number
): CourseProgressStats => {
  console.log('Calculating progress stats:', { progressItems, totalLessons })

  const completedLessons = progressItems.filter((item) => item.progress >= 100).length
  const inProgressLessons = progressItems.filter((item) => item.progress > 0 && item.progress < 100).length
  const notStartedLessons = totalLessons - completedLessons - inProgressLessons

  const totalProgress = progressItems.reduce((sum, item) => sum + (item.progress || 0), 0)
  const completionPercentage = totalLessons > 0 ? Math.round(totalProgress / totalLessons) : 0

  const stats = {
    totalLessons,
    completedLessons,
    inProgressLessons,
    notStartedLessons,
    completionPercentage
  }

  return stats
}

