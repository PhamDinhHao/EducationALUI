import { z } from 'zod';

export const TestMailFormSchema = z.object({
  emailSettingId: z.union([
    z.number().min(1, 'メール設定は必須です'),
    z.string().min(1, 'メール設定は必須です')
  ]),
  email: z
  .string()
  .optional()
  .refine(
    (value) => {
      if (!value) return true;
      const emails = value.split(',').map(email => email.trim());
      return emails.length <= 5 && emails.every(email => 
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      );
    }, 
    { message: 'メールアドレスは最大5つまでで、正しい形式である必要があります' }
  ),
  subject: z.string().min(1, '件名は必須です'),
  content: z.string().min(1, '本文は必須です'),
});

export type TTestMailForm = z.infer<typeof TestMailFormSchema>
