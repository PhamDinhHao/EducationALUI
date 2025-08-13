import { useEffect, useState } from "react"
import { OptionSelect } from "@/shared/core/types"
import { fetchMailSettingList } from "@/modules/mail-setting/server-action/mail-setting"

const useFetchOptionMail = () => {
  const [options, setOptions] = useState<OptionSelect[]>([])

  useEffect(() => {
    (async () => {
      const res = await fetchMailSettingList({ perPage: 100 })
      if (res?.data) {
        setOptions(res.data.map((item) => ({
          label: `${item.fromName} <${item.fromAddress}>`,
          value: item.id
        })))
      }
    })()
  }, [])
  return {
    options,
  }
}

export default useFetchOptionMail