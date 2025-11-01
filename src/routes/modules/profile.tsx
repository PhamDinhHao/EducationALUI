import { lazyLoadModuleRoute, lazyLoadRoute } from '@/routes/LazyLoadRoutes'
import { ModuleName, PageName, PagePath } from '@/shared/core/enum/page.enum'

export const profileRoute = [
  {
    path: PagePath.PROFILE,
    element: lazyLoadRoute('Base'),
    children: [
      {
        index: true,
        element: lazyLoadModuleRoute(ModuleName.PROFILE, PageName.PROFILE)
      }
    ]
  },
  {
    path: PagePath.MY_COURSES,
    element: lazyLoadRoute('Base'),
    children: [
      {
        index: true,
        element: lazyLoadModuleRoute(ModuleName.PROFILE, PageName.MY_COURSES)
      }
    ]
  }
]

