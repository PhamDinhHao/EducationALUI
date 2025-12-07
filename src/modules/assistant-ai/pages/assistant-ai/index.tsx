import React, { useState, useEffect } from 'react'
import { Button, Spin, message, Upload } from 'antd'
import { PictureOutlined, SendOutlined, DeleteOutlined } from '@ant-design/icons'
import axios from 'axios'
import Sidebar from '@/shared/components/Sidebar'
import env from '@/shared/core/constants/env'

// Format markdown
const formatMarkdown = (text: string) => {
  if (!text) return ''
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/^\* (.*)$/gm, '• $1')
    .replace(/\\n/g, '\n')
    .trim()
}

// 6 chức năng
const FUNCTIONS = [
  {
    key: 'method',
    icon: '📚',
    label: 'Gợi ý phương pháp giảng dạy',
    prompt:
      'Học sinh lớp : (Ví dụ lớp 1,2),Môn học : (Ví dụ Toán, Tiếng Anh),Tên bài học : (Ví dụ: Phép cộng),Phương pháp dạy học : (Ví dụ: Phương pháp truyền thống)'
  },
  {
    key: 'concept',
    icon: '💡',
    label: 'Giải thích khái niệm',
    prompt: 'Hãy giải thích khái niệm : (Ví dụ: Khái niệm toán)'
  },
  {
    key: 'quiz',
    icon: '🎯',
    label: 'Đề xuất câu đố vui tư duy',
    prompt: 'Tạo các câu hỏi đố vui giúp học sinh tư duy: Môn : (Ví dụ: Toán),Tên bài học : (Ví dụ: Phép cộng)'
  },
  {
    key: 'example',
    icon: '🌟',
    label: 'Tạo ví dụ thực tế',
    prompt: 'Soạn ví dụ thực tế :Nội dung kiến thức : (Ví dụ: Phép cộng)'
  },
  {
    key: 'slide',
    icon: '📊',
    label: 'Soạn slide trình chiếu',
    prompt: 'Soạn slide trình chiếu :Môn học : (Ví dụ: Toán),Tên bài học : (Ví dụ: Phép cộng),Slide: (Ví dụ: số trang)'
  },
  {
    key: 'flashcards',
    icon: '🎴',
    label: 'Tạo bộ ghi nhớ ảo',
    prompt:
      'Tạo bộ ghi nhớ ảo (flashcards) :Môn học : (Ví dụ: Toán),Tên bài học : (Ví dụ: Phép cộng),Flashcards: (Ví dụ: số thẻ)'
  }
]

const API_URL = `${env.VITE_HOST_API}/exercise/chat`

interface ChatMessage {
  content: string
  imageUrl?: string
}

const ExercisePage: React.FC = () => {
  const [activeFunction, setActiveFunction] = useState<string>('method')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState(FUNCTIONS[0].prompt)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [loading, setLoading] = useState(false)

  // ✅ Update inputValue khi thay đổi function
  useEffect(() => {
    const selectedFunc = FUNCTIONS.find((f) => f.key === activeFunction)
    if (selectedFunc) setInputValue(selectedFunc.prompt)
  }, [activeFunction])

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      message.error('Chỉ được upload file ảnh!')
      return false
    }
    if (file.size / 1024 / 1024 >= 20) {
      message.error('File ảnh phải nhỏ hơn 20MB!')
      return false
    }
    setSelectedImage(file)
    const reader = new FileReader()
    reader.onload = (e) => setImagePreview(e.target?.result as string)
    reader.readAsDataURL(file)
    return false
  }

  const removeSelectedImage = () => {
    setSelectedImage(null)
    setImagePreview('')
  }

  // ✅ Giữ nguyên logic gửi API của bạn
  const handleSend = async () => {
    if (!inputValue.trim() && !selectedImage) return

    const newUserMessage: ChatMessage = {
      content: inputValue,
      imageUrl: imagePreview || undefined
    }
    setMessages((prev) => [...prev, newUserMessage])
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('function', activeFunction)
      formData.append('prompt', newUserMessage.content)
      if (selectedImage) {
        formData.append('image', selectedImage)
      }

      const res = await axios.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      const aiResponse: ChatMessage = {
        content: res.data?.answer || 'AI không trả lời được.'
      }
      setMessages((prev) => [...prev, aiResponse])

      // ✅ Reset sau khi API trả về
      setInputValue('')
      setSelectedImage(null)
      setImagePreview('')
    } catch (err) {
      message.error('Có lỗi khi gửi câu hỏi.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const selectedFunc = FUNCTIONS.find((f) => f.key === activeFunction)

  return (
    <div className='flex h-full bg-gradient-to-br from-orange-50 via-white to-orange-50'>
      <Sidebar />

      <div className='flex flex-1 flex-col h-full overflow-hidden'>
        {/* Header */}
        <div className='border-b border-orange-100 bg-white shadow-sm'>
          <div className='mx-auto max-w-7xl px-6 py-6'>
            <div className='text-center'>
              <h1 className='pb-4 bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-4xl font-bold text-transparent'>
                Trợ lý AI Giáo dục
              </h1>
              <p className='text-lg text-gray-600'>Hỗ trợ giảng dạy thông minh với công nghệ AI</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className='flex-1 overflow-y-auto px-6 py-8'>
          <div className='mx-auto max-w-7xl'>
            {/* Function Grid */}
            <div className='mb-8'>
              <h2 className='mb-4 flex items-center gap-2 text-xl font-semibold text-gray-800'>
                <span className='text-orange-500'>✨</span>
                Chọn chức năng
              </h2>
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                {FUNCTIONS.map((func) => (
                  <button
                    key={func.key}
                    onClick={() => setActiveFunction(func.key)}
                    className={`group relative overflow-hidden rounded-2xl border-2 p-5 text-left transition-all duration-300 ${activeFunction === func.key
                      ? 'scale-105 border-orange-400 bg-gradient-to-br from-orange-50 to-orange-100 shadow-lg'
                      : 'hover:scale-102 border-orange-200 bg-white hover:border-orange-300 hover:shadow-md'
                      }`}
                  >
                    <div className='flex items-start gap-4'>
                      <div
                        className={`text-4xl transition-transform duration-300 ${activeFunction === func.key ? 'scale-110' : 'group-hover:scale-110'
                          }`}
                      >
                        {func.icon}
                      </div>
                      <div className='flex-1'>
                        <div className='mb-1 font-semibold leading-tight text-gray-800'>{func.label}</div>
                        <div className='text-xs text-gray-500'>Click để chọn</div>
                      </div>
                    </div>
                    {activeFunction === func.key && (
                      <div className='absolute right-2 top-2'>
                        <div className='h-3 w-3 animate-pulse rounded-full bg-orange-500'></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt Guide */}
            {selectedFunc && messages.length === 0 && (
              <div className='mb-6 rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-4'>
                <div className='flex items-start gap-3'>
                  <span className='text-2xl'>💬</span>
                  <div className='flex-1'>
                    <p className='mb-2 font-medium text-gray-800'>Gợi ý câu hỏi:</p>
                    <p className='whitespace-pre-line text-sm leading-relaxed text-gray-600'>{selectedFunc.prompt}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Chat Messages */}
            <div className='mb-6 space-y-4'>
              {messages.length === 0 && (
                <div className='py-16 text-center'>
                  <div className='mb-4 text-6xl'>🤖</div>
                  <p className='text-lg text-gray-500'>Bắt đầu cuộc trò chuyện với AI</p>
                </div>
              )}

              {messages.map((msg, index) => (
                <div key={index} className={`flex ${index % 2 === 0 ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
                  <div
                    className={`max-w-[75%] rounded-2xl p-4 shadow-md ${index % 2 === 0
                      ? 'bg-gradient-to-r from-orange-500 to-orange-400 text-white'
                      : 'border border-gray-200 bg-white text-gray-800'
                      }`}
                  >
                    {msg.imageUrl && (
                      <div className='mb-3'>
                        <img
                          src={msg.imageUrl}
                          alt='Upload'
                          className='h-auto max-w-full rounded-lg shadow-sm'
                          style={{ maxWidth: '200px' }}
                        />
                      </div>
                    )}
                    <div
                      className='whitespace-pre-wrap leading-relaxed'
                      dangerouslySetInnerHTML={{ __html: formatMarkdown(msg.content) }}
                    />
                  </div>
                </div>
              ))}

              {loading && (
                <div className='animate-fadeIn flex justify-start'>
                  <div className='rounded-2xl border border-gray-200 bg-white p-4 shadow-md'>
                    <div className='flex items-center gap-3'>
                      <Spin size='small' />
                      <span className='text-gray-600'>AI đang suy nghĩ...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Input Area - Fixed Bottom */}
        <div className='flex-shrink-0 w-full px-6 pb-20 pt-4 z-10'>
          <div className='mx-auto max-w-7xl'>
            {imagePreview && (
              <div className='mb-3 inline-flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm'>
                <img src={imagePreview} alt='Preview' className='h-16 w-16 rounded-lg object-cover' />
                <Button
                  type='text'
                  icon={<DeleteOutlined />}
                  onClick={removeSelectedImage}
                  className='text-red-500 hover:bg-red-50'
                  danger
                >
                  Xóa
                </Button>
              </div>
            )}

            <div className='flex items-end gap-2 rounded-2xl border-2 border-orange-200 bg-white p-2 shadow-xl'>
              <textarea
                placeholder={selectedFunc?.prompt.split(',')[0] || 'Nhập câu hỏi của bạn...'}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                rows={1}
                className='max-h-32 flex-1 resize-none overflow-y-auto border-none px-4 py-3 text-gray-800 placeholder-gray-400 outline-none'
                style={{ minHeight: '48px' }}
              />

              <Upload showUploadList={false} beforeUpload={handleImageUpload} accept='image/*'>
                <Button
                  icon={<PictureOutlined />}
                  size='large'
                  className='hover:border-orange-300 hover:bg-orange-50'
                />
              </Upload>

              <Button
                type='primary'
                icon={<SendOutlined />}
                onClick={handleSend}
                loading={loading}
                size='large'
                className='border-none bg-gradient-to-r from-orange-500 to-orange-400 shadow-md hover:from-orange-600 hover:to-orange-500'
                style={{ borderRadius: 12 }}
              />
            </div>

            <p className='mt-2 text-center text-xs text-gray-500'>
              Nhấn <kbd className='rounded border border-gray-300 bg-gray-100 px-1.5 py-0.5'>Enter</kbd> để gửi,{' '}
              <kbd className='rounded border border-gray-300 bg-gray-100 px-1.5 py-0.5'>Shift + Enter</kbd> để xuống
              dòng
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        kbd {
          font-family: monospace;
          font-size: 0.75rem;
        }
      `}</style>
    </div>
  )
}

export default ExercisePage
