import { Outlet } from 'react-router-dom'
import { Layout } from 'antd'
import { Header, Sider } from '@editor/components/layout'
import Loading from '@/shared/components/Loading'
import { useSharedStore } from '@/shared/stores/shared.store'
import { useErrorSendMailStore } from '@/shared/stores/errorSendMail'
import SiderInfor from '@/modules/editor/components/layout/SiderInfor'

const EditorLayout: React.FC = () => {
  const { isLoading } = useSharedStore()

  const { isConfirm } = useErrorSendMailStore()

  return (
    <>
      <Layout>
        <Layout>
          <Header />
          <Outlet />
        </Layout>
        {!isConfirm ? <SiderInfor /> : <Sider />}
      </Layout>
      {isLoading ? <Loading /> : null}
    </>
  )
}

export default EditorLayout
