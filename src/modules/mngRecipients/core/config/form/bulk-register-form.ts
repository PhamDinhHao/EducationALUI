import { TypeImport } from '@/modules/mngRecipients/core/enum/type-import.enum'
import { FormValuesBulkRegister } from '@/modules/mngRecipients/core/types/recipient.type'
import { z } from 'zod'

export const initFormBulkRegister: FormValuesBulkRegister = {
  file: null,
  importType: TypeImport.INSERT,
  groupId: ''
}

export const BulkRegistrationSchema = z.object({
  file: z.instanceof(File, { message: 'CSVファイルがアップロードされていません。' }).refine((file) => file?.size <= 30 * 1024 * 1024, {
    message: 'ファイルサイズは30MB以下にしてください。'
  }),
  importType: z.nativeEnum(TypeImport),
  groupId: z.string().optional()
})

export type BulkRegistrationSchema = z.infer<typeof BulkRegistrationSchema>
