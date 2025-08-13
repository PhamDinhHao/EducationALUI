import { initQueryParams } from '@/modules/mngRecipients/core/constants'
import { getDefaultSearchType } from '@/modules/mngRecipients/utils'
import { useCallback, useState } from 'react'

export type FilterState = {
  criteria: {
    [key: number]: any[]
    groupId: string | number
    situation: string | number
  }
}

const useHandleFilterRecipient = () => {
  const [filter, setFilter] = useState<FilterState>(initQueryParams)

  const handleAddGroupSearch = () => {
    const newGroupIndex = Object.keys(filter.criteria).length
    setFilter((prev) => ({
      ...prev,
      criteria: {
        ...prev.criteria,
        [newGroupIndex]: [{ id: 1, field: 'email', searchValue: '', searchType: 'includes' }]
      }
    }))
  }

  const handleAddCriteria = (groupId: number) => {
    setFilter((prev) => ({
      ...prev,
      criteria: {
        ...prev.criteria,
        [groupId]: [
          ...prev.criteria[groupId],
          {
            id: prev.criteria[groupId].length + 1,
            field: 'email',
            searchValue: '',
            searchType: 'includes'
          }
        ]
      }
    }))
  }

  const handleRemoveCriteria = useCallback((groupId: number, criteriaId: number) => {
    return () => {
      setFilter((prev) => ({
        ...prev,
        criteria: {
          ...prev.criteria,
          [groupId]: prev.criteria[groupId].filter((item) => item.id !== criteriaId)
        }
      }))
    }
  }, [])

  const handleReset = useCallback(() => {
    setFilter({
      criteria: {
        0: [{ id: 1, field: 'email', searchValue: '', searchType: 'includes' }],
        groupId: '',
        situation: ''
      }
    })
  }, [])

  const handleChangeFilter = useCallback(
    (groupId: number, criteriaId: number, field: string) => {
      return (value: any) => {
        const valueUpdate = value && typeof value === 'object' && 'target' in value 
          ? value.target.value 
          : value;

        setFilter((prev) => ({
          ...prev,
          criteria: {
            ...prev.criteria,
            [groupId]: prev.criteria[groupId].map((item) =>
              item.id === criteriaId 
                ? { 
                    ...item, 
                    [field]: valueUpdate,
                    ...(field === 'field' && item.field !== valueUpdate ? { searchValue: '', searchType: getDefaultSearchType(valueUpdate) } : {})
                  } 
                : item
            )
          }
        }))
      }
    },
    []
  )

  const handleChangeBaseFilter = useCallback((field: string, buttonValue?: any) => {
    return (value: any) => {
      let valueUpdate;
      
      if (buttonValue !== undefined) {
        valueUpdate = buttonValue;
      } else {
        valueUpdate = value;
      }

      setFilter((prev) => ({
        ...prev,
        criteria: {
          ...prev.criteria,
          [field]: valueUpdate
        }
      }))
    }
  }, [])

  return {
    filter,
    onSetFilter: setFilter,
    onAddGroupSearch: handleAddGroupSearch,
    onAddCriteria: handleAddCriteria,
    onRemoveCriteria: handleRemoveCriteria,
    onChangeFilter: handleChangeFilter,
    onChangeBaseFilter: handleChangeBaseFilter,
    onReset: handleReset,
  }
}

export default useHandleFilterRecipient
