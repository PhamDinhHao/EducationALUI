import { lazyLoadModuleRoute, lazyLoadRoute } from '@/routes/LazyLoadRoutes'
import { ModuleName, PageName, PagePath } from '@/shared/core/enum/page.enum'

export const buildLessonRoute = [
  {
    path: PagePath.BUILD_LESSON,
    element: lazyLoadRoute('Base'),
    children: [
      {
        path: PagePath.BUILD_LESSON,
        element: (
          <>
            {/* <Suspense fallback={<Spin size="large" />}> */}
              {lazyLoadModuleRoute(ModuleName.BUILD_LESSON, PageName.BUILD_LESSON)}
            {/* </Suspense> */}
          </>
        )
      }
    ]
  }
]
