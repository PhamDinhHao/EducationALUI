import { lazyLoadModuleRoute, lazyLoadRoute } from '@/routes/LazyLoadRoutes'
import { ModuleName, PageName, PagePath } from '@/shared/core/enum/page.enum'

export const assistantAiRoute = [
  {
    path: PagePath.ASSISTANTAI,
    element: lazyLoadRoute('Base'),
    children: [
      {
        path: PagePath.ASSISTANTAI,
        element: (
          <>
            {/* <Suspense fallback={<Spin size="large" />}> */}
            {lazyLoadModuleRoute(ModuleName.ASSISTANTAI, PageName.ASSISTANTAI)}
            {/* </Suspense> */}
          </>
        )
      }
    ]
  }
]
