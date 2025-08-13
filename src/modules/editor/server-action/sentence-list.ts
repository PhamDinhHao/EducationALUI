import { Sentence } from '@/modules/editor/types'
import { getSentencesList } from '@/modules/editor/Service/sentence.service'
import { Pagination } from '@/shared/core/types'

export const fetchSentenceList = async (params: { [key: string]: any }) => {
  try {
    const res = await getSentencesList(params)
    if (res?.data) {
      const { pagination, data } = res.data
      return {
        pagination: pagination as Pagination,
        data: data as Sentence[]
      }
    }

    return null
  } catch (err) {
    return null
  }
}
