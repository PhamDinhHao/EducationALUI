import { Mail } from '@/modules/mail-setting/core/types/mail-setting.type'
import { getMailSettingList } from '@/modules/mail-setting/services/mail-setting.service'
import { Pagination } from '@/shared/core/types'

export async function fetchMailSettingList(params: { [key: string]: any }) {
  try {
    const res = await getMailSettingList(params)
    if (res?.data) {
      const { pagination, data } = res.data
      return {
        pagination: pagination as Pagination,
        data: data as Mail[]
      }
    }

    return null
  } catch (err) {
    return null
  }
}
