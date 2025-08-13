import { z } from "zod"

export const initFormLine = {
  content: '',
  file: new File([], ''),
  buttons: [{ id: 0, label: '', value: '' }]
}

export const RegistrationLineSchema = z.object({
  content: z.string().min(1, 'テキストは必須です').max(500, 'テキストは500文字以内である必要があります'),
  file: z.instanceof(File).refine(value => value.type.startsWith('image/'), {
    message: 'ファイルは画像形式である必要があります',
  }),
  buttons: z.array(z.object({ 
    id: z.number(), 
    label: z.string().min(1, 'ボタンラベルは必須です'), 
    value: z.string().url('ボタン値は有効なURLである必要があります')
  }))
})

export type TRegistrationLine = z.infer<typeof RegistrationLineSchema>
