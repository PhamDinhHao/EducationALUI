import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Badge, Button, Card, Col, Image, Input, Row, Space, Spin, Tooltip, Typography, message, Upload } from 'antd'
import { 
  CalculatorOutlined, 
  EnvironmentOutlined, 
  ExperimentOutlined, 
  PictureOutlined, 
  ReadOutlined, 
  RobotOutlined, 
  SendOutlined, 
  ThunderboltOutlined, 
  UserOutlined 
} from '@ant-design/icons'
import Sidebar from '@/shared/components/Sidebar'
import { GeminiService } from '@/modules/ai/pages/ai/Service/gemini.service'
import { ConversationManager, ConversationMessage } from '@/modules/ai/pages/ai/Service/conversation.manager'
import { formatAIText } from '@/shared/lib/aiFormat'

// Types and Interfaces
interface Subject {
  key: string
  label: string
  description: string
  icon: ReactNode
  color: string
}

interface ChatMessageWithImage extends ConversationMessage {
  imageUrl?: string
  imageFile?: File
}

// Constants
const { Title, Text } = Typography

const SUBJECTS: Subject[] = [
  { 
    key: 'math', 
    label: 'Toán học', 
    description: 'Đại số, Hình học, Giải tích, Thống kê', 
    icon: <CalculatorOutlined />, 
    color: '#3b82f6' 
  },
  { 
    key: 'physics', 
    label: 'Vật lý', 
    description: 'Cơ học, Điện học, Quang học, Nhiệt học', 
    icon: <ExperimentOutlined />, 
    color: '#10b981' 
  },
  { 
    key: 'chemistry', 
    label: 'Hóa học', 
    description: 'Hóa vô cơ, Hóa hữu cơ, Hóa phân tích', 
    icon: <ThunderboltOutlined />, 
    color: '#8b5cf6' 
  },
  { 
    key: 'biology', 
    label: 'Sinh học', 
    description: 'Tế bào, Di truyền, Tiến hóa, Sinh thái', 
    icon: <EnvironmentOutlined />, 
    color: '#ef4444' 
  },
  { 
    key: 'geography', 
    label: 'Địa lý', 
    description: 'Địa lý tự nhiên, Địa lý kinh tế - xã hội', 
    icon: <EnvironmentOutlined />, 
    color: '#eab308' 
  },
  { 
    key: 'history', 
    label: 'Lịch sử', 
    description: 'Lịch sử Việt Nam, Lịch sử thế giới', 
    icon: <ReadOutlined />, 
    color: '#6366f1' 
  }
]

// Utility Functions

const urlToFile = async (url: string): Promise<File | null> => {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    return new File([blob], 'original_image.jpg', { type: blob.type })
  } catch {
    return null
  }
}

// Components
const ExerciseHeader = () => (
  <div className="text-center mb-8">
    <div className="flex items-center justify-center gap-3 mb-4">
      <Title level={1} className="!text-orange-500 !mb-0">Giải bài tập</Title>
    </div>
    <Text className="text-lg text-gray-700">GEN AI hỗ trợ giải bài tập nhanh chóng chính xác</Text>
  </div>
)

type SubjectGridProps = { 
  activeKey: string
  onSelect: (key: string) => void 
}

const SubjectGrid = ({ activeKey, onSelect }: SubjectGridProps) => (
  <div className="mb-8">
    <Row gutter={[12, 12]}>
      {SUBJECTS.map((subject) => (
        <Col xs={24} sm={12} md={8} key={subject.key}>
          <Card
            hoverable
            onClick={() => onSelect(subject.key)}
            className="min-h-[78px]"
            style={{ borderColor: activeKey === subject.key ? subject.color : '#e6e6e6' }}
          >
            <Space align='start'>
              <Badge color={subject.color} />
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span style={{ color: subject.color, fontSize: 16 }}>
                    {subject.icon}
                  </span>
                  <Text strong>{subject.label}</Text>
                </div>
                <Text type='secondary' className="text-xs">
                  {subject.description}
                </Text>
              </div>
            </Space>
          </Card>
        </Col>
      ))}
    </Row>
  </div>
)

type ChatBoxProps = { activeKey: string }

const ChatBox = ({ activeKey }: ChatBoxProps) => {
  const subject = SUBJECTS.find((x) => x.key === activeKey)
  const [inputValue, setInputValue] = useState('')
  const [messages, setMessages] = useState<ChatMessageWithImage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  
  const inputRef = useRef<any>(null)
  const conversationManagerRef = useRef<ConversationManager>()
  const sessionIdRef = useRef<string>('')

  // Initialize conversation manager
  if (!conversationManagerRef.current) {
    conversationManagerRef.current = new ConversationManager({ 
      maxRecentMessages: 8, 
      autoSummarizeThreshold: 12 
    })
  }
  
  if (!sessionIdRef.current || sessionIdRef.current !== `student_${activeKey}`) {
    sessionIdRef.current = `student_${activeKey}`
  }

  useEffect(() => {
    if (subject && conversationManagerRef.current) {
      conversationManagerRef.current.createSession(sessionIdRef.current, subject.label)
    }
  }, [activeKey, subject])

  // Event Handlers
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      e.stopPropagation()
      handleSend()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (item.type.startsWith('image/')) {
        e.preventDefault()
        const file = item.getAsFile()
        if (file) handleImageFile(file)
        break
      }
    }
  }

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      message.error('Chỉ được upload file ảnh!')
      return
    }
    
    if (file.size / 1024 / 1024 >= 5) {
      message.error('File ảnh phải nhỏ hơn 5MB!')
      return
    }
    
    setSelectedImage(file)
    const reader = new FileReader()
    reader.onload = (e) => setImagePreview(e.target?.result as string)
    reader.readAsDataURL(file)
    message.success('Đã thêm ảnh từ clipboard!')
  }

  const handleImageUpload = (file: File) => {
    handleImageFile(file)
    return false
  }

  const removeSelectedImage = () => {
    setSelectedImage(null)
    setImagePreview('')
  }

  const handleSend = async () => {
    if ((!inputValue.trim() && !selectedImage) || isLoading) return

    const userMessage: ChatMessageWithImage = {
      role: 'user',
      content: inputValue.trim() || '',
      timestamp: new Date(),
      imageFile: selectedImage || undefined,
      imageUrl: imagePreview || undefined
    }

    let imageToSend = selectedImage
    const imageUrlToSend = imagePreview

    conversationManagerRef.current?.addMessage(
      sessionIdRef.current, 
      'user', 
      userMessage.content, 
      imageToSend || undefined, 
      imageUrlToSend || undefined
    )

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)
    
    // Reset image ngay khi bắt đầu gửi
    setSelectedImage(null)
    setImagePreview('')

    try {
      const manager = conversationManagerRef.current
      if (!manager) throw new Error('ConversationManager not initialized')
      
      const context = manager.getContext(sessionIdRef.current, subject?.label || 'môn học')
      const allMessages = manager.getAllMessages(sessionIdRef.current)

      let prompt = `Dựa trên context sau, hãy trả lời câu hỏi mới:\n\nContext: ${context.summary}\n\nTin nhắn gần đây:\n${context.recent.map(msg => `${msg.role}: ${msg.content}`).join('\n')}\n\nCâu hỏi mới: ${userMessage.content}`
      
      if (imageToSend) {
        prompt += `\n\nLưu ý: Người dùng đã gửi kèm ảnh bài tập. Hãy phân tích ảnh và trả lời dựa trên nội dung ảnh.`
      }

      // Handle special cases for rewriting problems
      if (userMessage.content.toLowerCase().includes('viết lại đề') || 
          userMessage.content.toLowerCase().includes('đề bài') || 
          userMessage.content.toLowerCase().includes('đề toán') || 
          userMessage.content.toLowerCase().includes('câu b') || 
          userMessage.content.toLowerCase().includes('giải câu') || 
          userMessage.content.toLowerCase().includes('toàn bộ đề')) {
        
        prompt += `\n\nQUAN TRỌNG: Nếu user yêu cầu viết lại đề bài hoặc giải câu b, hãy tìm trong lịch sử hội thoại để tìm đề bài gốc và viết lại chính xác. Đừng đòi hỏi thêm thông tin nếu đề bài đã có trong context.`
        
        const originalImageMessage = allMessages?.find(msg => msg.imageFile || msg.imageUrl)
        if (originalImageMessage && !imageToSend) {
          if (originalImageMessage.imageFile) {
            imageToSend = originalImageMessage.imageFile
          } else if (originalImageMessage.imageUrl) {
            const convertedFile = await urlToFile(originalImageMessage.imageUrl)
            if (convertedFile) imageToSend = convertedFile
          }
        }
      }

      const messagesForGemini = (allMessages || []).map(msg => ({
        role: (msg.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
        content: msg.content,
        timestamp: msg.timestamp
      }))
      
      if (messagesForGemini.length === 0) {
        const fallback = context.recent.map(msg => ({
          role: (msg.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
          content: msg.content,
          timestamp: msg.timestamp
        }))
        messagesForGemini.push(...fallback)
      }

      const enhancedMessages = [
        {
          role: 'assistant' as const,
          content: `Bạn là một giáo viên chuyên môn về ${subject?.label || 'môn học'}. Hãy trả lời câu hỏi của học sinh một cách chi tiết, dễ hiểu và chính xác. QUAN TRỢNG: Duy trì context của cuộc trò chuyện và sử dụng thông tin từ các tin nhắn trước đó để trả lời.`,
          timestamp: new Date()
        },
        ...messagesForGemini
      ]

      const aiResponse = await GeminiService.chat(
        enhancedMessages, 
        subject?.label || 'môn học', 
        imageToSend || undefined
      )

      const assistantMessage: ChatMessageWithImage = {
        role: 'model',
        content: aiResponse,
        timestamp: new Date()
      }
      
      manager.addMessage(sessionIdRef.current, 'model', assistantMessage.content)
      setMessages(prev => [...prev, assistantMessage])

      if (context.recent.length > 10) {
        manager.summarizeHistory(sessionIdRef.current, subject?.label || 'môn học')
      }
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Có lỗi xảy ra')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Chat Messages */}
      {messages.length > 0 && (
        <div className="mb-8">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white border border-gray-200 text-gray-800'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {msg.role === 'user' ? (
                      <UserOutlined className="text-sm" />
                    ) : (
                      <RobotOutlined className="text-sm text-gray-600" />
                    )}
                    <span className="text-xs opacity-75">
                      {msg.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  
                  {msg.imageUrl && (
                    <div className="mb-3">
                      <Image 
                        src={msg.imageUrl} 
                        alt="Bài tập" 
                        width={200} 
                        className="rounded-lg" 
                        preview={{ mask: 'Xem ảnh', maskClassName: 'rounded-lg' }} 
                      />
                    </div>
                  )}
                  
                  {msg.content && (
                    <div 
                      className={`whitespace-pre-wrap text-sm leading-relaxed ${
                        msg.role === 'model' ? 'prose prose-sm max-w-none' : ''
                      }`}
                      dangerouslySetInnerHTML={{
                        __html: msg.role === 'model' ? formatAIText(msg.content) : msg.content
                      }}
                    />
                  )}
                </div>
              </div>
            ))}
            
            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center gap-2">
                    <RobotOutlined className="text-sm text-gray-600" />
                    <Spin size="small" />
                    <span className="text-sm text-gray-600">AI đang suy nghĩ...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fixed Bottom Input */}
      <div className="fixed bottom-0 left-[200px] right-0 bg-gray-50 z-50">
        <div className="max-w-[1100px] mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
            {/* Image Preview */}
            {imagePreview && (
              <div className="mb-3 p-3 bg-gray-50 rounded-lg relative">
                <div className="flex items-center gap-3">
                  <Image 
                    src={imagePreview} 
                    alt="Preview" 
                    width={60} 
                    height={60} 
                    className="rounded-lg object-cover" 
                  />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">Ảnh bài tập đã chọn</p>
                    <p className="text-xs text-gray-500">{selectedImage?.name}</p>
                  </div>
                  <Button 
                    type="text" 
                    size="small" 
                    onClick={removeSelectedImage} 
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </Button>
                </div>
              </div>
            )}

            {/* Input and Buttons */}
            <div className="flex items-center gap-3">
              <Input.TextArea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                autoSize={{ minRows: 1, maxRows: 4 }}
                className="flex-1 resize-none border-0 rounded-none p-0 shadow-none text-base leading-6 focus:outline-none focus:ring-0 focus:border-0"
                placeholder={`Đặt câu hỏi cho ${subject?.label.toLowerCase() || 'môn học'}... (Ctrl+V để dán ảnh)`}
                disabled={isLoading}
              />
              
              <div className="flex gap-2 flex-shrink-0">
                <Tooltip title='Ảnh bài tập (hoặc Ctrl+V để dán ảnh)'>
                  <Upload showUploadList={false} beforeUpload={handleImageUpload} accept="image/*">
                    <Button 
                      shape='circle' 
                      size='large' 
                      icon={<PictureOutlined />} 
                      className={`w-10 h-10 border ${
                        selectedImage ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                      } hover:border-gray-400 hover:bg-gray-50`} 
                      disabled={isLoading} 
                    />
                  </Upload>
                </Tooltip>
                
                <Tooltip title='Gửi'>
                  <Button 
                    type='primary' 
                    shape='circle' 
                    size='large' 
                    icon={<SendOutlined />} 
                    onClick={handleSend} 
                    className="w-10 h-10 bg-orange-500 border-orange-500 hover:bg-orange-600 hover:border-orange-600" 
                    loading={isLoading} 
                    disabled={(!inputValue.trim() && !selectedImage) || isLoading} 
                  />
                </Tooltip>
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="text-center my-2">
            <Text type='secondary' className="text-xs">
              Khi đặt câu hỏi, bạn đồng ý với <strong>Điều khoản</strong> và <strong>Chính sách quyền riêng tư</strong>.
            </Text>
          </div>
        </div>
      </div>
    </>
  )
}

// Main Component
const ExercisePage = () => {
  const [active, setActive] = useState<string>('math')

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-[200px] w-full p-6 pb-48">
        <div className="max-w-[1100px] mx-auto">
          <ExerciseHeader />
          <SubjectGrid activeKey={active} onSelect={setActive} />
          <ChatBox activeKey={active} />
        </div>
      </div>
    </div>
  )
}

export default ExercisePage
