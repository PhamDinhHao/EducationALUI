import { lazyLoadModuleRoute } from '@/routes/LazyLoadRoutes'
import { ModuleName, PageName, PagePath } from '@/shared/core/enum/page.enum'
export const aiRoute = [
  {
    path: PagePath.AI,
    element: lazyLoadModuleRoute(ModuleName.AI, PageName.AI),
    children: [
      {
        path: PagePath.AI,
        element: (
          <>
            {/* <Suspense fallback={<Spin size="large" />}> */}
              {lazyLoadModuleRoute(ModuleName.AI, PageName.AI)}
            {/* </Suspense> */}
            
          </>
        )
      },
      {
        path: PagePath.ASSISTANTAI,
        element: lazyLoadModuleRoute(ModuleName.ASSISTANTAI, PageName.ASSISTANTAI),
      },
    ]
  }
]