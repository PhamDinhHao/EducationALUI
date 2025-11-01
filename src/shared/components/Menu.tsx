import { Menu as MenuAntd, Drawer, Button } from 'antd'
import { Link } from 'react-router-dom'
import { MenuOutlined, RightOutlined, LogoutOutlined, LoginOutlined } from '@ant-design/icons'
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
    label: <Link to='/'>Bài viết</Link>
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
}>(({ selectedKeys, openKeys, onOpenChange, onMenuClick, onLogout, onLogin, user }) => (
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
        <Button type='text' icon={<LogoutOutlined />} onClick={onLogout} className='flex items-center'>
          Log Out
        </Button>
      ) : (
        <Button type='text' icon={<LoginOutlined />} className='flex items-center' onClick={onLogin}>
          Login
        </Button>
      )}
    </div>
  </div>
))

const MobileMenu = memo<{
  selectedKeys: string[]
  openKeys: string[]
  onOpenChange: (keys: string[]) => void
  onMenuClick: () => void
  onLogout: () => void
  onLogin: () => void
  user: User | null
}>(({ selectedKeys, openKeys, onOpenChange, onMenuClick, onLogout, onLogin, user }) => (
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
    <div className='border-t border-gray-200 px-4 py-2'>
      {user ? (
        <Button type='text' icon={<LogoutOutlined />} onClick={onLogout} className='flex w-full items-center text-left'>
          Log Out
        </Button>
      ) : (
        <Button type='text' icon={<LoginOutlined />} className='flex w-full items-center text-left' onClick={onLogin}>
          Login
        </Button>
      )}
    </div>
  </>
))

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
        />
      </Drawer>
    </>
  )
}

export default memo(Menu)
