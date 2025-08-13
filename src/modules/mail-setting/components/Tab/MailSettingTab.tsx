import MailSettingListTable from '@/modules/mail-setting/components/Table/MailSettingListTable'
import { Mail } from '@/modules/mail-setting/core/types/mail-setting.type'
import { fetchMailSettingList } from '@/modules/mail-setting/server-action/mail-setting'
import useFetchDataTable from '@/shared/hooks/useFetchDataTable'
import { useEffect } from 'react'

const MailSettingTab = () => {
  const { onFetch, dataTable, pagination } = useFetchDataTable<Mail>(fetchMailSettingList)

  useEffect(() => {
    (async () => {
      await onFetch({ page: 1 })
    })()
  }, [])

  return (
    <div className='p-4'>
      <MailSettingListTable dataTable={dataTable} pagination={pagination} onFetch={onFetch} />
    </div>
  )
}

export default MailSettingTab
