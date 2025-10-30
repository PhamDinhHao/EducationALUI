import { createBrowserRouter, RouteObject, RouterProvider } from 'react-router-dom'
import RootLayout from '@/shared/layouts/RootLayout'
import PrivateRoute from '@/routes/PrivateRoute'
import ValidateLoginRoute from '@/routes/ValidateLoginRoute'
import { ModuleName, PageName, PagePath } from '@/shared/core/enum/page.enum'
import { lazyLoadModuleRoute, lazyLoadRoute } from '@/routes/LazyLoadRoutes'
import {
  growCapRoute,
  lifeCapRoute,
  challengeCapRoute,
  aiRoute,
  studentRoute,
  homeRoute,
  buildStructureRoute,
  buildLessonRoute,
  assistantAiRoute
} from '@/routes/modules'
import AILayout from '@shared/layouts/AILayout.tsx'
import coursePageRoute from '@/routes/modules/courseRouter.tsx'
import { expreAndSucceRoute } from '@/routes/modules/expreAndSucce'
import { stemLessonRoute } from '@/routes/modules/stemLesson'
import { promptLessonRoute } from '@/routes/modules/promptLesson'
import { planResultRoute } from '@/routes/modules/planresult'
import { initiativeResultRoute } from '@/routes/modules/initiativeResult'
import { successionPlanRoute } from '@/routes/modules/successionPlan'
import { lessonFormRoute } from '@/routes/modules/lessonForm'
import { lessonResultRoute } from '@/routes/modules/lessonResult'
import { experienceInitiativeRoute } from '@/routes/modules/experienceInitiative'
import { examPreviewRoute } from '@/routes/modules/examPreview'

// const NavigateComponent = lazy(() => import('@/shared/components/Navigate/Navigate'))

const configRoutes: RouteObject[] = [
  {
    path: PagePath.REGISTER,
    element: <ValidateLoginRoute>{lazyLoadModuleRoute(ModuleName.AUTH, PageName.REGISTER)}</ValidateLoginRoute>
  },
  {
    path: PagePath.LOGIN,
    element: <ValidateLoginRoute>{lazyLoadModuleRoute(ModuleName.AUTH, PageName.LOGIN)}</ValidateLoginRoute>
  },
  {
    path: '/',
    element: (
      <PrivateRoute>
        <RootLayout />
      </PrivateRoute>
    ),
    children: [
      ...homeRoute,
      ...coursePageRoute,
      ...growCapRoute,
      ...lifeCapRoute,
      ...challengeCapRoute,
      ...studentRoute,
      ...buildStructureRoute,
      ...buildLessonRoute,
      ...expreAndSucceRoute,
      ...assistantAiRoute,
      ...stemLessonRoute,
      ...promptLessonRoute,
      ...planResultRoute,
      ...initiativeResultRoute,
      ...successionPlanRoute,
      ...lessonFormRoute,
      ...lessonResultRoute,
      ...experienceInitiativeRoute,
      ...examPreviewRoute,
    ]
  },
  {
    path: '/',
    element: (
      <PrivateRoute>
        <AILayout />
      </PrivateRoute>
    ),
    children: [...aiRoute]
  },
  {
    path: '*',
    element: lazyLoadRoute('NotFound')
  }
]

export const router = createBrowserRouter(configRoutes)

const RoutesApp = () => {
  return <RouterProvider router={router} />
}

export default RoutesApp
