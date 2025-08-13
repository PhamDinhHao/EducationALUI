import { Layout } from 'antd'
import { useLocation } from 'react-router-dom'
import { EditOutlined } from '@ant-design/icons'
import { PagePath } from '@/shared/core/enum/page.enum'
import { ButtonGoBack } from '../ui'

const { Header: HeaderAntd } = Layout

const renderTitle = (pathName: string) => {
  if (pathName.includes(PagePath.HTML_EDITOR)) {
    return 'HTMLメール' // HTML Editor
  }
  if (pathName.includes(PagePath.TEXT_EDITOR)) {
    return 'テキストメール' // Text Editor
  }
}

const Header: React.FC = () => {
  const { pathname } = useLocation()

  return (
    <HeaderAntd className='z-10 flex h-16 gap-4 border-b border-b-[#ccc] bg-[#fafafa] px-2 py-4'>
      <ButtonGoBack />
      <div className='flex items-center justify-center gap-2 font-bold'>
        <EditOutlined className='text-xl'/>
        <p className='text-xl'>{renderTitle(pathname)}</p>
      </div>
    </HeaderAntd>
  )
}

export default Header
