import { Asset } from '@/modules/editor/types'
import { getAssetsList } from '@/modules/editor/Service/asset.service'
import { Pagination } from '@/shared/core/types'

export const fetchAssetList = async (params: { [key: string]: any }) => {
  try {
    const res = await getAssetsList(params)
    if (res?.data) {
      const { pagination, data } = res.data
      return {
        pagination: pagination as Pagination,
        data: data as Asset[]
      }
    }

    return null
  } catch (err) {
    return null
  }
}
