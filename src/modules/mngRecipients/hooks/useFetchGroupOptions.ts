import { useEffect, useState } from 'react'
import { fetchGroupList } from '@/shared/server-action/group-list'
import { Group } from '@/shared/core/types/group.type'
import { OptionSelect } from '@/shared/core/types/common.type'

const useFetchGroupOptions = (onFetch: (params: { [key: string]: any }) => void, onResetModalName: () => void) => {
  const [optionsGroup, setOptionsGroup] = useState<OptionSelect[]>([])
  const [group, setGroup] = useState<Group[]>([])

  const getGroupName = (groupId: string | number): string => {
    if (!groupId) return '全読者'
    return group?.find(g => g.id === groupId)?.name || ''
  }

  const fetchTableRecipient = () => {
    onFetch({ page: 1 })
    onResetModalName()
  }

  const handleFetchGroupList = async () => {
    const resGroup = await fetchGroupList({ perPage: 10 })
    if (resGroup) {
      setGroup(resGroup.data)
    }
  }

  useEffect(() => {
    (async () => {
      const [, resGroup] = await Promise.all([onFetch({ page: 1 }), fetchGroupList({ perPage: 100 })])

      if (resGroup) {
        const options = resGroup.data.map((group: Group) => ({ value: group.id, label: group.name }))
        options.unshift({ value: '', label: '全読者' })
        setOptionsGroup(options)
        setGroup(resGroup.data)
      }
    })()
  }, [])
  
  return {
    optionsGroup,
    getGroupName,
    groupList: group,
    onFetchTable: fetchTableRecipient,
    onFetchGroupList: handleFetchGroupList
  }
}

export default useFetchGroupOptions
