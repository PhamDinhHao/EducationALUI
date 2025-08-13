import { EnumTypeName } from "@/shared/core/types/common.type";

export enum Encryption {
  TLS = 'tls',
  SSL = 'ssl',
  NONE = ''
}

export const EncryptionEnumUsingName: EnumTypeName = {
  [Encryption.TLS]: 'TLS',
  [Encryption.SSL]: 'SSL',
  [Encryption.NONE]: 'なし'
} 