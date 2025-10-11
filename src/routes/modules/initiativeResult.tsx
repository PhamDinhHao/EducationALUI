import { lazyLoadModuleRoute, lazyLoadRoute } from '@/routes/LazyLoadRoutes'
import { ModuleName, PageName, PagePath } from '@/shared/core/enum/page.enum'

export const initiativeResultRoute = [
  {
    path: PagePath.INITIATIVERESULT,
    element: lazyLoadRoute('Base'),
    children: [
      {
        path: PagePath.INITIATIVERESULT,
        element: lazyLoadModuleRoute(ModuleName.INITIATIVERESULT, PageName.INITIATIVERESULT)
      }
    ]
  }
]
