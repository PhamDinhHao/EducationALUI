import { initFormMailSetting, TMailSetting } from "@/modules/mail-setting/core/config/form/mail-setting-form"
import { Mail } from "@/modules/mail-setting/core/types/mail-setting.type"
import { useEffect, useState } from "react"

const useInitFormData = (data: Mail | undefined) => {
  const [initFormData, setInitFormData] = useState<TMailSetting>(initFormMailSetting)

  useEffect(() => {
    if (data) {
      setInitFormData({ ...data, encryption: data.encryption || '' })
    } else {
      setInitFormData(initFormMailSetting)
    }
  }, [data])

  return {
    initFormData,

  }
}

export default useInitFormData