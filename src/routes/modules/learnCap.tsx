import { lazyLoadRoute } from '@/routes/LazyLoadRoutes'
import { PagePath } from '@/shared/core/enum/page.enum'
import CourseList from '@/modules/Course/pages/CourseList/CourseList'
import CourseDetail from '@/modules/Course/pages/CourseDetail';
import LessonPlayerPage from '@/modules/Course/pages/LessonPlayerPage/LessonPlayerPage'
export const learnCapRoute = [
  {
    path: PagePath.LEARNCAP,
    element: lazyLoadRoute('Base'),
    children: [
       // Khi truy cập /learncap thì render CourseList
      {
        index: true,
        element: <CourseList />
      },
      
      {
        path: 'courses/:id',
        element: <CourseDetail />
      },
       {
        path: 'lesson/:id', // <-- thêm route LessonPlayerPage
        element: <LessonPlayerPage />
      },
    ]
  },
]
