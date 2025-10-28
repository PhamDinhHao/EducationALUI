import { lazyLoadModuleRoute, lazyLoadRoute } from '@/routes/LazyLoadRoutes'
import { ModuleName, PageName, PagePath } from '@/shared/core/enum/page.enum'

export const promptLessonRoute = [
  {
    path: PagePath.PROMPT_LESSON,
    element: lazyLoadRoute('Base'),
    children: [
      {
        path: PagePath.PROMPT_LESSON,
        element: (
          <>
            {/* <Suspense fallback={<Spin size="large" />}> */}
            {lazyLoadModuleRoute(ModuleName.PROMPT_LESSON, PageName.PROMPT_LESSON)}
            {/* </Suspense> */}
          </>
        )
      }
    ]
  }
]