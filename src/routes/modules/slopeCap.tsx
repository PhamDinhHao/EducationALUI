import { lazyLoadModuleRoute, lazyLoadRoute } from '@/routes/LazyLoadRoutes'
import { ModuleName, PageName, PagePath } from '@/shared/core/enum/page.enum'

export const challengeCapRoute = [
  {
    path: PagePath.CHALLENGECAP,
    element: lazyLoadRoute('Base'),
    children: [
      {
        path: PagePath.CHALLENGECAP,
        element: (
          <>
            {lazyLoadModuleRoute(ModuleName.CHALLENGECAP, PageName.CHALLENGECAP)}
          </>
        )
      },
    ]
  }
]
