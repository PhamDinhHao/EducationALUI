import { PagePath } from '@/shared/core/enum/page.enum'
import { Outlet, useLocation } from 'react-router-dom'

const BaseRoute = () => {
  const location = useLocation()
  
  return (
    <div className='h-screen overflow-y-auto' style={{backgroundColor : '#fff'}}>
      <Outlet />
    </div>
  )
}

export default BaseRoute
