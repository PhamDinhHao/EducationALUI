import { getGroupList } from "@/modules/group/services/group-list.service"
import { Group, Pagination } from "@/shared/core/types"

export const fetchGroupList = async (params: { [key: string]: any }) => {
  try {
    const res = await getGroupList(params)
    if (res?.data) {
      const { pagination, data } = res.data
      return {
        pagination: pagination as Pagination,
        data: data as Group[]
      }
    }

    return null
  } catch (err) {
    return null
  }
}
