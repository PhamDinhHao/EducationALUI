import { useState } from 'react'

export type FilterState = {
  [filterKey.TEXT]: boolean
  [filterKey.HTML]: boolean
  [filterKey.TYPE]: string[]
}

export const filterKey = {
  TEXT: 'TEXT',
  HTML: 'HTML',
  TYPE: 'type'
} as const

const useHandleFilterHistory = () => {
  const [filter, setFilter] = useState<FilterState>({
    [filterKey.TEXT]: true,
    [filterKey.HTML]: true,
    [filterKey.TYPE]: ['TEXT', 'HTML']
  })

  const handleChangeFilter = (key: string) => (value: boolean) => {
    setFilter((prev) => {
      const typeMap = {
        [filterKey.TEXT]: 'TEXT',
        [filterKey.HTML]: 'HTML'
      } as const

      const newTypes = value 
        ? [...new Set([...prev[filterKey.TYPE], typeMap[key as keyof typeof typeMap]])]
        : prev[filterKey.TYPE].filter(type => type !== typeMap[key as keyof typeof typeMap])

      return {
        ...prev,
        [key]: value,
        [filterKey.TYPE]: newTypes
      }
    })
  }

  return {
    filter,
    onChangeFilter: handleChangeFilter
  }
}

export default useHandleFilterHistory
