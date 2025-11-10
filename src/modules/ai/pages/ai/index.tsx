import { Outlet } from 'react-router-dom'

const HomeAILayout = () => {
  return (
    <div className='flex min-h-screen'>
      <div className='flex-1 bg-gray-50'>
        <Outlet />
      </div>
    </div>
  )
}

export default HomeAILayout
