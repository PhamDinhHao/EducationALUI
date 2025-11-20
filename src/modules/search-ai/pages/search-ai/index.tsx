import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Button, Card, Col, Image, Input, Row, Spin, Tooltip, Typography, message, Upload } from 'antd'
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
const topQuestions = ['Cách giải toán mạch điện', 'Cơ học', 'Xác xuất', 'Giải hệ phương trình']
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

type ChatBoxProps = { activeKey: string }

const ChatBox = ({ activeKey }: ChatBoxProps) => {
  const subject = SUBJECTS.find((x) => x.key === activeKey)
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [messages, setMessages] = useState<ChatMessageWithImage[]>([])

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

    setMessages((prev) => [...prev, userMessage])
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

      let prompt = `Dựa trên context sau, hãy trả lời câu hỏi mới:\n\nContext: ${context.summary}\n\nTin nhắn gần đây:\n${context.recent.map((msg) => `${msg.role}: ${msg.content}`).join('\n')}\n\nCâu hỏi mới: ${userMessage.content}`

      if (imageToSend) {
        prompt += `\n\nLưu ý: Người dùng đã gửi kèm ảnh bài tập. Hãy phân tích ảnh và trả lời dựa trên nội dung ảnh.`
      }

      // Handle special cases for rewriting problems
      if (
        userMessage.content.toLowerCase().includes('viết lại đề') ||
        userMessage.content.toLowerCase().includes('đề bài') ||
        userMessage.content.toLowerCase().includes('đề toán') ||
        userMessage.content.toLowerCase().includes('câu b') ||
        userMessage.content.toLowerCase().includes('giải câu') ||
        userMessage.content.toLowerCase().includes('toàn bộ đề')
      ) {
        prompt += `\n\nQUAN TRỌNG: Nếu user yêu cầu viết lại đề bài hoặc giải câu b, hãy tìm trong lịch sử hội thoại để tìm đề bài gốc và viết lại chính xác. Đừng đòi hỏi thêm thông tin nếu đề bài đã có trong context.`

        const originalImageMessage = allMessages?.find((msg) => msg.imageFile || msg.imageUrl)
        if (originalImageMessage && !imageToSend) {
          if (originalImageMessage.imageFile) {
            imageToSend = originalImageMessage.imageFile
          } else if (originalImageMessage.imageUrl) {
            const convertedFile = await urlToFile(originalImageMessage.imageUrl)
            if (convertedFile) imageToSend = convertedFile
          }
        }
      }

      const messagesForGemini = (allMessages || []).map((msg) => ({
        role: (msg.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
        content: msg.content,
        timestamp: msg.timestamp
      }))

      if (messagesForGemini.length === 0) {
        const fallback = context.recent.map((msg) => ({
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
      setMessages((prev) => [...prev, assistantMessage])

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
      <div className='mb-8'>
        <div className='mb-12 mt-8 text-center'>
          <div className='mb-4 flex items-center justify-center gap-3'>
            <span className='text-5xl'>🔍</span>
            <Title level={1} style={{ color: '#E8612A', margin: 0 }}>
              XIN CHÀO
            </Title>
          </div>
          <Text className='text-lg text-gray-600'>
            GEN AI giúp bạn giải đáp mọi thắc mắc khi
            <br />
            học tập và cập nhật kiến thức nhanh chóng
          </Text>
        </div>

        {/* Top Questions */}
        {messages.length === 0 && (
          <div className='mb-8'>
            <div className='mb-6 flex items-center gap-2'>
              <div
                className='flex h-10 w-10 items-center justify-center rounded-full'
                style={{ background: 'linear-gradient(135deg, #60A5FA 0%, #34D399 100%)' }}
              >
                <span className='text-xl text-white'>🌍</span>
              </div>
              <Text className='text-lg font-semibold text-gray-700'>Top câu hỏi:</Text>
            </div>

            <Row gutter={[16, 16]}>
              {topQuestions.map((question, index) => (
                <Col xs={24} sm={12} key={index}>
                  <Card
                    hoverable
                    style={{
                      borderColor: '#E8612A',
                      borderWidth: 2,
                      borderRadius: 12,
                      backgroundColor: '#FFF5F0'
                    }}
                  >
                    <Text strong style={{ color: '#333' }}>
                      {question}
                    </Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </div>
      {/* Chat Messages */}
      {messages.length > 0 && (
        <div className='mb-8'>
          <div className='space-y-4'>
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
                    msg.role === 'user' ? 'bg-blue-500 text-white' : 'border border-gray-200 bg-white text-gray-800'
                  }`}
                >
                  <div className='mb-2 flex items-center gap-2'>
                    {msg.role === 'user' ? (
                      <UserOutlined className='text-sm' />
                    ) : (
                      <RobotOutlined className='text-sm text-gray-600' />
                    )}
                    <span className='text-xs opacity-75'>{msg.timestamp.toLocaleTimeString()}</span>
                  </div>

                  {msg.imageUrl && (
                    <div className='mb-3'>
                      <Image
                        src={msg.imageUrl}
                        alt='Bài tập'
                        width={200}
                        className='rounded-lg'
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
              <div className='flex justify-start'>
                <div className='rounded-2xl border border-gray-200 bg-white p-4 shadow-sm'>
                  <div className='flex items-center gap-2'>
                    <RobotOutlined className='text-sm text-gray-600' />
                    <Spin size='small' />
                    <span className='text-sm text-gray-600'>AI đang suy nghĩ...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fixed Bottom Input */}
      <div className='fixed bottom-0 left-[200px] right-0 z-50 bg-gray-50'>
        <div className='mx-auto max-w-[1100px]'>
          <div className='rounded-2xl border border-[#f97316] bg-white p-4'>
            {/* Image Preview */}
            {imagePreview && (
              <div className='relative mb-3 rounded-lg bg-gray-50 p-3'>
                <div className='flex items-center gap-3'>
                  <Image src={imagePreview} alt='Preview' width={60} height={60} className='rounded-lg object-cover' />
                  <div className='flex-1'>
                    <p className='mb-1 text-sm text-gray-600'>Ảnh bài tập đã chọn</p>
                    <p className='text-xs text-gray-500'>{selectedImage?.name}</p>
                  </div>
                  <Button
                    type='text'
                    size='small'
                    onClick={removeSelectedImage}
                    className='text-red-500 hover:text-red-700'
                  >
                    ✕
                  </Button>
                </div>
              </div>
            )}

            {/* Input and Buttons */}
            <div className='flex items-center gap-3'>
              <Input.TextArea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                autoSize={{ minRows: 1, maxRows: 4 }}
                className='flex-1 resize-none rounded-none border-0 p-0 text-base leading-6 shadow-none focus:border-0 focus:outline-none focus:ring-0'
                placeholder={`Đặt câu hỏi cho AL`}
                disabled={isLoading}
              />

              <div className='flex flex-shrink-0 gap-2'>
                <Tooltip title='Ảnh bài tập (hoặc Ctrl+V để dán ảnh)'>
                  <Upload showUploadList={false} beforeUpload={handleImageUpload} accept='image/*'>
                    <Button
                      shape='circle'
                      size='large'
                      icon={<PictureOutlined />}
                      className={`h-10 w-10 border ${
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
                    className='h-10 w-10 border-[#f97316] bg-[#f97316] hover:border-[#f97316] hover:bg-[#f97316]'
                    loading={isLoading}
                    disabled={(!inputValue.trim() && !selectedImage) || isLoading}
                  />
                </Tooltip>
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className='my-2 text-center'>
            <Text type='secondary' className='text-xs'>
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
  return (
    <div className='flex min-h-screen bg-gray-50'>
      <Sidebar />
      <div className='w-full p-6 pb-48'>
        <div className='mx-auto max-w-[1100px]'>
          <ChatBox activeKey='math' />
        </div>
      </div>
    </div>
  )
}

export default ExercisePage
