import { Menu as MenuAntd, Drawer, Button, Avatar, Dropdown } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { MenuOutlined, RightOutlined, LogoutOutlined, LoginOutlined, UserOutlined, BookOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { MenuItem, User } from '@/shared/core/types'
import { PagePath } from '@/shared/core/enum/page.enum'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { useBoundStore } from '@/shared/stores'
import { useMenu } from '@/shared/hooks/useMenu'
import { getProfile } from '@/shared/services/auth.service'

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
  isLoadingUser?: boolean
}>(({ selectedKeys, openKeys, onOpenChange, onMenuClick, onLogout, onLogin, user, onNavigate, isLoadingUser = false }) => {
  console.log('DesktopMenu - user:', user)
  console.log('DesktopMenu - user.name:', user?.name)
  console.log('DesktopMenu - user.email:', user?.email)
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
                style={{ backgroundColor: '#1890ff' }}
              >
                {(() => {
                  const displayName = user.name?.trim() || user.email?.trim() || ''
                  return displayName ? displayName.charAt(0).toUpperCase() : <UserOutlined />
                })()}
              </Avatar>
              <span className='hidden md:block text-sm font-medium'>
                {user.name?.trim() || user.email?.trim() || (isLoadingUser)}
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
}, (prevProps, nextProps) => {
  const userChanged = prevProps.user?.id !== nextProps.user?.id ||
    prevProps.user?.email !== nextProps.user?.email ||
    (prevProps.user === null && nextProps.user !== null) ||
    (prevProps.user !== null && nextProps.user === null)
  const selectedKeysChanged = prevProps.selectedKeys[0] !== nextProps.selectedKeys[0]
  const openKeysChanged = prevProps.openKeys[0] !== nextProps.openKeys[0]
  const isLoadingChanged = prevProps.isLoadingUser !== nextProps.isLoadingUser

  return !userChanged && !selectedKeysChanged && !openKeysChanged && !isLoadingChanged
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
  isLoadingUser?: boolean
}>(({ selectedKeys, openKeys, onOpenChange, onMenuClick, onLogout, onLogin, user, onNavigate, onCloseDrawer, isLoadingUser = false }) => {
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
                style={{ backgroundColor: '#1890ff' }}
              >
                {(() => {
                  const displayName = user.name?.trim() || user.email?.trim() || ''
                  return displayName ? displayName.charAt(0).toUpperCase() : <UserOutlined />
                })()}
              </Avatar>
              <div className='flex-1 min-w-0'>
                <div className='text-sm font-medium truncate'>
                  {user.name?.trim() || user.email?.trim() || (isLoadingUser)}
                </div>
                <div className='text-xs text-gray-500 truncate'>{user.email?.trim() || ''}</div>
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
}, (prevProps, nextProps) => {
  const userChanged = prevProps.user?.id !== nextProps.user?.id ||
    prevProps.user?.email !== nextProps.user?.email ||
    (prevProps.user === null && nextProps.user !== null) ||
    (prevProps.user !== null && nextProps.user === null)
  const selectedKeysChanged = prevProps.selectedKeys[0] !== nextProps.selectedKeys[0]
  const openKeysChanged = prevProps.openKeys[0] !== nextProps.openKeys[0]
  const isLoadingChanged = prevProps.isLoadingUser !== nextProps.isLoadingUser

  return !userChanged && !selectedKeysChanged && !openKeysChanged && !isLoadingChanged
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
  const { user, userProfile } = useBoundStore((state) => state)
  const navigate = useNavigate()
  const hasFetchedRef = useRef(false)
  const [isLoadingUser, setIsLoadingUser] = useState(false)
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

  const handleNavigate = useCallback((path: string) => {
    navigate(path)
  }, [navigate])

  useEffect(() => {
    const fetchUserIfNeeded = async () => {
      if (!hasFetchedRef.current && user && (!user.email || !user.name)) {
        setIsLoadingUser(true)
        try {
          const profileResponse = await getProfile()
          const profileData = profileResponse?.data?.data?.user ||
            profileResponse?.data?.data ||
            profileResponse?.data?.user ||
            profileResponse?.data || {}
          if (profileData && (profileData.email || profileData.name)) {
            userProfile(profileData)
          }
          hasFetchedRef.current = true
        } catch (error) {
          hasFetchedRef.current = true
        } finally {
          setIsLoadingUser(false)
        }
      }
    }

    fetchUserIfNeeded()
  }, [user, userProfile])

  useEffect(() => {
    if (!user) {
      hasFetchedRef.current = false
      setIsLoadingUser(false)
    } else if (user.email && user.name) {
      hasFetchedRef.current = true
      setIsLoadingUser(false)
    }
  }, [user])

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
        isLoadingUser={isLoadingUser}
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
        styles={{
          body: menuStyles.drawer.body,
          header: menuStyles.drawer.header
        }}
        width={280}
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
          isLoadingUser={isLoadingUser}
        />
      </Drawer>
    </>
  )
}

export default memo(Menu)
