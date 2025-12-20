import { Layout } from 'antd'
import { Link, Outlet } from 'react-router-dom'
import Menu from '@/shared/components/Menu'
import BaseRoute from '@/shared/static-pages/Base'
import images from '@/assets/images'
import Sidebar from '@/shared/components/Sidebar'
const { Content, Header } = Layout

const AILayout = () => {
  return (
    <>
      <Layout>
        <Header className='flex items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm lg:px-6'>
          <Link className='flex items-center' to='/'>
            <img src={images.icLogo} width={100} alt='Logo' />
          </Link>
          <Menu />
          <div className='hidden lg:block' style={{ width: 120 }}></div>
        </Header>
        <Layout>
          <Content className='flex'>
            <Sidebar />
            <div className='flex-1 h-screen overflow-y-auto bg-white'>
              <Outlet />
            </div>
          </Content>
        </Layout>
      </Layout>
    </>
  )
}

export default AILayout
