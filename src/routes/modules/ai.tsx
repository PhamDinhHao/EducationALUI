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
      // Route cho /ai/build-topic
      {
        path: PagePath.BUILD_TOPIC,
        element: lazyLoadModuleRoute(ModuleName.BUILD_TOPIC, PageName.BUILD_TOPIC),
      },
      // Route cho /ai/build-lesson
      {
        path: PagePath.BUILD_LESSON,
        element: lazyLoadModuleRoute(ModuleName.BUILD_LESSON, PageName.BUILD_LESSON)
      },
      {
        path: PagePath.PERSONAL_PLAN,
        element: lazyLoadModuleRoute(ModuleName.PERSONAL_PLAN, PageName.PERSONAL_PLAN)
      },
      {
        path: PagePath.TEACHER_ASSISTANT,
        element: lazyLoadModuleRoute(ModuleName.TEACHER_ASSISTANT, PageName.TEACHER_ASSISTANT)
      },
      {
        path: PagePath.BUILD_STRUCTURE,
        element: lazyLoadModuleRoute(ModuleName.BUILD_STRUCTURE, PageName.BUILD_STRUCTURE)
      },
      {
        path: PagePath.EXAM_PREVIEW,
        element: lazyLoadModuleRoute(ModuleName.EXAM_PREVIEW, PageName.EXAM_PREVIEW)
      }
    ]
  }
]
