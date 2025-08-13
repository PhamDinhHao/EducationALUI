import { initialRecipientForm } from "@/modules/mngRecipients/core/config/form/recipient-form"
import { Recipient, RecipientForm } from "@/modules/mngRecipients/core/types/recipient.type"
import { useEffect, useState } from "react"

const useInitFormRecipient = (data?: Recipient) => {
  const [initFormData, setInitFormData] = useState<RecipientForm>(initialRecipientForm)
  const [checkedIds, setCheckedIds] = useState<(string | number)[]>([])

  useEffect(() => {
    if (data) {
      setInitFormData(data)
      if (data.groups) {
        const groupIds = data.groups.map(group => group.id)
        setCheckedIds(groupIds)
      }
    } else {
      setInitFormData(initialRecipientForm)
      setCheckedIds([])
    }
  }, [data])

  return {
    initFormData,
    checkedIds,
    onSetCheckedIds: setCheckedIds
  }
}

export default useInitFormRecipient