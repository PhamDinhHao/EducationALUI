// src/routes/RoutesApp.tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RootLayout from '@/shared/layouts/RootLayout'
import { lazyLoadModuleRoute } from '@/routes/LazyLoadRoutes'
import { ModuleName, PageName } from '@/shared/core/enum/page.enum'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: lazyLoadModuleRoute(ModuleName.COURSE, PageName.COURSE_LIST) }, // Route mặc định hiển thị danh sách khóa học
      { path: 'courses', element: lazyLoadModuleRoute(ModuleName.COURSE, PageName.COURSE_LIST) },
    ]
  }
])

export default function RoutesApp() {
  return <RouterProvider router={router} />
}
