import { useEffect } from 'react'
import useFetchDataTable from '@/shared/hooks/useFetchDataTable'
import { Reservation } from '@/shared/core/types/reservation.type'
import { fetchReservationList } from '@/shared/server-action/reservation-list'
import DraftTableList from '@/modules/mail/components/Table/DraftTableList'
const DraffEmailPage: React.FC = () => {
  const { queryParams, dataTable, pagination, onFetch, onSetQueryParams } = useFetchDataTable<Reservation>(fetchReservationList)
  const defaultParams = {
    page: 1,
    isDraft: 1,
  }
  useEffect(() => {
    onFetch(defaultParams)
    onSetQueryParams(defaultParams)
  }, [])

  return (
    <div>
      <DraftTableList dataTable={dataTable} onFetch={onFetch} pagination={pagination} setQueryParams={onSetQueryParams} queryParams={queryParams}/>
    </div>
  )
}

export default DraffEmailPage
