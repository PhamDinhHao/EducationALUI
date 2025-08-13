import { TypeImport } from "@/modules/mngRecipients/core/enum/type-import.enum"
import { Group } from "@/shared/core/types/group.type"

export type RecipientForm = {
  email: string
  situation: number
  name: string
  groupId?: number[]
}

export type Recipient = {
  id: number
  email: string
  createdAt: string
  situation: number
  numberOfError: number
  name: string
  groups: Group[]
}

export type FormValuesBulkRegister = {
  file: File | null
  importType: TypeImport
  groupId: string
}

export type FormValuesBulkDelete = {
  file: File | null
}
