import { z } from 'zod'

export const SignUpSchema = z
  .object({
    name: z.string().min(1, { message: 'Full name is required' }),
    email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Email is invalid' }),
    password: z
      .string({ invalid_type_error: 'Password is invalid' })
      .min(8, { message: 'Password must be at least 8 characters long' })
      .max(20, { message: 'Password must be less than 20 characters long' }),
    confirmPassword: z
      .string({ invalid_type_error: 'Password is invalid' })
      .min(8, { message: 'Password must be at least 8 characters long' })
      .max(20, { message: 'Password must be less than 20 characters long' })
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match'
  })

export type SignUpSchemaType = z.infer<typeof SignUpSchema>
