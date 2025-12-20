import { Navigate } from 'react-router-dom'
import { lazyLoadModuleRoute } from '@/routes/LazyLoadRoutes'
import { ModuleName, PageName } from '@/shared/core/enum/page.enum'
export const aiRoute = {
  element: lazyLoadModuleRoute(ModuleName.AI, PageName.AI),
  children: [
    {
      index: true,
      element: <Navigate to="build-structure" replace />
    },
    {
      path: 'succession-plan',
      element: lazyLoadModuleRoute(ModuleName.SUCCESSIONPLAN, PageName.SUCCESSIONPLAN),
    },
    {
      path: 'experience-initiative',
      element: lazyLoadModuleRoute(ModuleName.EXPERIENCEINITIATIVE, PageName.EXPERIENCEINITIATIVE),
    },
    {
      path: 'expre-and-succe',
      element: lazyLoadModuleRoute(ModuleName.EXPREANDSUCCE, PageName.EXPREANDSUCCE),
    },
    {
      path: 'plan-result',
      element: lazyLoadModuleRoute(ModuleName.PLANRESULT, PageName.PLANRESULT),
    },
    {
      path: 'initiative-result',
      element: lazyLoadModuleRoute(ModuleName.INITIATIVERESULT, PageName.INITIATIVERESULT),
    },
    {
      path: 'build-lesson',
      element: lazyLoadModuleRoute(ModuleName.BUILD_LESSON, PageName.BUILD_LESSON),
    },
    {
      path: 'lesson-form',
      element: lazyLoadModuleRoute(ModuleName.LESSON_FORM, PageName.LESSON_FORM),
    },
    {
      path: 'lesson-result',
      element: lazyLoadModuleRoute(ModuleName.LESSON_RESULT, PageName.LESSON_RESULT),
    },
    {
      path: 'prompt-lesson',
      element: lazyLoadModuleRoute(ModuleName.PROMPT_LESSON, PageName.PROMPT_LESSON),
    },
    {
      path: 'stem-lesson',
      element: lazyLoadModuleRoute(ModuleName.STEM_LESSON, PageName.STEM_LESSON),
    },
    {
      path: 'build-topic',
      element: lazyLoadModuleRoute(ModuleName.BUILD_TOPIC, PageName.BUILD_TOPIC),
    },
    {
      path: 'personal-plan',
      element: lazyLoadModuleRoute(ModuleName.PERSONAL_PLAN, PageName.PERSONAL_PLAN)
    },
    {
      path: 'assistant-ai',
      element: lazyLoadModuleRoute(ModuleName.ASSISTANTAI, PageName.ASSISTANTAI)
    },
    {
      path: 'build-structure',
      element: lazyLoadModuleRoute(ModuleName.BUILD_STRUCTURE, PageName.BUILD_STRUCTURE)
    },
    {
      path: 'exam-preview',
      element: lazyLoadModuleRoute(ModuleName.EXAM_PREVIEW, PageName.EXAM_PREVIEW)
    },
    {
      path: 'student/exercise',
      element: lazyLoadModuleRoute(ModuleName.AI, 'StudentExercise')
    },
    {
      path: 'student/review',
      element: lazyLoadModuleRoute(ModuleName.AI, 'StudentReview')
    },
    {
      path: 'student/mindmap',
      element: lazyLoadModuleRoute(ModuleName.AI, 'StudentMindmap')
    },
    {
      path: 'student/plan',
      element: lazyLoadModuleRoute(ModuleName.AI, 'StudentPlan')
    },
    {
      path: 'game',
      element: lazyLoadModuleRoute(ModuleName.GAME, PageName.GAME)
    }
  ]
}
