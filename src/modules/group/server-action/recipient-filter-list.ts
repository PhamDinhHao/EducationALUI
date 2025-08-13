import { RecipientFilter } from '@/modules/group/core/types/recipient-filter.type'
import { getRecipientFilter } from '@/modules/group/services/recipient-filter.service'
import { Pagination } from '@/shared/core/types'

export const fetchRecipientFilterList = async (params: { [key: string]: any }) => {
  try {
    const res = await getRecipientFilter(params)
    if (res?.data) {
      const { pagination, data } = res.data
      return {
        pagination: pagination as Pagination,
        data: data as RecipientFilter[]
      }
    }

    return null
  } catch (err) {
    return null
  }
}
