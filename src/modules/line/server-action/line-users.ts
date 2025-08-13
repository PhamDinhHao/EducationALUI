import { LineUser } from '@/modules/line/core/types/line-user.type'
import { getFollowerList } from '@/modules/line/services/line-user-list.service'
import { Pagination } from '@/shared/core/types'

export const fetchFollowerList = async (params: { [key: string]: any }) => {
  try {
    const res = await getFollowerList(params)
    if (res?.data) {
      const { pagination, data } = res.data
      return {
        pagination: pagination as Pagination,
        data: data as LineUser[]
      }
    }

    return null
  } catch (err) {
    return null
  }
}
