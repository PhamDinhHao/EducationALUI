import { useCallback, useState } from "react"
import { Mail } from "@/modules/mail-setting/core/types/mail-setting.type"

const useHandleFormSettingMail = (onSetModalName: (name: string) => void) => {
  const [editData, setEditData] = useState<Mail>()

  const handleCreate = useCallback(() => {
    setEditData(undefined)
    onSetModalName('mailSetting')
  }, [])

  const handleEditData = useCallback((item: Mail | undefined) => {
    return () => {
      setEditData(item)
      onSetModalName('mailSetting')
    }
  }, [])

  const handleSignature = useCallback((item: Mail | undefined) => {
    return () => {
      setEditData(item)
      onSetModalName('signatureSetting')
    }
  }, [])

  return {
    editData,
    onCreate: handleCreate,
    onEditData: handleEditData,
    onSignature: handleSignature
  }
}

export default useHandleFormSettingMail