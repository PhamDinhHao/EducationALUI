import { Recipient } from '@/modules/mngRecipients/core/types/recipient.type'
import { bulkAddGroup, getRecipientsList } from '@/modules/mngRecipients/services/recipient.service'
import { Pagination } from '@/shared/core/types/common.type'

export const fetchRecipientList = async (params: { [key: string]: any }) => {
  try {
    const res = await getRecipientsList(params)
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

export const bulkAddGroupRecipient = async (body: { [key: string]: any }) => {
  try {
    const res = await bulkAddGroup(body)
    return res
  } catch (err) {
    return null
  }
}
