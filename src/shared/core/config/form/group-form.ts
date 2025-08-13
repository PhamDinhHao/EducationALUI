import { z } from 'zod'

export const GroupSchema = z.object({
  name: z.string().optional(),
})

export type TGroup = z.infer<typeof GroupSchema>