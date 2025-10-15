import { lazyLoadModuleRoute } from '@/routes/LazyLoadRoutes.tsx'
import { ModuleName, PageName, PagePath } from '@/shared/core/enum/page.enum'

const coursePageRoute = [
  {
    children: [
      {
        path: PagePath.COURSE_DETAIL,
        element: lazyLoadModuleRoute(ModuleName.COURSE, PageName.COURSE_DETAIL)
      },
      {
        path: PagePath.LESSON_DETAIL,
        element: lazyLoadModuleRoute(ModuleName.COURSE, PageName.LESSON_PLAYER)
      }
    ]
  }
]

export default coursePageRoute
