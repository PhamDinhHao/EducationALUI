import { useEffect, useState } from 'react'
import { initFormGroup, TRegistrationGroup } from '@/modules/group/core/config/form/group-form'
import { Group } from '@/shared/core/types'

const useInitFormGroup = (data: Group | undefined) => {
  const [initFormData, setInitFormData] = useState<TRegistrationGroup>(initFormGroup)

  useEffect(() => {
    if (data) {
      setInitFormData(data)
    } else {
      setInitFormData(initFormGroup)
    }
  }, [data])

  return {
    initFormData
  }
}

export default useInitFormGroup
