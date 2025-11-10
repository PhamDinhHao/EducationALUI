import { lazyLoadModuleRoute, lazyLoadRoute } from '@/routes/LazyLoadRoutes'
import { ModuleName, PageName, PagePath } from '@/shared/core/enum/page.enum'

export const successionPlanRoute = [
  {
    path: PagePath.SUCCESSIONPLAN,
    element: lazyLoadRoute('Base'),
    children: [
      {
        path: PagePath.SUCCESSIONPLAN,
        element: <>{lazyLoadModuleRoute(ModuleName.SUCCESSIONPLAN, PageName.SUCCESSIONPLAN)}</>
      }
    ]
  }
]
