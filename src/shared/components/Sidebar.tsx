import { Menu as MenuAntd, Button, Layout } from 'antd'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ReadOutlined, SearchOutlined, UserOutlined, DownloadOutlined } from '@ant-design/icons'
import { MenuItem } from '@/shared/core/types'
import { PagePath } from '@/shared/core/enum/page.enum'
import { memo, useMemo, useState } from 'react'
import { useMenu } from '@/shared/hooks/useMenu'
import { useSharedStore } from '../stores/shared.store'

const { Sider } = Layout

const MENU_ITEMS: MenuItem[] = [
  {
    key: PagePath.SEARCH_AI,
    icon: <SearchOutlined />,
    label: <Link to={PagePath.SEARCH_AI}>Tìm kiếm</Link>
  },
  {
    key: 'teacher',
    icon: <ReadOutlined />,
    label: 'Giáo viên',
    children: [
      { key: PagePath.BUILD_STRUCTURE, label: <Link to={PagePath.BUILD_STRUCTURE}>Xây dựng đề</Link> },
      { key: PagePath.BUILD_LESSON, label: <Link to={PagePath.BUILD_LESSON}>Xây dựng giáo án</Link> },
      {
        key: "/ai/experience-initiative",
        label: <Link to="/ai/experience-initiative">Sáng kiến kinh nghiệm</Link>
      },
      { key: PagePath.ASSISTANTAI, label: <Link to={PagePath.ASSISTANTAI}>Trợ lý giáo viên</Link> }
    ]
  },
  {
    key: 'student',
    icon: <UserOutlined />,
    label: 'Học sinh',
    children: [
      { key: PagePath.STUDENT_EXERCISE, label: <Link to={PagePath.STUDENT_EXERCISE}>Giải bài tập</Link> },
      { key: PagePath.STUDENT_REVIEW, label: <Link to={PagePath.STUDENT_REVIEW}>Ôn tập</Link> },
      { key: PagePath.STUDENT_MINDMAP, label: <Link to={PagePath.STUDENT_MINDMAP}>Mindmap</Link> },
      { key: PagePath.STUDENT_PLAN, label: <Link to={PagePath.STUDENT_PLAN}>Lập kế hoạch học tập</Link> }
    ]
  }
]

const Sidebar: React.FC = () => {
  const { onMenuClick } = useMenu()
  const location = useLocation()
  const navigate = useNavigate()

  const [searchText] = useState('')

  const { openKeys, setOpenKeys } = useSharedStore()

  // Filter menu theo searchText
  const filteredItems = useMemo(() => {
    if (!searchText) return MENU_ITEMS

    const lower = searchText.toLowerCase()

    return MENU_ITEMS.map((group) => {
      if (!group?.children) return null

      const filteredChildren = group?.children?.filter((child) =>
        typeof child.label === 'string'
          ? child.label.toLowerCase().includes(lower)
          : (child.label as any)?.props?.children?.toLowerCase().includes(lower)
      )

      if (filteredChildren?.length > 0) {
        return { ...group, children: filteredChildren }
      }
      return null
    }).filter(Boolean) as MenuItem[]
  }, [searchText])

  const selectedKey = useMemo(() => {
    const pathname = location.pathname

    // Check all possible paths and return the matching PagePath
    const allPaths = [
      PagePath.SEARCH_AI,
      PagePath.BUILD_STRUCTURE,
      PagePath.BUILD_LESSON,
      PagePath.EXPREANDSUCCE,
      PagePath.ASSISTANTAI,
      PagePath.STUDENT_EXERCISE,
      PagePath.STUDENT_REVIEW,
      PagePath.STUDENT_MINDMAP,
      PagePath.STUDENT_PLAN,
      "/ai/experience-initiative"
    ]

    // Find exact match first
    const exactMatch = allPaths.find((path) => pathname === path)
    if (exactMatch) return exactMatch

    // Find path that is included in pathname
    const includedMatch = allPaths.find((path) => pathname.includes(path))
    if (includedMatch) return includedMatch

    return pathname
  }, [location.pathname])

  // Check if current path is teacher section
  const isTeacherSection = useMemo(() => {
    const teacherPaths = [
      PagePath.BUILD_STRUCTURE,
      PagePath.BUILD_LESSON,
      PagePath.EXPREANDSUCCE,
      PagePath.ASSISTANTAI,
      "/ai/experience-initiative"
    ]
    return teacherPaths.some((path) => location.pathname.includes(path))
  }, [location.pathname])

  // Check if current path is student section
  const isStudentSection = useMemo(() => {
    const studentPaths = [
      PagePath.STUDENT_EXERCISE,
      PagePath.STUDENT_REVIEW,
      PagePath.STUDENT_MINDMAP,
      PagePath.STUDENT_PLAN
    ]
    return studentPaths.some((path) => location.pathname.includes(path))
  }, [location.pathname])

  // Get selected keys for menu - only child items, Ant Design will auto-highlight parent
  const menuSelectedKeys = useMemo(() => {
    if (!selectedKey) return []

    // Only return the child item key, not parent
    // Ant Design Menu will automatically highlight parent when child is selected
    return [selectedKey]
  }, [selectedKey])

  return (
    <>
      <style>{`
        /* Set fixed margin for all menu items to prevent layout shift */
        .ant-menu-inline .ant-menu-item,
        .ant-menu-submenu-title {
          margin: 0 8px !important;
          border-radius: 8px;
          transition: background-color 0.2s ease !important;
        }

        /* Remove default active style from parent menu */
        .ant-menu-submenu-selected > .ant-menu-submenu-title {
          background: transparent !important;
          color: inherit !important;
        }
        .ant-menu-submenu-selected > .ant-menu-submenu-title .anticon {
          color: inherit !important;
        }
        .ant-menu-submenu-selected > .ant-menu-submenu-title::after {
          display: none !important;
        }

        /* Highlight child menu items when selected - with higher specificity */
        .ant-menu-inline .ant-menu-item-selected,
        .ant-menu-inline .ant-menu-item.ant-menu-item-selected {
          background: #ff8c00 !important;
          color: white !important;
        }
        .ant-menu-inline .ant-menu-item-selected .anticon,
        .ant-menu-inline .ant-menu-item-selected a,
        .ant-menu-inline .ant-menu-item.ant-menu-item-selected a {
          color: white !important;
        }
        .ant-menu-inline .ant-menu-item-selected::after,
        .ant-menu-inline .ant-menu-item.ant-menu-item-selected::after {
          display: none !important;
        }

        /* Hover effect for menu items - only change background, not margin */
        .ant-menu-inline .ant-menu-item:hover:not(.ant-menu-item-selected) {
          background: #fff5e6 !important;
        }
        .ant-menu-submenu-title:hover {
          background: #fff5e6 !important;
        }
      `}</style>
      <Sider
        width={280}
        breakpoint='lg'
        collapsedWidth='0'
        className='site-layout-background shadow-sm'
        style={{
          background: '#fff',
          height: '100vh',
          borderRight: '1px solid #f0f0f0',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Logo */}
        <div style={{ padding: '20px 16px', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2
              style={{
                margin: 0,
                fontSize: '32px',
                fontWeight: 700,
                color: '#222',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              GEN A
              <span style={{ position: 'relative' }}>
                I
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-2px',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#ff8c00'
                  }}
                />
              </span>
            </h2>
          </div>
        </div>

        {/* Menu */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <MenuAntd
            selectedKeys={menuSelectedKeys}
            openKeys={openKeys}
            onOpenChange={setOpenKeys}
            items={filteredItems.map((item) => {
              if (item.key === 'teacher') {
                return {
                  ...item,
                  className: isTeacherSection ? 'teacher-menu-item' : ''
                }
              }
              if (item.key === 'student') {
                return {
                  ...item,
                  className: isStudentSection ? 'student-menu-item' : ''
                }
              }
              return item
            })}
            mode='inline'
            theme='light'
            onClick={onMenuClick}
            className='menu-multiline'
            style={{
              border: 'none',
              background: 'transparent'
            }}
          />
        </div>

        {/* Start Button */}
        <div style={{ padding: '16px', borderTop: '1px solid #f0f0f0' }}>
          <Button
            type='primary'
            block
            onClick={() => navigate(PagePath.GAME)}
            style={{
              background: '#ff8c00',
              border: 'none',
              borderRadius: '8px',
              height: '40px',
              fontWeight: 600
            }}
          >
            Trò chơi
          </Button>
        </div>

        {/* Footer Icons */}
        <div
          style={{
            padding: '12px 16px',
            borderTop: '1px solid #f0f0f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Button type='text' icon={<DownloadOutlined />} style={{ color: '#666', padding: '4px 8px' }}>
            Tải về
          </Button>
          {/* <Button type='text' icon={<SettingOutlined />} style={{ color: '#666', padding: '4px 8px' }} /> */}
        </div>
      </Sider>
    </>
  )
}

export default memo(Sidebar)
