import { z } from "zod"

export const initFormGroup = {
  name: ''
}

export const RegistrationGroupSchema = z.object({
  name: z.string().min(1, 'グループ名は必須です')
})

export type TRegistrationGroup = z.infer<typeof RegistrationGroupSchema>
