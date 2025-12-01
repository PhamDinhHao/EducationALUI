import React, { useState, useRef, useEffect } from 'react'
import { Button, Form, Input, Typography, Spin, message, Card, Row, Col, Image, Tooltip, Upload } from 'antd'
import {
  BookOutlined,
  UserOutlined,
  RobotOutlined,
  SendOutlined,
  PictureOutlined,
  EditOutlined
} from '@ant-design/icons'
import axios from 'axios'
import env from '@/shared/core/constants/env'
import { GeminiService } from '@/modules/ai/pages/ai/Service/gemini.service'
import { ConversationManager, ConversationMessage } from '@/modules/ai/pages/ai/Service/conversation.manager'
import Sidebar from '@/shared/components/Sidebar'


const { Title, Text } = Typography
const { TextArea } = Input

// Mock API (replace with your actual implementation)
const API_URL = `${env.VITE_HOST_API}/lessons/generate`

// Prompt templates
const promptTemplates = [
  {
    label: 'Giáo án chuẩn (bám sát Bộ GD&ĐT)',
    value: 'Môn: Toán\nBài: Hàm số\nThời lượng: 1 tiết\nLớp: 12\nChủ đề: Giáo án chuẩn (bám sát Bộ GD&ĐT)'
  },
  {
    label: 'Giáo án phương pháp dạy học tích cực',
    value: 'Môn: Toán\nBài: Hàm số\nThời lượng: 2 tiết\nLớp: 12\nChủ đề: Giáo án phương pháp dạy học tích cực'
  },
  {
    label: 'Giáo án tích hợp liên môn',
    value: 'Môn: Toán - Vật lý\nBài: Hàm số\nThời lượng: 1 tiết\nLớp: 12\nChủ đề: Giáo án tích hợp liên môn'
  },
  {
    label: 'Giáo án STEAM',
    value: 'Môn: Toán\nBài: Hàm số bậc nhất\nThời lượng: 1 tiết\nLớp: 12\nChủ đề: Giáo án STEAM'
  }
]

// Format AI text helper
const formatAIText = (text: string) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>')
}

// Chat message interface removed, using ConversationMessage from service

const LessonPrompt = () => {
  const [loading, setLoading] = useState(false)
  const [prompt, setPrompt] = useState(promptTemplates[0].value)
  const [selectedTemplate, setSelectedTemplate] = useState(promptTemplates[0].label)

  // Chat states
  const [showChat, setShowChat] = useState(false)
  const [_, setLessonData] = useState(null)
  const [messages, setMessages] = useState<ConversationMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoadingChat, setIsLoadingChat] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState('')

  const messagesEndRef = useRef<HTMLDivElement>(null)
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

  const convertLessonDataToContent = (data: any) => {
    let text = `# ${data.title}\n`
    text += `## Môn: ${data.subject} - Lớp ${data.grade}\n`
    text += `## Chủ đề: ${data.topic}\n`
    text += `## Loại bài: ${data.lessonType}\n\n`

    // Mục tiêu
    text += `## I. Mục tiêu bài học\n`
    data.objectives.forEach((obj: string) => {
      text += `- ${obj}\n`
    })
    text += `\n`

    // Hoạt động
    text += `## II. Hoạt động dạy học\n`
    data.activities.forEach((a: any, index: number) => {
      text += `### ${index + 1}. ${a.step}\n`
      text += `${a.description}\n\n`
    })

    // Đánh giá
    text += `## III. Đánh giá\n${data.assessment}\n`

    return text
  }

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Parse prompt function
  const parsePrompt = (text: string) => {
    const lines = text.split('\n')
    const data: any = {}

    lines.forEach((line) => {
      const [key, value] = line.split(':').map((s) => s.trim())
      if (!key || !value) return
      if (key.toLowerCase().includes('môn')) data.subject = value
      if (key.toLowerCase().includes('bài')) data.topic = value
      if (key.toLowerCase().includes('thời lượng')) data.periods = parseInt(value) || 1
      if (key.toLowerCase().includes('lớp')) data.grade = value
      if (key.toLowerCase().includes('chủ đề')) data.lessonType = value
    })

    return data
  }

  // Submit initial lesson generation
  const handleSubmit = async () => {
    try {
      setLoading(true)
      const parsedData = parsePrompt(prompt)

      if (!parsedData.subject || !parsedData.topic || !parsedData.grade) {
        message.error('Prompt chưa đầy đủ thông tin!')
        setLoading(false)
        return
      }

      // Mock API call - replace with actual axios call
      const response = await axios.post(API_URL, parsedData)
      const data = response.data?.data ?? response.data
      const formattedContent = convertLessonDataToContent(data)
      // Mock response for demo
      setLessonData(data)

      // Initialize session
      const sessionId = `lesson_${Date.now()}`
      sessionIdRef.current = sessionId
      conversationManagerRef.current?.createSession(sessionId, parsedData.subject || 'Lesson')

      // Add initial lesson as first message
      const initialMessage: ConversationMessage = {
        role: 'model',
        content: formattedContent,
        timestamp: new Date()
      }

      conversationManagerRef.current?.addMessage(sessionId, 'model', formattedContent)

      setMessages([initialMessage])
      setShowChat(true)
      message.success('Tạo giáo án thành công! Bạn có thể tiếp tục chỉnh sửa bằng cách chat với AI.')
    } catch (error) {
      console.error(error)
      message.error('Có lỗi xảy ra khi tạo giáo án!')
    } finally {
      setLoading(false)
    }
  }

  // Handle chat send
  const handleChatSend = async () => {
    if ((!inputValue.trim() && !selectedImage) || isLoadingChat) return

    const userMessage: ConversationMessage = {
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
      imageUrl: imagePreview || undefined,
      imageFile: selectedImage || undefined
    }

    // Add to conversation manager
    conversationManagerRef.current?.addMessage(
      sessionIdRef.current,
      'user',
      userMessage.content,
      selectedImage || undefined,
      imagePreview || undefined
    )

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsLoadingChat(true)
    
    // Store image for API call before clearing
    const imageToSend = selectedImage
    
    setSelectedImage(null)
    setImagePreview('')

    try {
      const manager = conversationManagerRef.current
      if (!manager) throw new Error('ConversationManager not initialized')

      const context = manager.getContext(sessionIdRef.current, '')
      const allMessages = manager.getAllMessages(sessionIdRef.current)

      let prompt = `Dựa trên context sau, hãy trả lời câu hỏi mới:\n\nContext: ${context.summary}\n\nTin nhắn gần đây:\n${context.recent.map((msg) => `${msg.role}: ${msg.content}`).join('\n')}\n\nCâu hỏi mới: ${userMessage.content}`

      if (imageToSend) {
        prompt += `\n\nLưu ý: Người dùng đã gửi kèm ảnh tài liệu. Hãy phân tích ảnh và trả lời dựa trên nội dung ảnh.`
      }

      const messagesForGemini = (allMessages || []).map((msg) => ({
        role: (msg.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
        content: msg.content + ', làm phiên bản hoàn chỉnh giúp tôi',
        timestamp: msg.timestamp
      }))

      // Fallback if empty
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
          content: '',
          timestamp: new Date()
        },
        ...messagesForGemini
      ]

      const aiResponse = await GeminiService.chat(
        enhancedMessages,
        '',
        imageToSend || undefined
      )

      const assistantMessage: ConversationMessage = {
        role: 'model',
        content: aiResponse,
        timestamp: new Date()
      }

      manager.addMessage(sessionIdRef.current, 'model', assistantMessage.content)
      setMessages((prev) => [...prev, assistantMessage])

      if (context.recent.length > 10) {
        manager.summarizeHistory(sessionIdRef.current, '')
      }
    } catch (error) {
      console.error(error)
      message.error(error instanceof Error ? error.message : 'Có lỗi xảy ra khi xử lý yêu cầu!')
    } finally {
      setIsLoadingChat(false)
    }
  }

  // Handle key down
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleChatSend()
    }
  }

  // Handle image upload
  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      message.error('Chỉ được upload file ảnh!')
      return false
    }

    if (file.size / 1024 / 1024 >= 5) {
      message.error('File ảnh phải nhỏ hơn 5MB!')
      return false
    }

    setSelectedImage(file)
    const reader = new FileReader()
    reader.onload = (e) => setImagePreview(e.target?.result as string)
    reader.readAsDataURL(file)
    message.success('Đã thêm ảnh!')
    return false
  }

  // Remove image
  const removeSelectedImage = () => {
    setSelectedImage(null)
    setImagePreview('')
  }

  // Back to edit
  const handleBackToEdit = () => {
    setShowChat(false)
    setMessages([])
  }

  if (showChat) {
    return (
      <div className='flex min-h-screen bg-gray-50'>
        <Sidebar />
        <div className='w-full p-8'>
          <div className='mx-auto max-w-[1100px]'>
            <div className='mb-4 flex items-center justify-between'>
              <Button icon={<EditOutlined />} onClick={handleBackToEdit} className='border-[#E8612A] text-[#E8612A]'>
                Chỉnh sửa prompt ban đầu
              </Button>
              <Title level={3} style={{ margin: 0, color: '#E8612A' }}>
                Chỉnh sửa giáo án với AI
              </Title>
            </div>

            <div className='flex h-[calc(100vh-200px)] flex-col'>
              {/* Messages Area */}
              <div className='flex-1 overflow-y-auto pb-4'>
                <div className='space-y-4'>
                  {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
                          msg.role === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'border border-gray-200 bg-white text-gray-800'
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
                            <Image src={msg.imageUrl} alt='Tài liệu' width={200} className='rounded-lg' />
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

                  {isLoadingChat && (
                    <div className='flex justify-start'>
                      <div className='rounded-2xl border border-gray-200 bg-white p-4 shadow-sm'>
                        <div className='flex items-center gap-2'>
                          <RobotOutlined className='text-sm text-gray-600' />
                          <Spin size='small' />
                          <span className='text-sm text-gray-600'>AI đang xử lý...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input Area */}
              <div className='sticky bottom-0 left-0 w-full bg-white'>
                <div className='bg-gray-50 p-4'>
                  <div className='rounded-2xl border border-[#E8612A] bg-white p-4'>
                    {imagePreview && (
                      <div className='relative mb-3 rounded-lg bg-gray-50 p-3'>
                        <div className='flex items-center gap-3'>
                          <Image
                            src={imagePreview}
                            alt='Preview'
                            width={60}
                            height={60}
                            className='rounded-lg object-cover'
                          />
                          <div className='flex-1'>
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

                    <div className='flex items-center gap-3'>
                      <Input.TextArea
                        ref={inputRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoSize={{ minRows: 1, maxRows: 4 }}
                        className='flex-1 resize-none rounded-none border-0 p-0 text-base leading-6 shadow-none focus:ring-0'
                        placeholder='Yêu cầu chỉnh sửa giáo án (VD: Thêm hoạt động nhóm, bổ sung ví dụ...)'
                        disabled={isLoadingChat}
                      />

                      <div className='flex flex-shrink-0 gap-2'>
                        <Tooltip title='Đính kèm ảnh tài liệu'>
                          <Upload showUploadList={false} beforeUpload={handleImageUpload} accept='image/*'>
                            <Button
                              shape='circle'
                              size='large'
                              icon={<PictureOutlined />}
                              className={`h-10 w-10 border ${
                                selectedImage ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                              }`}
                            />
                          </Upload>
                        </Tooltip>

                        <Tooltip title='Gửi'>
                          <Button
                            type='primary'
                            shape='circle'
                            size='large'
                            icon={<SendOutlined />}
                            onClick={handleChatSend}
                            className='h-10 w-10 border-[#E8612A] bg-[#E8612A]'
                            loading={isLoadingChat}
                            disabled={(!inputValue.trim() && !selectedImage) || isLoadingChat}
                          />
                        </Tooltip>
                      </div>
                    </div>
                  </div>

                  <div className='my-2 text-center'>
                    <Text type='secondary' className='text-xs'>
                      AI sẽ giúp bạn chỉnh sửa và hoàn thiện giáo án theo yêu cầu
                    </Text>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='flex min-h-screen bg-gray-50'>
      <Sidebar />
      <div className='w-full p-12'>
        <div className='mx-auto max-w-[1100px]'>
          <Card className='mx-auto w-full max-w-3xl rounded-2xl p-6 shadow-lg'>
            <div className='mb-6 text-center'>
              <BookOutlined style={{ fontSize: 32, color: '#E8612A' }} />
              <Title level={2} style={{ color: '#E8612A' }}>
                Xây dựng giáo án
              </Title>
              <Text type='secondary'>GEN AI giúp bạn xây dựng giáo án theo chuẩn cấu trúc 5512</Text>
            </div>

            <div className='mb-6'>
              <Text strong>Bạn có thể chọn các prompt sau đây để tạo giáo án thích hợp</Text>
              <Row gutter={[16, 16]} justify='center' className='mt-3'>
                {promptTemplates.map((item, index) => (
                  <Col xs={24} sm={12} key={index}>
                    <div
                      onClick={() => {
                        setPrompt(item.value)
                        setSelectedTemplate(item.label)
                      }}
                      style={{
                        textAlign: 'center',
                        padding: '12px 16px',
                        border: '2px solid #E8612A',
                        borderRadius: '999px',
                        cursor: 'pointer',
                        fontWeight: 500,
                        backgroundColor: selectedTemplate === item.label ? '#fff5f0' : 'white'
                      }}
                    >
                      {item.label}
                    </div>
                  </Col>
                ))}
              </Row>
            </div>

            <Form layout='vertical'>
              <Form.Item label='Prompt'>
                <TextArea rows={6} value={prompt} onChange={(e) => setPrompt(e.target.value)} />
              </Form.Item>

              <Form.Item>
                <Button
                  type='primary'
                  block
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{
                    background: '#E8612A',
                    borderColor: '#E8612A',
                    borderRadius: '999px',
                    height: 40
                  }}
                >
                  {loading ? <Spin /> : 'Gửi'}
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default LessonPrompt
