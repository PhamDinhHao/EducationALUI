import { useState } from 'react'
import { Layout } from 'antd'
import { Link } from 'react-router-dom'
import Menu from '@/shared/components/Menu'
import BaseRoute from '@/shared/static-pages/Base'

const { Content, Header } = Layout

const RootLayout = () => {
  return (
    <>
      <Layout>
        <Header className='flex items-center justify-between bg-white px-4 lg:px-6 shadow-sm'>
          <Link className='flex items-center' to='/'>
            <img height={40} src='/image/logo.png' width={120} alt='Logo' />
          </Link>
          <Menu />
          <div className="hidden lg:block" style={{ width: 120 }}></div>
        </Header>
        <Layout>
          <Content>
            <BaseRoute />
          </Content>
          {/* <Footer className='flex h-12 items-center justify-center p-0'>A.D.D ©{new Date().getFullYear()}</Footer> */}
        </Layout>
      </Layout>
    </>
  )
}

export default RootLayout
