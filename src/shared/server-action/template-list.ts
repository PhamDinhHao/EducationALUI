import { getTemplatesList } from '@/modules/templates/services/template.service'
import { Pagination } from '@/shared/core/types'
import { Template } from '@/shared/core/types/template.type'
import { getTemplate } from '@/shared/services/template.service'

export const fetchTemplateList = async (params: { [key: string]: any }) => {
  try {
    const res = await getTemplatesList(params)
    if (res?.data) {
      const { pagination, data } = res.data
      return {
        pagination: pagination as Pagination,
        data: data as Template[]
      }
    }

    return null
  } catch (err) {
    return null
  }
}

export const fetchTemplateDetail = async (templateId: string) => {
  try {
    const res = await getTemplate(templateId)
    if (res?.data) {
      return res.data.data as Template
    }

    return null
  } catch (err) {
    return null
  }
}

