import { z } from 'zod'

export const SignatureSettingSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  signature: z.string().min(1, '署名は必須です')
})

export type TSignatureSetting = z.infer<typeof SignatureSettingSchema>
