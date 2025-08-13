import { useState, useCallback } from 'react'
import { initQueryParams } from '@/modules/group/core/constants'
import { getDefaultSearchType } from '@/modules/group/utils'

export type FilterState = {
  conditions: {
    [key: number]: any[]
  }
}

const useHandleFilterDelivery = () => {
  const [filter, setFilter] = useState<FilterState>(initQueryParams)

  const handleAddGroupSearch = () => {
    const maxIndex = Object.keys(filter.conditions).length > 0 
      ? Math.max(...Object.keys(filter.conditions).map(Number))
      : -1
    const newGroupIndex = maxIndex + 1

    setFilter((prev) => ({
      ...prev,
      conditions: {
        ...prev.conditions,
        [newGroupIndex]: [{ id: 1, field: 'email', searchValue: '', searchType: 'includes' }]
      }
    }))
  }

  const handleAddConditions = (groupId: number) => {
    setFilter((prev) => {
      const currentConditions = prev.conditions[groupId] || [];
      const maxId = currentConditions.length > 0 
      ? Math.max(...currentConditions.map((criterion) => criterion.id))
      : 0;
      return {
        ...prev,
        conditions: {
          ...prev.conditions,
          [groupId]: [
            ...prev.conditions[groupId],
            {
              id: maxId + 1,
              field: currentConditions[0].field,
              searchValue: '',
              searchType: getDefaultSearchType(currentConditions[0].field)
            }
          ]
        }
      }
    })
  }

  const handleRemoveConditions = useCallback((groupId: number, conditionsId: number) => {
    return () => {
      setFilter((prev) => {
        const updatedGroup = prev.conditions[groupId].filter((item) => item.id !== conditionsId)
        if (updatedGroup.length === 0) {
          const { [groupId]: _, ...restConditions } = prev.conditions
          return {
            ...prev,
            conditions: restConditions
          }
        }
        return {
          ...prev,
          conditions: {
            ...prev.conditions,
            [groupId]: updatedGroup
          }
        }
      })
    }
  }, [])

  const handleChangeFilter = useCallback((groupId: number, conditionsId: number, field: string) => {
    return (value: any) => {
      const valueUpdate = value && typeof value === 'object' && 'target' in value ? value.target.value : value

      setFilter((prev) => ({
        ...prev,
        conditions: {
          ...prev.conditions,
          [groupId]: prev.conditions[groupId].map((item) =>
            item.id === conditionsId
              ? {
                  ...item,
                  [field]: valueUpdate
                }
              : item
          )
        }
      }))
    }
  }, [])

  const handleChangeBaseFilter = useCallback(
    (name: string, groupId: number) => (value: any) => {
      const valueUpdate = value && typeof value === 'object' && 'target' in value ? value.target.value : value
      setFilter((prev) => {
        if (name === 'field') {
          return {
            ...prev,
            conditions: {
              ...prev.conditions,
              [groupId]: [{
                id: 1,
                field: valueUpdate,
                searchValue: '',
                searchType: getDefaultSearchType(valueUpdate)
              }]
            }
          }
        }
        return {
          ...prev,
          [name]: valueUpdate
        }
      })
    },
    []
  )

  return {
    filter,
    onSetFilter: setFilter,
    onAddGroupSearch: handleAddGroupSearch,
    onAddConditions: handleAddConditions,
    onRemoveConditions: handleRemoveConditions,
    onChangeFilter: handleChangeFilter,
    onChangeBaseFilter: handleChangeBaseFilter
  }
}

export default useHandleFilterDelivery
