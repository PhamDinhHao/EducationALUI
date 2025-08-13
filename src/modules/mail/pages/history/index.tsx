import HistoryMailFilter from '@/modules/mail/components/Filter/HistoryMailFilter'
import HistoryReportModal from '@/modules/mail/components/Modal/HistoryReportModal'
import MailHistoryTable from '@/modules/mail/components/Table/MailHistoryTable'
import { Distribution } from '@/modules/mail/core/types/distribution-history.type'
import { fetchDistributionHistoryList } from '@/modules/mail/server-action/distribution-history-list'
import useFetchDataTable from '@/shared/hooks/useFetchDataTable'
import useHandleEditData from '@/modules/mail/hooks/useHandleEditData'

const SentMailPage: React.FC = () => {
  const { onFetch, dataTable, pagination, onSetQueryParams } = useFetchDataTable<Distribution>(fetchDistributionHistoryList)
  const { modalName, editData, onSetEditData, onCloseModal } = useHandleEditData()

  return (
    <>
      <div className='p-4'>
        <HistoryMailFilter onFetch={onFetch} onSetQueryParams={onSetQueryParams} />
        <MailHistoryTable
          dataTable={dataTable}
          pagination={pagination}
          onFetch={onFetch}
          onSetEditData={onSetEditData}
        />
        {modalName === 'sentMail' && editData && (
          <HistoryReportModal isOpen={modalName === 'sentMail'} onClose={onCloseModal} data={editData} />
        )}
      </div>
    </>
  )
}

export default SentMailPage
