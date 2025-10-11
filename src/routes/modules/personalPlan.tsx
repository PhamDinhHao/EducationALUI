import { lazyLoadModuleRoute, lazyLoadRoute } from '@/routes/LazyLoadRoutes'
import { ModuleName, PageName, PagePath } from '@/shared/core/enum/page.enum'

export const personalPlanRoute = [
  {
    path: PagePath.PERSONAL_PLAN,
    element: lazyLoadRoute('Base'),
    children: [
      {
        path: PagePath.PERSONAL_PLAN,
        element: (
          <>
            {/* <Suspense fallback={<Spin size="large" />}> */}
              {lazyLoadModuleRoute(ModuleName.PERSONAL_PLAN, PageName.PERSONAL_PLAN)}
            {/* </Suspense> */}
          </>
        )
      }
    ]
  }
]
