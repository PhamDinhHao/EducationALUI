import { Recipient } from '@/modules/mngRecipients/core/types/recipient.type'
import { getTrashList } from '@/modules/mngRecipients/services/trash.service'
import { Pagination } from '@/shared/core/types/common.type'

export const fetchTrashList = async (params: { [key: string]: any }) => {
  try {
    const res = await getTrashList(params)
    if (res?.data) {
      const { pagination, data } = res.data
      return {
        pagination: pagination as Pagination,
        data: data as Recipient[]
      }
    }

    return null
  } catch (err) {
    return null
  }
}