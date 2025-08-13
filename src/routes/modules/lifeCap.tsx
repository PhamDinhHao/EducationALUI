import { lazyLoadModuleRoute, lazyLoadRoute } from '@/routes/LazyLoadRoutes'
import { ModuleName, PageName, PagePath } from '@/shared/core/enum/page.enum'

export const lifeCapRoute = [
  {
    path: PagePath.LIFECAP,
    element: lazyLoadRoute('Base'),
    children: [
      {
        path: PagePath.LIFECAP,
        element: (
          <>
            {lazyLoadModuleRoute(ModuleName.LIFECAP, PageName.LIFECAP)}
          </>
        )
      },

    ]
  },
]
