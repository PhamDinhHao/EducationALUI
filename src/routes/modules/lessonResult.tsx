import { lazyLoadModuleRoute, lazyLoadRoute } from '@/routes/LazyLoadRoutes'
import { ModuleName, PageName, PagePath } from '@/shared/core/enum/page.enum'

export const lessonResultRoute = [
  {
    path: PagePath.LESSON_RESULT,
    element: lazyLoadRoute('Base'),
    children: [
      {
        path: PagePath.LESSON_RESULT,
        element: (
          <>
            {/* <Suspense fallback={<Spin size="large" />}> */}
            {lazyLoadModuleRoute(ModuleName.LESSON_RESULT, PageName.LESSON_RESULT)}
            {/* </Suspense> */}
          </>
        )
      }
    ]
  }
]
