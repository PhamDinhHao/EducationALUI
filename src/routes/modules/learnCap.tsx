import { lazyLoadModuleRoute, lazyLoadRoute } from '@/routes/LazyLoadRoutes'
import { ModuleName, PageName, PagePath } from '@/shared/core/enum/page.enum'

export const learnCapRoute = [
  {
    path: PagePath.LEARNCAP,
    element: lazyLoadRoute('Base'),
    children: [
      {
        path: PagePath.LEARNCAP,
        element: (
          <>
            {lazyLoadModuleRoute(ModuleName.LEARNCAP, PageName.LEARNCAP)}
          </>
        )
      }
    ]
  },
]
