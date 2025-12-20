import { z } from 'zod'

export const SignInSchema = z.object({
  email: z.string({ required_error: 'Email không được để trống' }).email({ message: 'Email không hợp lệ' }),
  password: z
    .string({ required_error: 'Mật khẩu không được để trống', invalid_type_error: 'Mật khẩu không hợp lệ' })
    .min(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' })
    .max(20, { message: 'Mật khẩu không được quá 20 ký tự' })
})

export type SignInSchemaType = z.infer<typeof SignInSchema>
