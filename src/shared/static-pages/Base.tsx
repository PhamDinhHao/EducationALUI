import { Outlet } from 'react-router-dom'

const BaseRoute = () => {
  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', overflowY: 'auto', height: '100vh' }}>
      <Outlet />
    </div>
  )
}

export default BaseRoute
