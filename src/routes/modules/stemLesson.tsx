import { lazyLoadModuleRoute, lazyLoadRoute } from '@/routes/LazyLoadRoutes'
import { ModuleName, PageName, PagePath } from '@/shared/core/enum/page.enum'

export const stemLessonRoute = [
  {
    path: PagePath.STEM_LESSON,
    element: lazyLoadRoute('Base'),
    children: [
      {
        path: PagePath.STEM_LESSON,
        element: (
          <>
            {/* <Suspense fallback={<Spin size="large" />}> */}
              {lazyLoadModuleRoute(ModuleName.STEM_LESSON, PageName.STEM_LESSON)}
            {/* </Suspense> */}
          </>
        )
      }
    ]
  }
]
