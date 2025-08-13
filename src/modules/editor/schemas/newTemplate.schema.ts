import { z } from 'zod'

export const NewTemplateSchema = z.object({
  name: z.string({ required_error: 'テンプレート名を入力してください' }).nonempty('テンプレート名を入力してください')
})

export type TNewTemplate = z.infer<typeof NewTemplateSchema>
