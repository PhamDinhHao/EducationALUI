import { useEffect, useState } from "react"
import { fetchGroupList } from "@/shared/server-action/group-list"
import { Group, type OptionSelect } from "@/shared/core/types"
import { getEmailSettings } from "@/shared/services/emailSetting.service"
import { getRecipientFilter } from "@/shared/services/recipientFilter.service"

const useFetchAddressOption = () => {
  const [addressOptions, setAddressOptions] = useState<OptionSelect[]>([{ value: 'all', label: '全登録者', type: 'all' }])
  const [emailOptions, setEmailOptions] = useState<OptionSelect[]>([])
  const [signatureOptions, setSignatureOptions] = useState<OptionSelect[]>([])
  useEffect(() => {
    (async () => {
      const [res, emailSetting, recipientFilter] = await Promise.all([fetchGroupList({ perPage: 100 }), getEmailSettings({ perPage: 100 }), getRecipientFilter({ perPage: 100 })])
      if (res) {
        const options: OptionSelect[] = res.data.map((group: Group) => ({ value: `group_${group.id}`, label: group.name, type: 'group' }))
        options.unshift({ value: 'all', label: '全登録者', type: 'all' }, { value: 'list', label: `リスト (${options.length}件)`, disabled: true })
        const filterOptions = recipientFilter.data.data.map((filter: any) => ({ value: `filter_${filter.id}`, label: filter.name, type: 'filter' }))
        options.push({ value: 'temp', label: `フィルタ (${filterOptions.length}件)`, disabled: true })
        options.push(...filterOptions)
        setAddressOptions(options)
      }
      if (emailSetting) {
        const options: OptionSelect[] = emailSetting.data.data.map((email: any) => ({ value: `${email.id}`, label: email.fromAddress, signature: email.signature, type: 'email' }))
        setEmailOptions(options)
        const signatureOptions: OptionSelect[] = emailSetting.data.data.map((email: any) => ({ value: `${email.id}`, label: email.signature, type: 'signature' }))
        setSignatureOptions(signatureOptions)
      }
    })()
  }, [])
  return {
    addressOptions,
    emailOptions,
    signatureOptions
  }
}

export default useFetchAddressOption