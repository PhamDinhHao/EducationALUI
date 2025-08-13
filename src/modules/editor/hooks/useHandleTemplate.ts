import { useCallback } from 'react'
import dayjs from 'dayjs'
import { useBoundStore } from '@/shared/stores'
import { DEFAULT_TIME, DELIVERY_TYPES, TemplateType } from '@/modules/editor/core/enum/distribution-setting.enum'
import { fetchTemplateDetail } from '@/shared/server-action/template-list'

const useHandleTemplate = () => {
  const { setFromAddress,setContent, setSubject, setDeliveryType, setDate, setHours, setMinutes, setAddressToId, setAddressTo, setAddressToType } = useBoundStore()

  const handleApplicable = useCallback(async (templateId: string) => {
    const res = await fetchTemplateDetail(templateId)
    if (res) {
      const { content, subject, addressToType, date, hour, minute, addressToId, addressTo, emailSettingId } = res
      setFromAddress(emailSettingId)
      setContent(content, TemplateType.TEXT)
      setSubject(subject)
      setDate(dayjs(date))
      setHours(hour)
      setMinutes(minute)
      setDeliveryType(date ? DELIVERY_TYPES.SCHEDULED : DELIVERY_TYPES.IMMEDIATE)
      setDate(dayjs(date) ? dayjs(date) : dayjs(new Date()))
      setHours(hour ? hour : DEFAULT_TIME.HOURS)
      setMinutes(minute ? minute : DEFAULT_TIME.MINUTES)
      setAddressToId(addressToId)
      setAddressTo(addressTo)
      setAddressToType(addressToType)
    }
  }, [])

  return {
    onApplicable: handleApplicable
  }
}

export default useHandleTemplate
