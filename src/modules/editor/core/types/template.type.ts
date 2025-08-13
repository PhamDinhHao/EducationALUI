import { TemplateType } from "@/modules/editor/core/enum/distribution-setting.enum"

export type Template = {
  id: number
  name: string
  subject: string
  content: string
  type: TemplateType
  image: string | null
  addressTo: string
  addressToId: number
  addressToType: string
  sourceAddress: number
  date: string
  hour: string
  minute: string
  createdAt: string
  updatedAt: string
}

export type TemplateData = {
  name: string
  subject: string
  content: string
  type: TemplateType
  image: string | null
  deliveryType: string
  emailSettingId: string | number | null
  addressTo: string | number
  addressToType: string | null
  scheduledAt: string | null
}