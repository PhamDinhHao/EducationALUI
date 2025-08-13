import { z } from "zod"

export const initFormLineSetting = {
  lineChannelAccessToken: '',
  lineChannelSecret: '',
  lineChannelId: ''
}

export const LineSettingSchema = z.object({
  lineChannelAccessToken: z.string().min(1, 'Channel Access Token Lineを入力してください'),
  lineChannelSecret: z.string().min(1, 'Channel Secret Lineを入力してください'),
  lineChannelId: z.string().min(1, 'Channel ID Lineを入力してください')
})

export type TLineSetting = z.infer<typeof LineSettingSchema>
