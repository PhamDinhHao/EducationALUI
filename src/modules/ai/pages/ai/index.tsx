// src/modules/ai/pages/ai/index.tsx
import Sidebar from '@/shared/components/Sidebar'
import { Outlet } from 'react-router-dom'

const HomeAILayout = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar với chiều rộng cố định */}
      <div className="w-52 bg-white shadow-md">
        <Sidebar />
      </div>

      {/* Outlet chiếm phần còn lại */}
      <div className="flex-1 bg-gray-50 ">
        <Outlet />
      </div>
    </div>
  )
}

export default HomeAILayout
