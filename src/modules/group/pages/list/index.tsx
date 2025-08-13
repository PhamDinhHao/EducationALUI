import { Tabs, type TabsProps } from 'antd'
import FilterDelivery from '@/modules/group/components/Tab/FilterDelivery'
import ListDistribution from '@/modules/group/components/Tab/ListDistribution'

const items: TabsProps['items'] = [
  {
    key: '1',
    label: 'リスト配信',
    children: <ListDistribution />
  },
  {
    key: '2',
    label: 'フィルタ配信',
    children: <FilterDelivery />
  }
]

const RecipientsGroupPage: React.FC = () => {
  return <Tabs className='p-4' defaultActiveKey='1' items={items} />
}

export default RecipientsGroupPage
