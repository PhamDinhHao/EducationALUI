import { Button, Dropdown, MenuProps, Space } from 'antd'
import { DownOutlined, LogoutOutlined } from '@ant-design/icons'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { PagePath } from '@/shared/core/enum/page.enum'
import { useBoundStore } from '@/shared/stores'
type PageWrapperProps = {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
}

const PageWrapper = ({ title, icon, children }: PageWrapperProps) => {
  const navigate = useNavigate()
  const user = useBoundStore((state) => state.user)
  const handleLogout = useCallback(() => {
    navigate(PagePath.LOGIN)
  }, [])

  const items: MenuProps['items'] = [
    {
      type: 'divider'
    },
    {
      label: (
        <Space onClick={handleLogout}>
          Logout
          <LogoutOutlined />
        </Space>
      ),
      key: '3'
    }
  ]
  return (
    <div className='relative'>
      <div className='h-14 w-full shadow-md sticky top-0 left-0 bg-white z-10'>
        <div className='mr-10 flex h-full items-center justify-between'>
          <>
            <div className='ml-10 flex h-full items-center justify-center'>
              <div className='text-xl'>{icon}</div>
              <span className='ml-2 text-xl font-bold'>{title}</span>
            </div>
          </>
          <div className='mr-10 flex h-full items-center justify-end'>
            <Dropdown menu={{ items }} trigger={['click']} placement='bottomRight'>
              <a onClick={(e) => e.preventDefault()}>
                <Button>
                  ID: {user?.name}
                  <DownOutlined />
                </Button>
              </a>
            </Dropdown>
          </div>
        </div>
      </div>
      <div className='flex-1'>
        {children}
      </div>
    </div>
  )
}

export default PageWrapper