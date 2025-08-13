import { Tabs, type TabsProps } from 'antd'
import MailSettingTab from '@/modules/mail-setting/components/Tab/MailSettingTab'
import LineSettingTab from '@/modules/mail-setting/components/Tab/LineSettingTab'

const items: TabsProps['items'] = [
  {
    key: '1',
    label: 'メール設定',
    children: <MailSettingTab />
  },
  {
    key: '2',
    label: 'ライン設定',
    children: <LineSettingTab />
  }
]

const MailSettingPage: React.FC = () => {
  return <Tabs className='p-4' defaultActiveKey='1' items={items} />
}

export default MailSettingPage
