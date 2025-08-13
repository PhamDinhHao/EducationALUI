import ReservationTable from '@/modules/mail/components/Table/ReservationTable'
import { Reservation } from '@/shared/core/types/reservation.type'
import useFetchDataTable from '@/shared/hooks/useFetchDataTable'
import { fetchReservationList } from '@/shared/server-action/reservation-list'
import { useEffect } from 'react'

const ReservePage: React.FC = () => {
  const { queryParams, onFetch, dataTable, pagination, onSetQueryParams } = useFetchDataTable<Reservation>(fetchReservationList)

  const defaultParams = {
    page: 1,
    isDraft: 0,
    ...queryParams
  }
  useEffect(() => {
    onSetQueryParams(defaultParams)
    onFetch(defaultParams)
  }, [])
  return (
    <div className='p-4'>
      <ReservationTable queryParams={queryParams} onFetch={onFetch} dataTable={dataTable} pagination={pagination} onSetQueryParams={onSetQueryParams} />
    </div>
  )
}

export default ReservePage
