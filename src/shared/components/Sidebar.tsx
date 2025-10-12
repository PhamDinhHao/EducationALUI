import { Menu as MenuAntd, Button, Layout, Input } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import { LogoutOutlined, ReadOutlined, UserOutlined } from '@ant-design/icons'
import { MenuItem } from '@/shared/core/types'
import { PagePath } from '@/shared/core/enum/page.enum'
import { memo, useMemo, useState } from 'react'
import { useBoundStore } from '@/shared/stores'
import { useMenu } from '@/shared/hooks/useMenu'

const { Sider } = Layout
const { Search } = Input

const MENU_ITEMS: MenuItem[] = [
  {
    key: 'teacher',
    icon: <ReadOutlined />,
    label: 'Giáo viên',
    children: [
      { key: PagePath.BUILD_STRUCTURE, label: <Link to={PagePath.BUILD_STRUCTURE}>Xây dựng đề</Link> },
      { key: PagePath.BUILD_LESSON, label: <Link to={PagePath.BUILD_LESSON}>Xây dựng giáo án</Link> },
      { key: PagePath.EXPREANDSUCCE, label: <Link to={PagePath.EXPREANDSUCCE}>Kế hoạch cá nhân & Sáng kiến kinh nghiệm</Link> },
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

  const [searchText, setSearchText] = useState("")

  // Filter menu theo searchText
  console.log(location.pathname)
  const filteredItems = useMemo(() => {
    if (!searchText) return MENU_ITEMS

    const lower = searchText.toLowerCase()

    return MENU_ITEMS.map(group => {
      if (!group.children) return null

      const filteredChildren = group.children.filter(child =>
        typeof child.label === "string"
          ? child.label.toLowerCase().includes(lower)
          : (child.label as any)?.props?.children?.toLowerCase().includes(lower)
      )

      if (filteredChildren.length > 0) {
        return { ...group, children: filteredChildren }
      }
      return null
    }).filter(Boolean) as MenuItem[]
  }, [searchText])

  const selectedKey = useMemo(() => {
    if (location.pathname.startsWith("/ai/")) {
      return location.pathname.replace("/ai/", "")
    }
    return location.pathname
  }, [location.pathname])
  
  return (
    <Sider
      breakpoint="lg"
      collapsedWidth="0"
      style={{
        background: '#fff',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        borderRight: '1px solid #f0f0f0',
        paddingTop: '16px',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <img src="/image/logo.png" alt="Logo" width={120} height={40} />
      </div>

      {/* Search box */}
      <div style={{ padding: '0 12px 12px' }}>
        <Search
          placeholder="Search"
          allowClear
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <MenuAntd
        selectedKeys={[selectedKey]}
        defaultOpenKeys={['teacher', 'student']}
        items={filteredItems}
        mode="inline"
        theme="light"
        onClick={onMenuClick}
        className="menu-multiline"
      />




      <div style={{ borderTop: '1px solid #f0f0f0', padding: '8px' }}>
        <Button
          type="text"
          icon={<LogoutOutlined />}
          className="flex w-full items-center"
          style={{ width: '100%' }}
        >
          Bắt đầu
        </Button>
      </div>
    </Sider>
  )
}

export default memo(Sidebar)
