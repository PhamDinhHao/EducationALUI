import { Pagination } from '@/shared/core/types'
import { ReserveMail } from '@/modules/mail/services/reserveMail.type'
import { getReservationList } from '@/shared/services/reservation.service'

export const fetchReservationList = async (params: { [key: string]: any }) => {
  try {
    const res = await getReservationList(params)
    if (res?.data) {
      const { pagination, data } = res.data
      return {
        pagination: pagination as Pagination,
        data: data as ReserveMail[]
      }
    }

    return null
  } catch (err) {
    return null
  }
}
