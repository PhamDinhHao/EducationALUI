import { GeminiService } from './gemini.service'

/**
 * Interface định nghĩa cấu trúc tin nhắn trong hội thoại
 */
export interface ConversationMessage {
  role: 'user' | 'model'
  content: string
  timestamp: Date
  imageUrl?: string
  imageFile?: File
}

/**
 * Interface định nghĩa context được trả về
 */
export interface ConversationContext {
  summary: string
  recent: ConversationMessage[]
  sessionId: string
  subject: string
  lastUpdated: Date
}

/**
 * Interface định nghĩa cấu hình session
 */
export interface SessionConfig {
  maxRecentMessages: number
  maxSummaryLength: number
  autoSummarizeThreshold: number
}

/**
 * Class quản lý hội thoại với Gemini API
 * Tối ưu hóa việc gửi dữ liệu bằng cách sử dụng summary và recent messages
 */
export class ConversationManager {
  private sessions: Map<string, ConversationMessage[]> = new Map()
  private summaries: Map<string, string> = new Map()
  private config: SessionConfig

  constructor(config?: Partial<SessionConfig>) {
    this.config = {
      maxRecentMessages: 8,        // Số tin nhắn gần nhất giữ lại
      maxSummaryLength: 200,       // Độ dài tối đa của summary
      autoSummarizeThreshold: 15,  // Tự động summarize khi có >15 tin nhắn
      ...config
    }
  }

  /**
   * Tạo session mới cho học viên
   * @param sessionId - ID duy nhất của session
   * @param subject - Môn học của session
   */
  createSession(sessionId: string, subject: string): void {
    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, [])
      this.summaries.set(sessionId, `Bắt đầu hội thoại về ${subject}`)
    }
  }

  /**
   * Thêm tin nhắn vào lịch sử hội thoại
   * @param sessionId - ID của session
   * @param role - Vai trò (user/model)
   * @param content - Nội dung tin nhắn
   * @param imageFile - File ảnh (nếu có)
   * @param imageUrl - URL ảnh (nếu có)
   */
  addMessage(
    sessionId: string, 
    role: 'user' | 'model', 
    content: string, 
    imageFile?: File, 
    imageUrl?: string
  ): void {
    if (!this.sessions.has(sessionId)) {
      throw new Error(`Session ${sessionId} does not exist`)
    }

    const message: ConversationMessage = {
      role,
      content,
      timestamp: new Date(),
      imageFile,
      imageUrl
    }

    const session = this.sessions.get(sessionId)!
    session.push(message)

    // Tự động summarize khi có quá nhiều tin nhắn
    if (session.length > this.config.autoSummarizeThreshold) {
      this.autoSummarize(sessionId)
    }
  }

  /**
   * Lấy context tối ưu cho việc gọi Gemini API
   * @param sessionId - ID của session
   * @param subject - Môn học
   * @returns Context bao gồm summary và recent messages
   */
  getContext(sessionId: string, subject: string): ConversationContext {
    if (!this.sessions.has(sessionId)) {
      throw new Error(`Session ${sessionId} does not exist`)
    }

    const session = this.sessions.get(sessionId)!
    const summary = this.summaries.get(sessionId) || `Hội thoại về ${subject}`
    
    // Lấy tin nhắn gần nhất
    const recent = session.slice(-this.config.maxRecentMessages)



    return {
      summary,
      recent,
      sessionId,
      subject,
      lastUpdated: new Date()
    }
  }

  /**
   * Tạo summary mới từ lịch sử hội thoại cũ
   * @param sessionId - ID của session
   * @param subject - Môn học
   */
  async summarizeHistory(sessionId: string, subject: string): Promise<void> {
    if (!this.sessions.has(sessionId)) {
      throw new Error(`Session ${sessionId} does not exist`)
    }

    const session = this.sessions.get(sessionId)!
    
    if (session.length === 0) {
      this.summaries.set(sessionId, `Bắt đầu hội thoại về ${subject}`)
      return
    }

    try {
      // Tạo prompt để summarize
      const historyText = session
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n')
        .substring(0, 1000) // Giới hạn độ dài để tránh quá dài

      // Kiểm tra nếu historyText rỗng thì bỏ qua
      if (!historyText.trim()) {
        this.summaries.set(sessionId, `Hội thoại về ${subject} với ${session.length} tin nhắn`)
        return
      }

      const summaryPrompt = `Tóm tắt ngắn gọn cuộc hội thoại sau về ${subject} (tối đa ${this.config.maxSummaryLength} ký tự):\n\n${historyText}`

      // Validation cuối cùng: kiểm tra prompt có rỗng không
      if (!summaryPrompt.trim()) {
        this.summaries.set(sessionId, `Hội thoại về ${subject} với ${session.length} tin nhắn`)
        return
      }
      
      const summary = await GeminiService.chat([
        {
          role: 'user',
          content: summaryPrompt,
          timestamp: new Date()
        }
      ], subject, undefined)
      
      // Cắt summary theo độ dài tối đa
      const truncatedSummary = summary.substring(0, this.config.maxSummaryLength)
      this.summaries.set(sessionId, truncatedSummary)

    } catch (error) {
      console.error(`Failed to summarize session ${sessionId}:`, error)
      // Fallback: tạo summary đơn giản
      const fallbackSummary = `Hội thoại về ${subject} với ${session.length} tin nhắn`
      this.summaries.set(sessionId, fallbackSummary)
    }
  }

  /**
   * Tự động summarize khi có quá nhiều tin nhắn
   * @param sessionId - ID của session
   */
  private async autoSummarize(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId)!
    const subject = this.extractSubjectFromSession(session)
    
    // Giữ lại 5 tin nhắn gần nhất và summarize phần còn lại
    const messagesToSummarize = session.slice(0, -5)
    const recentMessages = session.slice(-5)

    // Kiểm tra nếu không có tin nhắn để summarize thì bỏ qua
    if (messagesToSummarize.length === 0) {
      return
    }

    // Tạo summary từ tin nhắn cũ
    const historyText = messagesToSummarize
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n')
      .substring(0, 800)

    try {
      const summaryPrompt = `Tóm tắt ngắn gọn cuộc hội thoại sau (tối đa ${this.config.maxSummaryLength} ký tự):\n\n${historyText}`
      
      // Validation cuối cùng: kiểm tra prompt có rỗng không
      if (!summaryPrompt.trim()) {
        return
      }
      
      const summary = await GeminiService.chat([
        {
          role: 'user',
          content: summaryPrompt,
          timestamp: new Date()
        }
      ], subject, undefined)
      const truncatedSummary = summary.substring(0, this.config.maxSummaryLength)
      
      // Cập nhật session: giữ summary + recent messages
      this.summaries.set(sessionId, truncatedSummary)
      this.sessions.set(sessionId, recentMessages)
      
    } catch (error) {
      console.error(`Auto-summarize failed for session ${sessionId}:`, error)
    }
  }

  /**
   * Xóa session và dọn dẹp bộ nhớ
   * @param sessionId - ID của session
   */
  deleteSession(sessionId: string): void {
    this.sessions.delete(sessionId)
    this.summaries.delete(sessionId)
  }

  /**
   * Lấy thống kê session
   * @param sessionId - ID của session
   */
  getSessionStats(sessionId: string): { messageCount: number; summaryLength: number } | null {
    if (!this.sessions.has(sessionId)) {
      return null
    }

    const session = this.sessions.get(sessionId)!
    const summary = this.summaries.get(sessionId) || ''

    return {
      messageCount: session.length,
      summaryLength: summary.length
    }
  }

  /**
   * Trích xuất môn học từ session (fallback method)
   * @param session - Session messages
   */
  private extractSubjectFromSession(session: ConversationMessage[]): string {
    // Tìm môn học từ tin nhắn đầu tiên hoặc từ content
    const firstMessage = session[0]
    if (firstMessage && firstMessage.content.includes('toán')) return 'Toán học'
    if (firstMessage && firstMessage.content.includes('lý')) return 'Vật lý'
    if (firstMessage && firstMessage.content.includes('hóa')) return 'Hóa học'
    if (firstMessage && firstMessage.content.includes('sinh')) return 'Sinh học'
    if (firstMessage && firstMessage.content.includes('văn')) return 'Văn học'
    if (firstMessage && firstMessage.content.includes('sử')) return 'Lịch sử'
    
    return 'Môn học'
  }

  /**
   * Xóa tất cả sessions (dọn dẹp bộ nhớ)
   */
  clearAllSessions(): void {
    this.sessions.clear()
    this.summaries.clear()
  }

  /**
   * Lấy toàn bộ tin nhắn của session (để debug)
   * @param sessionId - ID của session
   */
  getAllMessages(sessionId: string): ConversationMessage[] | null {
    if (!this.sessions.has(sessionId)) {
      return null
    }
    return [...this.sessions.get(sessionId)!]
  }

  /**
   * Cập nhật summary thủ công
   * @param sessionId - ID của session
   * @param summary - Summary mới
   */
  updateSummary(sessionId: string, summary: string): void {
    if (this.sessions.has(sessionId)) {
      this.summaries.set(sessionId, summary)
    }
  }
}

/**
 * Factory function để tạo ConversationManager với cấu hình mặc định
 */
export function createConversationManager(config?: Partial<SessionConfig>): ConversationManager {
  return new ConversationManager(config)
}

/**
 * Ví dụ sử dụng ConversationManager
 */
export async function exampleUsage() {
  // Tạo conversation manager
  const manager = createConversationManager({
    maxRecentMessages: 10,
    autoSummarizeThreshold: 12
  })

  // Tạo session cho học viên
  const sessionId = 'student_123_math'
  manager.createSession(sessionId, 'Toán học')

  // Thêm tin nhắn vào hội thoại
  manager.addMessage(sessionId, 'user', 'Em cần giải bài toán về hệ phương trình')
  manager.addMessage(sessionId, 'model', 'Tôi sẽ giúp em giải bài toán này. Hãy cho tôi biết chi tiết bài toán.')
  manager.addMessage(sessionId, 'user', 'Bài toán có dạng: x + y = 5, 2x - y = 1')
  manager.addMessage(sessionId, 'model', 'Tôi hiểu rồi. Đây là hệ phương trình bậc nhất hai ẩn...')

  // Lấy context để gọi Gemini API
  const context = manager.getContext(sessionId, 'Toán học')

  // Tạo summary mới
  await manager.summarizeHistory(sessionId, 'Toán học')

  // Lấy context sau khi summarize
  const optimizedContext = manager.getContext(sessionId, 'Toán học')

  // Thống kê session
  const stats = manager.getSessionStats(sessionId)

  // Dọn dẹp
  manager.deleteSession(sessionId)
}

/**
 * Tích hợp với Gemini API sử dụng ConversationManager
 */
export async function callGeminiWithContext(
  manager: ConversationManager,
  sessionId: string,
  subject: string,
  newMessage: string,
  imageFile?: File
): Promise<string> {
  try {
    // Lấy context tối ưu
    const context = manager.getContext(sessionId, subject)
    
    // Tạo prompt với context
    const prompt = `Dựa trên context sau, hãy trả lời câu hỏi mới:

Context: ${context.summary}

Tin nhắn gần đây:
${context.recent.map(msg => `${msg.role}: ${msg.content}`).join('\n')}

Câu hỏi mới: ${newMessage}`

         // Gọi Gemini API
     
     // Validation cuối cùng: kiểm tra prompt có rỗng không
     if (!prompt.trim()) {
       throw new Error('Prompt không được rỗng')
     }
     
     const response = await GeminiService.chat([
       {
         role: 'user',
         content: prompt,
         timestamp: new Date()
       }
     ], subject, imageFile)
    
    // Thêm tin nhắn mới vào history
    manager.addMessage(sessionId, 'user', newMessage, imageFile)
    manager.addMessage(sessionId, 'model', response)
    
    return response
  } catch (error) {
    console.error('Error calling Gemini with context:', error)
    throw error
  }
}
