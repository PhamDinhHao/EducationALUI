import { Distribution } from '@/modules/mail/core/types/distribution-history.type'
import { getDistributionHistoryList } from '@/modules/mail/services/distribution-history.service'
import { Pagination } from '@/shared/core/types/common.type'

export const fetchDistributionHistoryList = async (params: { [key: string]: any }) => {
  try {
    const res = await getDistributionHistoryList(params)
    if (res?.data) {
      const { pagination, data } = res.data
      return {
        pagination: pagination as Pagination,
        data: data as Distribution[]
      }
    }

    return null
  } catch (err) {
    return null
  }
}
