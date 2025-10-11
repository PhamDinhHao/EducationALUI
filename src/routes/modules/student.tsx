import { lazyLoadRoute } from '@/routes/LazyLoadRoutes'
import { PagePath } from '@/shared/core/enum/page.enum'
import { lazy } from 'react'

const ReviewPage = lazy(() => import('@/modules/student/pages/review'))
const ExercisePage = lazy(() => import('@/modules/student/pages/exercise'))
const MindmapPage = lazy(() => import('@/modules/student/pages/mindmap'))
const StudyPlanPage = lazy(() => import('@/modules/student/pages/studyPlan'))

export const studentRoute = [
  // Giải bài tập
  {
    path: PagePath.STUDENT_EXERCISE,
    element: lazyLoadRoute('Base'),
    children: [
      {
        path: PagePath.STUDENT_EXERCISE,
        element: <ExercisePage />
      }
    ]
  },
  // Ôn tập
  {
    path: PagePath.STUDENT_REVIEW,
    element: lazyLoadRoute('Base'),
    children: [
      {
        path: PagePath.STUDENT_REVIEW,
        element: <ReviewPage />
      }
    ]
  },
  // Mindmap
  {
    path: PagePath.STUDENT_MINDMAP,
    element: lazyLoadRoute('Base'),
    children: [
      {
        path: PagePath.STUDENT_MINDMAP,
        element: <MindmapPage />
      }
    ]
  },
  // Lập kế hoạch học tập
  {
    path: PagePath.STUDENT_PLAN,
    element: lazyLoadRoute('Base'),
    children: [
      {
        path: PagePath.STUDENT_PLAN,
        element: <StudyPlanPage />
      }
    ]
  }
]
