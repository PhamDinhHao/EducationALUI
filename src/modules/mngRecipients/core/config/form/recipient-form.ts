/* eslint-disable @typescript-eslint/naming-convention */
import { RecipientForm } from '@/modules/mngRecipients/core/types/recipient.type'
import { z } from 'zod'

export const initialRecipientForm: RecipientForm = {
  email: '',
  situation: 1,
  name: '',
  groupId: []
}

export const RegistrationRecipientSchema = z.object({
  email: z.string({ required_error: 'メールアドレスを入力してください' }).email({ message: 'メールアドレスの形式が正しくありません' }),
  situation: z.coerce.number().int(),
  name: z.string().optional().nullable(),
  groupId: z.array(z.number()).optional(),
})

export type TRegistrationRecipient = z.infer<typeof RegistrationRecipientSchema>

