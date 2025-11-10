import { message } from 'antd'
import type { UploadFile } from 'antd/es/upload/interface'

export const getBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })

export const beforeUpload = (file: File): boolean => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    message.error('Chỉ được upload file ảnh!')
    return false
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('Ảnh phải nhỏ hơn 2MB!')
    return false
  }
  return true
}

export const normalizeFile = (e: any): UploadFile[] => {
  if (Array.isArray(e)) {
    return e
  }
  return e?.fileList
}

