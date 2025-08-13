import { z } from 'zod'

export const SignInSchema = z.object({
  email: z.string({ required_error: 'Email is required' }).email({ message: 'Email is invalid' }),
  password: z
    .string({ required_error: 'Password is required', invalid_type_error: 'Password is invalid' })
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(20, { message: 'Password must be less than 20 characters long' })
})

export type SignInSchemaType = z.infer<typeof SignInSchema>
