import { useEffect, useState } from 'react'
import _ from 'lodash'
import { RecipientFilter } from '@/modules/group/core/types/recipient-filter.type'
import { initFormRecipientFilter, TRecipientFilter } from '@/modules/group/core/config/form/recipient-filter-form'
import { getRecipientFilterPreview } from '@/modules/group/services/recipient-filter.service'
import { handleTransformCondition, transformToSnakeCase } from '@/modules/group/utils'

const useFetchDataPreview = (filter: any, editData: RecipientFilter | null) => {
  const [initData, setInitData] = useState<TRecipientFilter>(initFormRecipientFilter)
  const [conditions, setConditions] = useState<any>(null)
  const [resultFilter, setResultFilter] = useState<any>(null)

  useEffect(() => {
    (async () => {
      const dataSource = editData || filter
      setInitData((prev) => ({ ...prev, name: dataSource.name || '' }))
      const newFilter = Object.values(dataSource.conditions)
        .flat()
        .map((condition) => handleTransformCondition(condition))
        .map((condition) => transformToSnakeCase(condition))

      const transformValues = {
        conditions: newFilter
      }
      const res = await getRecipientFilterPreview(transformValues)
      if (res.data.data) {
        const { conditions, resultFilter } = res.data.data
        setConditions(conditions)
        setResultFilter(resultFilter)
      }
    })()
  }, [editData, filter])

  return {
    initData,
    conditions,
    resultFilter
  }
}

export default useFetchDataPreview
