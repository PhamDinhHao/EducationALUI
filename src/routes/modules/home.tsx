import { lazyLoadModuleRoute, lazyLoadRoute } from '@/routes/LazyLoadRoutes'
import { ModuleName, PageName, PagePath } from '@/shared/core/enum/page.enum'

export const homeRoute = [
  {
    path: PagePath.HOME,
    element: lazyLoadRoute('Base'),
    children: [
      {
        path: PagePath.HOME,
        element: (
          <>
            {/* <Suspense fallback={<Spin size="large" />}> */}
              {lazyLoadModuleRoute(ModuleName.HOME, PageName.HOME)}
            {/* </Suspense> */}
          </>
        )
      }
    ]
  }
]
