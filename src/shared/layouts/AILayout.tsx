import { Layout } from 'antd'
import { Link } from 'react-router-dom'
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
            <img src={images.icLogoEdu} width={60} alt='Logo' />
            <span className='text-black-600 ml-2 text-xl font-bold'>EducationAL</span>
          </Link>
          <Menu />
          <div className='hidden lg:block' style={{ width: 120 }}></div>
        </Header>
        <Layout>
          <Content>
            <Sidebar />
            <BaseRoute />
          </Content>
        </Layout>
      </Layout>
    </>
  )
}

export default AILayout
