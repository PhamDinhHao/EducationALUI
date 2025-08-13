import { useState } from 'react'
import { FilterState } from '@/modules/group/hooks/useHandleFilterDelivery'

const useValidate = (filter: FilterState) => {
  const [errorFields, setErrorFields] = useState<Record<number, Record<any, string>>>({})

  const handleCheckDoubleField = () => {
    const newErrors: Record<number, Record<any, string>> = {}
    const fieldCounts: Record<string, { groupId: number; id: number }[]> = {}

    Object.entries(filter.conditions).forEach(([groupId, conditions]) => {
      const firstCondition = conditions[0]
      if (!fieldCounts[firstCondition.field]) {
        fieldCounts[firstCondition.field] = []
      }
      fieldCounts[firstCondition.field].push({ groupId: Number(groupId), id: firstCondition.id })
    })

    Object.entries(fieldCounts).forEach(([, entries]) => {
      if (entries.length > 1) {
        entries.forEach(({ groupId }) => {
          if (!newErrors[groupId]) {
            newErrors[groupId] = {}
          }
          newErrors[groupId]['field'] = '選択された項目は既に選択されています'
          if (Object.keys(newErrors[groupId]).length === 0) {
            delete newErrors[groupId]
          }
        })
      }
    })

    setErrorFields(newErrors)
  }

  const handleValidateForm = () => {
    let hasEmptyKeywords = false
    const newValidationErrors: Record<number, Record<number, string>> = {}

    Object.entries(filter.conditions).forEach(([groupId, conditions]) => {
      const numericGroupId = Number(groupId)
      newValidationErrors[numericGroupId] = {}
      conditions.forEach((condition) => {
        if (condition.field === 'errorCount') {
          if (!condition.searchValue.toString().trim()) {
            hasEmptyKeywords = true
            newValidationErrors[numericGroupId][condition.id] = 'いずれかの値を入力してください。'
          }
        } else if (!condition.searchValue.toString().trim()) {
          hasEmptyKeywords = true
          newValidationErrors[numericGroupId][condition.id] = '検索ワードを入力してください'
        }
      })
      if (Object.keys(newValidationErrors[numericGroupId]).length === 0) {
        delete newValidationErrors[numericGroupId]
      }
    })

    setErrorFields(newValidationErrors)
    return !hasEmptyKeywords
  }

  return {
    errorFields,
    onHandleCheckDoubleField: handleCheckDoubleField,
    onHandleValidateForm: handleValidateForm
  }
}

export default useValidate