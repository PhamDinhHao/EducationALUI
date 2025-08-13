import { Encryption } from "@/shared/core/enum/encryption.enum"

export type Mail = {
  id: number
  fromName: string
  fromAddress: string
  username: string
  password: string
  host: string
  port: string
  encryption: Encryption
  ccEmail: string | null
}
