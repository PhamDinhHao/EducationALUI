import { z } from 'zod'

export const SignUpSchema = z
  .object({
    name: z.string().min(1, { message: 'Họ và tên không được để trống' }),
    email: z.string().min(1, { message: 'Email không được để trống' }).email({ message: 'Email không hợp lệ' }),
    password: z
      .string({ invalid_type_error: 'Mật khẩu không hợp lệ' })
      .min(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' })
      .max(20, { message: 'Mật khẩu không được quá 20 ký tự' }),
    confirmPassword: z
      .string({ invalid_type_error: 'Mật khẩu không hợp lệ' })
      .min(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' })
      .max(20, { message: 'Mật khẩu không được quá 20 ký tự' })
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Mật khẩu xác nhận không khớp'
  })

export type SignUpSchemaType = z.infer<typeof SignUpSchema>
