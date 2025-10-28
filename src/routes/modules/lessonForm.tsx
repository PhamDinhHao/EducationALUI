import { lazyLoadModuleRoute, lazyLoadRoute } from '@/routes/LazyLoadRoutes'
import { ModuleName, PageName, PagePath } from '@/shared/core/enum/page.enum'

export const lessonFormRoute = [
  {
    path: PagePath.LESSON_FORM,
    element: lazyLoadRoute('Base'),
    children: [
      {
        path: PagePath.LESSON_FORM,
        element: (
          <>
            {/* <Suspense fallback={<Spin size="large" />}> */}
            {lazyLoadModuleRoute(ModuleName.LESSON_FORM, PageName.LESSON_FORM)}
            {/* </Suspense> */}
          </>
        )
      }
    ]
  }
]