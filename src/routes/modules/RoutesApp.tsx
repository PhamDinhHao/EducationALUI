// src/routes/RoutesApp.tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RootLayout from '@/shared/layouts/RootLayout'
import CourseList from '@/modules/course/pages/CourseList'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <CourseList /> }, // Route mặc định hiển thị danh sách khóa học
      { path: 'courses', element: <CourseList /> },
    ]
  }
])

export default function RoutesApp() {
  return <RouterProvider router={router} />
}
