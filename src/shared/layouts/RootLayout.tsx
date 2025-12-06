import { Layout } from 'antd'
import { Link, Outlet, useLocation } from 'react-router-dom'
import Menu from '@/shared/components/Menu'
import images from '@/assets/images'
import FloatingAIChat from '@/shared/components/FloatingAIChat/FloatingAIChat'

const { Header } = Layout

const RootLayout = () => {
  const location = useLocation()

  return (
    <>
      <style>{`
        /* Ẩn thanh cuộn của body và html */
        html {
          overflow: hidden !important;
        }
        body {
          overflow: hidden !important;
        }
        #root {
          overflow: hidden !important;
        }
        /* Đảm bảo chỉ có 1 thanh cuộn từ RootLayout */
        .root-layout-content {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 #f1f5f9;
        }
        .root-layout-content::-webkit-scrollbar {
          width: 8px;
        }
        .root-layout-content::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        .root-layout-content::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .root-layout-content::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
      <div style={{ backgroundColor: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Header className='flex items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm lg:px-6' style={{ flexShrink: 0 }}>
          <Link className='flex items-center' to='/'>
            <img src={images.icLogo} width={100} alt='Logo' />
          </Link>
          <Menu />
          <div className='hidden lg:block' style={{ width: 120 }}></div>
        </Header>
        <div className='root-layout-content' style={{ width: '100%', flex: 1, overflowX: 'hidden', minHeight: 0 }}>
          <Outlet />
        </div>
        {/* FloatingAIChat only visible on non-ai routes */}
        {!location.pathname.startsWith('/ai') && <FloatingAIChat />}
      </div>
    </>
  )
}

export default RootLayout
