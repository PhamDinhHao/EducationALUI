import { client } from '@/plugins/axios/request'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string
      }>
    }
  }>
}

export class GeminiService {
  private static async makeRequest(
    messages: ChatMessage[], 
    subject: string, 
    imageFile?: File
  ): Promise<string> {
    try {
      let requestBody: any

      if (imageFile) {
        const base64Image = await this.fileToBase64(imageFile)
        
        requestBody = {
          messages,
          subject,
          imageFile: {
            mimeType: imageFile.type,
            base64Data: base64Image
          }
        }
      } else {
        requestBody = {
          messages,
          subject
        }
      }

      const response = await client.post('/ai/generate', requestBody)
      
      if (response.data?.data?.result) {
        return response.data.data.result
      } else {
        throw new Error('Không nhận được phản hồi từ AI')
      }
    } catch (error) {
      console.error('Lỗi khi gọi AI API:', error)
      throw new Error('Không thể kết nối với AI. Vui lòng thử lại sau.')
    }
  }

  // Convert file sang base64
  private static fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const result = reader.result as string
        // Lấy phần base64 sau dấu phẩy để gửi cho backend
        const base64Data = result.split(',')[1]
        resolve(base64Data)
      }
      reader.onerror = error => reject(error)
    })
  }

  static async chat(messages: ChatMessage[], subject: string, imageFile?: File): Promise<string> {
    // Validation: Ngăn chặn gọi AI với messages rỗng
    if (!messages || messages.length === 0) {
      throw new Error('Không thể gửi tin nhắn rỗng. Vui lòng nhập nội dung.')
    }

    // Validation: Kiểm tra content của messages
    const validMessages = messages.filter(msg => msg.content && msg.content.trim())
    if (validMessages.length === 0) {
      throw new Error('Nội dung tin nhắn không được rỗng. Vui lòng nhập câu hỏi.')
    }

    return this.makeRequest(validMessages, subject, imageFile)
  }

  // 👉 Thêm method generateText cho dễ dùng
  static async generateText(prompt: string): Promise<string> {
    const messages: ChatMessage[] = [
      { role: 'user', content: prompt, timestamp: new Date() }
    ]
    return this.chat(messages, "Text Generation")
  }
}