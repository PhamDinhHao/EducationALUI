import { lazyLoadModuleRoute, lazyLoadRoute } from '@/routes/LazyLoadRoutes'
import { ModuleName, PageName, PagePath } from '@/shared/core/enum/page.enum'

export const planResultRoute = [
  {
    path: PagePath.PLANRESULT,
    element: lazyLoadRoute('Base'),
    children: [
      {
        path: PagePath.PLANRESULT,
        element: (
          <>
            {lazyLoadModuleRoute(ModuleName.PLANRESULT, PageName.PLANRESULT)}
          </>
        )
      },
    ]
  }
]
