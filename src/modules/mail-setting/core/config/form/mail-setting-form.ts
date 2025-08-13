import { Encryption } from '@/modules/mail-setting/core/enum/encryption.enum'
import { z } from 'zod'

export const initFormMailSetting = {
  fromName: '',
  fromAddress: '',
  username: '',
  password: '',
  host: '',
  port: '',
  encryption: Encryption.NONE,
  ccEmail: null
}

export const MailSettingSchema = z
  .object({
    id: z.union([z.string(), z.number()]).optional(),
    fromName: z.string().min(1, '表示名は必須です'),
    fromAddress: z.string().min(1, 'メールアドレスは必須です').email('有効なメールアドレスを入力してください'),
    username: z.string().min(1, 'メーザー名は必須です'),
    password: z.string(),
    host: z.string().min(1, 'メールサーバーは必須です'),
    port: z.string().min(1, 'ポートは必須です'),
    encryption: z.string().optional(),
    ccEmail: z.string().optional().nullable()
      .refine((val) => {
        if (!val) return true;
        const emails = val.split(',').map(email => email.trim());
        return emails.every(email => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(email);
        });
      }, 'CCメールは有効なメールアドレスをカンマ区切りで入力してください')
  })
  .superRefine((data, ctx) => {
    if (!data.id && !data.password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'パスワードは必須です',
        path: ['password']
      })
    }
  })

export type TMailSetting = z.infer<typeof MailSettingSchema>
