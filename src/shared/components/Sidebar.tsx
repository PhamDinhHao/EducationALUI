import { Menu as MenuAntd, Button, Layout } from 'antd'
import { Link } from 'react-router-dom'
import { LogoutOutlined, LoginOutlined, SearchOutlined, ReadOutlined, UserOutlined } from '@ant-design/icons'
import { MenuItem, User } from '@/shared/core/types'
import { PagePath } from '@/shared/core/enum/page.enum'
import { memo } from 'react'
import { useBoundStore } from '@/shared/stores'
import { useMenu } from '@/shared/hooks/useMenu'

const { Sider } = Layout

const MENU_ITEMS: MenuItem[] = [
  {
    key: 'search',
    icon: <SearchOutlined />,
    label: <Link to={PagePath.SEARCH}>Tìm kiếm</Link>
  },
  {
    key: 'teacher',
    icon: <ReadOutlined />,
    label: 'Giáo viên',
    children: [
      { key: 'teacher-plan', label: <Link to={PagePath.TEACHER_PLAN}>Xây dựng đề</Link> },
      { key: 'teacher-exam', label: <Link to={PagePath.TEACHER_EXAM}>Xây dựng giáo án</Link> },
      { key: 'teacher-mark', label: <Link to={PagePath.TEACHER_MARK}>Kế hoạch cá nhân & Sáng kiến kinh nghiệm</Link> },
      { key: 'teacher-report', label: <Link to={PagePath.TEACHER_REPORT}>Trợ lý giáo viên</Link> }
    ]
  },
  {
    key: 'student',
    icon: <UserOutlined />,
    label: 'Học sinh',
    children: [
      { key: 'student-exercise', label: <Link to={PagePath.STUDENT_EXERCISE}>Giải bài tập</Link> },
      { key: 'student-review', label: <Link to={PagePath.STUDENT_REVIEW}>Ôn tập</Link> },
      { key: 'student-mindmap', label: <Link to={PagePath.STUDENT_MINDMAP}>Mindmap</Link> },
      { key: 'student-plan', label: <Link to={PagePath.STUDENT_PLAN}>Lập kế hoạch học tập</Link> }
    ]
  }
]

const Sidebar: React.FC = () => {
  const { user } = useBoundStore((state) => state)
  const {
    openKeys,
    selectedKeys,
    onOpenChange,
    onMenuClick,
  } = useMenu()

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
        paddingTop: '16px'

      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <img src="/image/logo.png" alt="Logo" width={120} height={40} />
      </div>

      <MenuAntd
        selectedKeys={selectedKeys}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        items={MENU_ITEMS}
        mode="inline"
        theme="light"
        onClick={onMenuClick}
        className="menu-multiline"
      />


      <div style={{ borderTop: '1px solid #f0f0f0', marginTop: 'auto', padding: '8px' }}>

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
