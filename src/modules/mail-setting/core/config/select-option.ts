import { Encryption, EncryptionEnumUsingName } from "@/modules/mail-setting/core/enum/encryption.enum";
import { OptionSelect } from "@/shared/core/types";

export const encryptionOptions: OptionSelect[] = [
  { value: Encryption.TLS, label: EncryptionEnumUsingName[Encryption.TLS] },
  { value: Encryption.SSL, label: EncryptionEnumUsingName[Encryption.SSL] },
  { value: Encryption.NONE, label: EncryptionEnumUsingName[Encryption.NONE] },
]