import { Encryption } from "@/modules/mail-setting/core/enum/encryption.enum"

export type Mail = {
  id: string | number
  fromName: string
  fromAddress: string
  username: string
  password: string
  host: string
  port: string
  encryption: Encryption
  ccEmail: string | null
  signature: string
}
