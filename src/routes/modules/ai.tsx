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
        path: PagePath.SUCCESSIONPLAN,
        element: lazyLoadModuleRoute(ModuleName.SUCCESSIONPLAN, PageName.SUCCESSIONPLAN),
      },
      {
        path: PagePath.EXPERIENCEINITIATIVE,
        element: lazyLoadModuleRoute(ModuleName.EXPERIENCEINITIATIVE, PageName.EXPERIENCEINITIATIVE),
      },
      {
        path: PagePath.EXPREANDSUCCE,
        element: lazyLoadModuleRoute(ModuleName.EXPREANDSUCCE, PageName.EXPREANDSUCCE),
      },
      {
        path: PagePath.PLANRESULT,
        element: lazyLoadModuleRoute(ModuleName.PLANRESULT, PageName.PLANRESULT),
      },
      {
        path: PagePath.INITIATIVERESULT,
        element: lazyLoadModuleRoute(ModuleName.INITIATIVERESULT, PageName.INITIATIVERESULT),
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
      // Route cho /ai/build-topic
      {
        path: PagePath.BUILD_TOPIC,
        element: lazyLoadModuleRoute(ModuleName.BUILD_TOPIC, PageName.BUILD_TOPIC),
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