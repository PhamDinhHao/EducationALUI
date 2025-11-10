import { Layout } from 'antd'
import { Link, Outlet } from 'react-router-dom'
import Menu from '@/shared/components/Menu'
import images from '@/assets/images'

const { Header } = Layout

const RootLayout = () => {
  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
      <Header className='flex items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm lg:px-6'>
        <Link className='flex items-center' to='/'>
          <img src={images.icLogoEdu} width={60} alt='Logo' />
          <span className='text-black-600 ml-2 text-xl font-bold'>EducationAL</span>
        </Link>
        <Menu />
        <div className='hidden lg:block' style={{ width: 120 }}></div>
      </Header>
      <div style={{ width: '100%' }}>
        <Outlet />
      </div>
    </div>
  )
}

export default RootLayout
