import { lazyLoadModuleRoute, lazyLoadRoute } from '@/routes/LazyLoadRoutes'
import { ModuleName, PageName, PagePath } from '@/shared/core/enum/page.enum'

export const growCapRoute = [
  {
    path: PagePath.GROWCAP,
    element: lazyLoadRoute('Base'),
    children: [
      {
        path: PagePath.GROWCAP,
        element: lazyLoadModuleRoute(ModuleName.GROWCAP, PageName.GROWCAP)
      }
    ]
  }
]
