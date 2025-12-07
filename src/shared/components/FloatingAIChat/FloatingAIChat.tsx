import { useState, useRef, useEffect } from 'react'
import { Button, Input, message } from 'antd'
import { RobotOutlined, SendOutlined, CloseOutlined, UserOutlined } from '@ant-design/icons'
import { GeminiService, ChatMessage } from '@/modules/ai/pages/ai/Service/gemini.service'
import { ConversationManager, ConversationMessage } from '@/modules/ai/pages/ai/Service/conversation.manager'
import images from '@/assets/images'

const FloatingAIChat = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<ConversationMessage[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const conversationManagerRef = useRef<ConversationManager>()
  const sessionIdRef = useRef<string>('floating_ai_chat')

  // Initialize conversation manager
  if (!conversationManagerRef.current) {
    conversationManagerRef.current = new ConversationManager({
      maxRecentMessages: 8,
      autoSummarizeThreshold: 12
    })
    conversationManagerRef.current.createSession(sessionIdRef.current, 'Trợ lý AI')
  }

  // Scroll to bottom when new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: ConversationMessage = {
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    conversationManagerRef.current?.addMessage(sessionIdRef.current, 'user', userMessage.content)
    setInputValue('')
    setIsLoading(true)

    try {
      const context = conversationManagerRef.current?.getContext(sessionIdRef.current, 'Trợ lý AI') || {
        summary: '',
        recent: []
      }

      const messagesForGemini: ChatMessage[] = (context.recent || []).map(msg => ({
        role: (msg.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
        content: msg.content,
        timestamp: msg.timestamp
      }))

      const enhancedMessages: ChatMessage[] = [
        {
          role: 'assistant' as const,
          content: 'Bạn là GENAL - Trợ lý AI thân thiện và hữu ích. Hãy trả lời câu hỏi của người dùng một cách chi tiết, dễ hiểu và chính xác. Duy trì context của cuộc trò chuyện.',
          timestamp: new Date()
        },
        ...messagesForGemini
      ]

      const aiResponse = await GeminiService.chat(enhancedMessages, 'Trợ lý AI')

      const assistantMessage: ConversationMessage = {
        role: 'model',
        content: aiResponse,
        timestamp: new Date()
      }

      conversationManagerRef.current?.addMessage(sessionIdRef.current, 'model', assistantMessage.content)
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Có lỗi xảy ra khi chat với AI')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .floating-ai-icon {
            right: 24px !important;
            bottom: 90px !important;
            width: 50px !important;
            height: 50px !important;
          }
          .floating-chat-window {
            right: 24px !important;
            bottom: 150px !important;
            width: calc(100vw - 48px) !important;
            height: calc(100vh - 180px) !important;
          }
        }
      `}</style>
      {/* Floating AI Icon Button */}
      <div
        className="floating-ai-icon"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '80px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg,rgb(234, 194, 102) 0%, rgb(255, 102, 0) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(255, 102, 0, 0.4)',
          zIndex: 1000,
          transition: 'all 0.3s ease',
          border: '3px solid white'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)'
          e.currentTarget.style.boxShadow = '0 6px 25px rgba(255, 102, 0, 0.6)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(255, 102, 0, 0.4)'
        }}
      >
        <img src={images.icLogoAi} alt='Logo' className='w-full h-full object-cover' />
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div
          className="floating-chat-window"
          style={{
            position: 'fixed',
            bottom: '100px',
            right: '100px',
            width: '380px',
            maxWidth: 'calc(100vw - 48px)',
            height: '500px',
            maxHeight: 'calc(100vh - 140px)',
            borderRadius: '16px',
            background: 'white',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1001,
            overflow: 'hidden',
            border: '1px solid #e5e7eb'
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '16px',
              background: 'linear-gradient(135deg,rgb(234, 194, 102) 0%, rgb(255, 102, 0) 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center'}}>
              <img src={images.icLogoAi} width={60} alt='Logo' />
              <span style={{ fontWeight: 600, fontSize: '16px' }}>Trợ lý GenAI</span>
            </div>
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={() => setIsOpen(false)}
              style={{ color: 'white', padding: '4px' }}
            />
          </div>

          {/* Messages Area */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              background: '#f9fafb',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', color: '#6b7280', marginTop: '40px' }}>
                <img src={images.icLogoAi} alt='Logo' className='w-[50px] h-[50px] object-cover mx-auto mb-4' />
                <p style={{ fontSize: '14px' }}>Xin chào! Tôi là Trợ lý GenAI, trợ lý AI của bạn.</p>
                <p style={{ fontSize: '14px', marginTop: '4px' }}>Hãy hỏi tôi bất cứ điều gì bạn muốn!</p>
              </div>
            )}
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: '8px'
                }}
              >
                <div
                  style={{
                    maxWidth: '80%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: msg.role === 'user' 
                      ? 'linear-gradient(135deg,rgb(234, 194, 102) 0%, rgb(255, 102, 0) 100%)' 
                      : 'white',
                    color: msg.role === 'user' ? 'white' : '#1f2937',
                    boxShadow: msg.role === 'user' 
                      ? '0 2px 8px rgba(102, 126, 234, 0.3)' 
                      : '0 2px 4px rgba(0, 0, 0, 0.1)',
                    fontSize: '14px',
                    lineHeight: '1.5'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    {msg.role === 'user' ? (
                      <UserOutlined style={{ fontSize: '12px' }} />
                    ) : (
                      <RobotOutlined style={{ fontSize: '12px' }} />
                    )}
                    <span style={{ fontSize: '11px', opacity: 0.8 }}>
                      {msg.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: 'white',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <RobotOutlined style={{ fontSize: '12px', color: '#667eea' }} />
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>Đang suy nghĩ...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div
            style={{
              padding: '12px',
              background: 'white',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              gap: '8px',
              alignItems: 'flex-end'
            }}
          >
            <Input.TextArea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập câu hỏi của bạn..."
              autoSize={{ minRows: 1, maxRows: 4 }}
              style={{
                flex: 1,
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                padding: '8px 12px',
                fontSize: '14px'
              }}
              disabled={isLoading}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSend}
              loading={isLoading}
              disabled={!inputValue.trim()}
              style={{
                borderRadius: '12px',
                background: 'linear-gradient(135deg,rgb(234, 194, 102) 0%, rgb(255, 102, 0) 100%)',
                border: 'none',
                height: '40px',
                width: '40px',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            />
          </div>
        </div>
      )}
    </>
  )
}

export default FloatingAIChat

