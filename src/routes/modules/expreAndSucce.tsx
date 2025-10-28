import { lazyLoadModuleRoute, lazyLoadRoute } from '@/routes/LazyLoadRoutes'
import { ModuleName, PageName, PagePath } from '@/shared/core/enum/page.enum'

export const expreAndSucceRoute = [
  {
    path: PagePath.EXPREANDSUCCE,
    element: lazyLoadRoute('Base'),
    children: [
      {
        path: PagePath.EXPREANDSUCCE,
        element: (
          <>
            {lazyLoadModuleRoute(ModuleName.EXPREANDSUCCE, PageName.EXPREANDSUCCE)}
          </>
        )
      },
    ]
  }
]