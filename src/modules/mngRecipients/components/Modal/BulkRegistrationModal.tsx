import { useCallback, useState } from 'react'
import { Modal, Tabs } from 'antd'
import type { TabsProps } from 'antd'
import BulkDelete from '@/modules/mngRecipients/components/Tab/BulkDelete'
import BulkRegistration from '@/modules/mngRecipients/components/Tab/BulkRegistration'
import { Group } from '@/shared/core/types/group.type'

type Props = {
  isOpen: boolean
  onRefetch: any
  groupList: Group[]
  onFetchGroupList: () => void
  onClose: () => void
}

const BulkRegistrationModal: React.FC<Props> = ({ isOpen, onRefetch, groupList, onFetchGroupList, onClose }) => {
  const [activeTab, setActiveTab] = useState('1')
  const handleSubmit = () => {
    const form = document.querySelector(`form[data-tab="${activeTab}"]`) as HTMLFormElement
    if (form) {
      form.requestSubmit()
    }
  }

  const handleClose = useCallback(() => {
    setActiveTab('1')
    onRefetch()
  }, [])

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '一括登録',
      children: <BulkRegistration onClose={handleClose} groupList={groupList} onFetchGroupList={onFetchGroupList} />
    },
    {
      key: '2',
      label: '一括削除（ゴミ箱へ移動）',
      children: <BulkDelete onClose={handleClose} />
    }
  ]

  return (
    <Modal
      cancelText='一括登録'
      destroyOnClose
      okButtonProps={{ danger: true }}
      okText='登録'
      onCancel={onClose}
      onOk={handleSubmit}
      open={isOpen}
      title='一括登録'
    >
      <Tabs items={items} type='card' activeKey={activeTab} onChange={(key) => setActiveTab(key)} />
    </Modal>
  )
}

export default BulkRegistrationModal
