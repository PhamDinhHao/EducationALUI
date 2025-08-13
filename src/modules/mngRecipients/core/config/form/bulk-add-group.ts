import { z } from "zod"

export const RegistrationRecipientSchemaGroup = z.object({
  groupId: z.string(),
  recipientId: z.string()
})

export type TRegistrationRecipientGroup = z.infer<typeof RegistrationRecipientSchemaGroup>