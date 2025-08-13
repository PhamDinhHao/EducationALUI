import { lazy, Suspense } from 'react'
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
  challengeCapRoute
} from '@/routes/modules'
import { Spin } from 'antd'

const NavigateComponent = lazy(() => import('@/shared/components/Navigate/Navigate'))

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
    element: <RootLayout />,
    children: [
      {
        path: PagePath.HOME,
        element: lazyLoadModuleRoute(ModuleName.HOME, PageName.HOME)
      },
      {
        index: true,
        element: (
          <Suspense
            fallback={
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100vh'
                }}
              >
                <Spin size='large' />
              </div>
            }
          >
            <NavigateComponent />
          </Suspense>
        )
      }
    ]
  },
  {
    path: '/',
    element: (
      <PrivateRoute>
        <RootLayout />
      </PrivateRoute>
    ),
    children: [...growCapRoute, ...learnCapRoute, ...lifeCapRoute, ...challengeCapRoute]
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
