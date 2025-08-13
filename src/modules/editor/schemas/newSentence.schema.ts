import { z } from 'zod'

export const NewSentenceSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  content: z.string().min(1, { message: 'Content is required' })
})

export type TNewSentence = z.infer<typeof NewSentenceSchema>
