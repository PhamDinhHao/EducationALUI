import React, { useState } from 'react'

import { cn } from '@/shared/utils'

type Tab = {
  key: TabKey
  name: string
}

const enum TabKey {
  blocks = 'blocks',
  layers = 'layers-container',
  styles = 'styles-container',
  traits = 'trait-container'
}

const tabs: Tab[] = [
  {
    key: TabKey.blocks,
    name: 'ブロック'
  },
  // {
  //   key: TabKey.layers,
  //   name: 'Layers'
  // },
  {
    key: TabKey.styles,
    name: 'スタイル'
  },
  {
    key: TabKey.traits,
    name: '属性'
  }
] as const

const Sidebar: React.FC = React.memo(function Sidebar() {
  const [activeTab, setActiveTab] = useState<TabKey>(TabKey.blocks)

  return (
    <div className='flex h-full flex-col'>
      <div className='sticky top-0 z-10 flex w-full gap-2 bg-white'>
        {tabs.map((tab) => (
          <button
            className={cn('p-2', { 'text-blue-700': tab.key === activeTab })}
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            type='button'
          >
            {tab.name}
          </button>
        ))}
      </div>
      <div className='z-0 flex-grow'>
        <div className={cn(TabKey.blocks === activeTab ? 'bg-white text-black' : 'hidden')} id='blocks' />
        <div className={cn(TabKey.styles === activeTab ? 'bg-white text-black' : 'hidden')} id='styles-container' />
        <div className={cn(TabKey.traits === activeTab ? 'bg-white text-black' : 'hidden')} id='trait-container' />
      </div>
    </div>
  )
})

export default Sidebar
