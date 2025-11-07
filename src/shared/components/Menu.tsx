import { Menu as MenuAntd, Drawer, Button, Avatar, Dropdown } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { MenuOutlined, RightOutlined, LogoutOutlined, LoginOutlined, UserOutlined, BookOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { MenuItem, User } from '@/shared/core/types'
import { PagePath } from '@/shared/core/enum/page.enum'
import { memo } from 'react'
import { useBoundStore } from '@/shared/stores'
import { useMenu } from '@/shared/hooks/useMenu'

const MENU_ITEMS: MenuItem[] = [
  {
    key: PagePath.HOME,
    label: <Link to={PagePath.HOME}>Trang chủ</Link>
  },
  {
    key: 'Khóa học',
    label: <Link to='/courses'>Khóa học</Link>
  },
  {
    key: 'Bài viết',
    label: <Link to='/blog'>Bài viết</Link>
  },
  {
    key: PagePath.AI,
    label: <Link to={PagePath.AI}>Gen AI</Link>
  }
]

const menuStyles = {
  desktop: {
    borderBottom: 'none',
    lineHeight: '64px',
    width: '100%',
    maxWidth: '1200px'
  },
  mobile: {
    border: 'none',
    padding: '8px 0'
  },
  drawer: {
    header: {
      padding: '16px',
      borderBottom: '1px solid #f0f0f0'
    },
    body: {
      padding: 0
    }
  }
}

const DesktopMenu = memo<{
  selectedKeys: string[]
  openKeys: string[]
  onOpenChange: (keys: string[]) => void
  onMenuClick: () => void
  onLogout: () => void
  onLogin: () => void
  user: User | null
  onNavigate: (path: string) => void
}>(({ selectedKeys, openKeys, onOpenChange, onMenuClick, onLogout, onLogin, user, onNavigate }) => {
  const userMenuItems: MenuProps['items'] = user
    ? [
      {
        key: 'profile',
        label: 'Profile',
        icon: <UserOutlined />,
        onClick: () => onNavigate(PagePath.PROFILE)
      },
      {
        key: 'my-courses',
        label: 'Khóa học của bạn',
        icon: <BookOutlined />,
        onClick: () => onNavigate(PagePath.MY_COURSES)
      },
      {
        type: 'divider'
      },
      {
        key: 'logout',
        label: 'Logout',
        icon: <LogoutOutlined />,
        danger: true,
        onClick: onLogout
      }
    ]
    : []


  return (
    <div className='hidden flex-1 lg:block'>
      <div className='flex items-center justify-between'>
        <MenuAntd
          selectedKeys={selectedKeys}
          openKeys={openKeys}
          onOpenChange={onOpenChange}
          items={MENU_ITEMS}
          mode='horizontal'
          theme='light'
          className='flex justify-center gap-6'
          style={menuStyles.desktop}
          onClick={onMenuClick}
        />
        {user ? (
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div className='flex items-center gap-2 cursor-pointer px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors'>
              <Avatar
                size="small"
                icon={<UserOutlined />}
                style={{ backgroundColor: '#1890ff' }}
              >
                {user?.name || user?.email || 'Người ẩn danh'}
              </Avatar>
              <span className='hidden md:block text-sm font-medium'>
                {/* .split('@') */}
                {user?.name || user?.email || 'Người ẩn danh'}
              </span>
            </div>
          </Dropdown>
        ) : (
          <Button type='text' icon={<LoginOutlined />} className='flex items-center' onClick={onLogin}>
            Login
          </Button>
        )}
      </div>
    </div>
  )
})

const MobileMenu = memo<{
  selectedKeys: string[]
  openKeys: string[]
  onOpenChange: (keys: string[]) => void
  onMenuClick: () => void
  onLogout: () => void
  onLogin: () => void
  user: User | null
  onNavigate: (path: string) => void
  onCloseDrawer: () => void
}>(({ selectedKeys, openKeys, onOpenChange, onMenuClick, onLogout, onLogin, user, onNavigate, onCloseDrawer }) => {
  const handleMenuClick = (path: string) => {
    onNavigate(path)
    onCloseDrawer()
  }

  return (
    <>
      <MenuAntd
        selectedKeys={selectedKeys}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        items={MENU_ITEMS}
        mode='inline'
        theme='light'
        style={menuStyles.mobile}
        onClick={onMenuClick}
        expandIcon={({ isOpen }) => (
          <RightOutlined
            style={{
              transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease-in-out',
              marginLeft: '10px'
            }}
          />
        )}
        triggerSubMenuAction='click'
      />
      <div className='border-t border-gray-200 px-4 py-3'>
        {user ? (
          <>
            <div className='flex items-center gap-3 mb-3 pb-3 border-b border-gray-200'>
              <Avatar
                size="default"
                icon={<UserOutlined />}
                style={{ backgroundColor: '#1890ff' }}
              >
                {user?.name || user?.email || 'Người ẩn danh'}
              </Avatar>
              <div className='flex-1 min-w-0'>
                <div className='text-sm font-medium truncate'>{user?.name || 'Người ẩn danh'}</div>
                <div className='text-xs text-gray-500 truncate'>{user?.email}</div>
              </div>
            </div>
            <Button
              type='text'
              icon={<UserOutlined />}
              className='flex w-full items-center text-left mb-2'
              onClick={() => handleMenuClick(PagePath.PROFILE)}
            >
              Profile
            </Button>
            <Button
              type='text'
              icon={<BookOutlined />}
              className='flex w-full items-center text-left mb-2'
              onClick={() => handleMenuClick(PagePath.MY_COURSES)}
            >
              Khóa học của bạn
            </Button>
            <Button
              type='text'
              icon={<LogoutOutlined />}
              onClick={onLogout}
              className='flex w-full items-center text-left'
              danger
            >
              Log Out
            </Button>
          </>
        ) : (
          <Button type='text' icon={<LoginOutlined />} className='flex w-full items-center text-left' onClick={onLogin}>
            Login
          </Button>
        )}
      </div>
    </>
  )
})

const MobileMenuButton = memo<{
  onClick: () => void
}>(({ onClick }) => (
  <Button
    className='flex items-center justify-center lg:hidden'
    type='text'
    icon={<MenuOutlined style={{ fontSize: '20px' }} />}
    onClick={onClick}
    style={{ height: '64px', width: '64px' }}
    aria-label='Toggle mobile menu'
  />
))

const Menu: React.FC = () => {
  const { user } = useBoundStore((state) => state)
  const navigate = useNavigate()
  const {
    openKeys,
    selectedKeys,
    mobileMenuOpen,
    onOpenChange,
    onMenuClick,
    toggleMobileMenu,
    closeMobileMenu,
    handleLogout,
    handleLogin
  } = useMenu()

  const handleNavigate = (path: string) => {
    navigate(path)
  }

  return (
    <>
      <DesktopMenu
        selectedKeys={selectedKeys}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        onMenuClick={onMenuClick}
        onLogout={handleLogout}
        onLogin={handleLogin}
        user={user}
        onNavigate={handleNavigate}
      />
      <MobileMenuButton onClick={toggleMobileMenu} />
      <Drawer
        title={
          <div className='flex items-center'>
            <img height={40} src='/image/logo.png' width={120} alt='Logo' />
          </div>
        }
        placement='right'
        onClose={closeMobileMenu}
        open={mobileMenuOpen}
        bodyStyle={menuStyles.drawer.body}
        width={280}
        headerStyle={menuStyles.drawer.header}
      >
        <MobileMenu
          selectedKeys={selectedKeys}
          openKeys={openKeys}
          onOpenChange={onOpenChange}
          onMenuClick={onMenuClick}
          onLogout={handleLogout}
          onLogin={handleLogin}
          user={user}
          onNavigate={handleNavigate}
          onCloseDrawer={closeMobileMenu}
        />
      </Drawer>
    </>
  )
}

export default memo(Menu)
