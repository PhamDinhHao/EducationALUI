import { lazyLoadModuleRoute, lazyLoadRoute } from '@/routes/LazyLoadRoutes'
import { ModuleName, PageName, PagePath } from '@/shared/core/enum/page.enum'

export const buildStructureRoute = [
  {
    path: PagePath.BUILD_STRUCTURE,
    element: lazyLoadRoute('Base'),
    children: [
      {
        path: PagePath.BUILD_STRUCTURE,
        element: (
          <>
            {/* <Suspense fallback={<Spin size="large" />}> */}
              {lazyLoadModuleRoute(ModuleName.BUILD_STRUCTURE, PageName.BUILD_STRUCTURE)}
            {/* </Suspense> */}
          </>
        )
      }
    ]
  }
]
