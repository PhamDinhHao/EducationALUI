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
        path: PagePath.BUILD_LESSON,
        element: lazyLoadModuleRoute(ModuleName.BUILD_LESSON, PageName.BUILD_LESSON),
      },
      {
        path: PagePath.LESSON_FORM,
        element: lazyLoadModuleRoute(ModuleName.LESSON_FORM, PageName.LESSON_FORM),
      },
      {
        path: PagePath.LESSON_RESULT,
        element: lazyLoadModuleRoute(ModuleName.LESSON_RESULT, PageName.LESSON_RESULT),
      },
      {
        path: PagePath.PROMPT_LESSON,
        element: lazyLoadModuleRoute(ModuleName.PROMPT_LESSON, PageName.PROMPT_LESSON),
      },
      {
        path: PagePath.STEM_LESSON,
        element: lazyLoadModuleRoute(ModuleName.STEM_LESSON, PageName.STEM_LESSON),
      },
    ]
  }
]
