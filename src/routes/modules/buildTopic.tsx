import { lazyLoadModuleRoute, lazyLoadRoute } from '@/routes/LazyLoadRoutes'
import { ModuleName, PageName, PagePath } from '@/shared/core/enum/page.enum'

export const buildTopicRoute = [
  {
    path: PagePath.BUILD_TOPIC,
    element: lazyLoadRoute('Base'),
    children: [
      {
        path: PagePath.BUILD_TOPIC,
        element: (
          <>
            {/* <Suspense fallback={<Spin size="large" />}> */}
              {lazyLoadModuleRoute(ModuleName.BUILD_TOPIC, PageName.BUILD_TOPIC)},
            {/* </Suspense> */}
            
        
            
          </>
        )
      },
    ]
  }
]
