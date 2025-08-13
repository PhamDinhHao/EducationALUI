import { z } from "zod"

export const initFormRecipientFilter = {
  name: ''
}

export const RecipientFilterSchema = z.object({
  name: z.string().min(1, 'フィルタ名を入力してください')
})

export type TRecipientFilter = z.infer<typeof RecipientFilterSchema>
