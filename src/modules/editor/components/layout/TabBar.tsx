import { Tabs } from 'antd'
import React, { Suspense, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { PagePath } from '@/shared/core/enum/page.enum'
import type { TabsProps } from 'antd'
const MySaved = React.lazy(() => import('@editor/components/MySaved'))
const MyTemplates = React.lazy(() => import('@editor/components/MyTemplates'))
const DistributionSettings = React.lazy(() => import('@editor/components/DistributionSettings'))
const PlugInCode = React.lazy(() => import('@editor/components/PlugInCode'))

const TabBar: React.FC = () => {
  const { pathname } = useLocation()
  const [activeKey, setActiveKey] = useState('distributionSettings')

  const onChange = (key: string) => {
    setActiveKey(key)
  }

  const tabsShared: TabsProps['items'] = [
    {
      key: 'distributionSettings',
      label: '配信設定',
      children: (
        <Suspense fallback={<>Loading...</>}>
          <DistributionSettings />
        </Suspense>
      )
    },
    {
      key: 'mySaved',
      label: 'よく使う文章',
      children: (
        <Suspense fallback={<>Loading...</>}>
          <MySaved />
        </Suspense>
      )
    } ,
    {
      key: 'plugInCode',
      label: '差込みコード',
      children: (
        <Suspense fallback={<>Loading...</>}>
          <PlugInCode />
        </Suspense>
      )
    }
  ]

  const tabsTextEditor: TabsProps['items'] = [
    {
      key: 'myTemplates',
      label: 'Myテンプレート',
      children: (
        <Suspense fallback={<>Loading...</>}>
          <MyTemplates />
        </Suspense>
      )
    }
  ]
  
  const getTabs = (pathName: string) => {
    switch (pathName) {
      case PagePath.TEXT_EDITOR:
        return [...tabsShared, ...tabsTextEditor]
      default:
        return tabsShared
    }
  }

  return (
    <Tabs
      activeKey={activeKey}
      onChange={onChange}
      items={getTabs(pathname)}
      tabBarStyle={{ backgroundColor: '#fafafa', margin: 0 }}
      type='card'
      className="w-full [&_.ant-tabs-nav]:w-full [&_.ant-tabs-nav-wrap]:flex-wrap [&_.ant-tabs-nav-wrap]:justify-start [&_.ant-tabs-nav-list]:flex-wrap [&_.ant-tabs-nav-list]:w-full [&_.ant-tabs-tab]:m-1 [&_.ant-tabs-tab]:flex-shrink-0 [&_.ant-tabs-nav-wrap]:!overflow-visible"
    />
  )
}

export default TabBar
