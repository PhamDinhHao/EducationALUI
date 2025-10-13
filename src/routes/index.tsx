import { lazy } from 'react'
import { createBrowserRouter, RouteObject, RouterProvider } from 'react-router-dom'
import RootLayout from '@/shared/layouts/RootLayout'
import PrivateRoute from '@/routes/PrivateRoute'
import ValidateLoginRoute from '@/routes/ValidateLoginRoute'
import { ModuleName, PageName, PagePath } from '@/shared/core/enum/page.enum'
import { lazyLoadModuleRoute, lazyLoadRoute } from '@/routes/LazyLoadRoutes'
import {
  growCapRoute,
  learnCapRoute,
  lifeCapRoute,
  challengeCapRoute,
  aiRoute,
  studentRoute,
  homeRoute
} from '@/routes/modules'
import AILayout from '@shared/layouts/AILayout.tsx'
import coursePageRoute from '@/routes/modules/courseRouter.tsx'

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
      ...learnCapRoute,
      ...lifeCapRoute,
      ...challengeCapRoute,
      ...studentRoute
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
