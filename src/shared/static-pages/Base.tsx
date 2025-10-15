import { Outlet } from 'react-router-dom'

const BaseRoute = () => {
  return (
    <div className='h-screen overflow-y-auto' style={{ backgroundColor: '#fff' }}>
      <Outlet />
    </div>
  )
}

export default BaseRoute
