import { FormValuesBulkDelete } from "@/modules/mngRecipients/core/types/recipient.type";
import { z } from "zod";

export const initFormBulkDelete: FormValuesBulkDelete = {
  file: null
}

export const BulkDeleteSchema = z.object({
  file: z.instanceof(File, { message: 'CSVファイルがアップロードされていません。' }).refine((file) => file?.size <= 30 * 1024 * 1024, {
    message: 'ファイルサイズは30MB以下にしてください。'
  })
})

export type BulkDeleteSchema = z.infer<typeof BulkDeleteSchema>
