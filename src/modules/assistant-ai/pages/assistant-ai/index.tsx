import React, { useState, useEffect } from 'react'
import { Button, Card, Col, Image, Input, Row, Spin, Typography, message, Upload } from 'antd'
import { PictureOutlined, SendOutlined } from '@ant-design/icons'
import axios from 'axios'
import Sidebar from '@/shared/components/Sidebar'

const { Title, Text } = Typography
const { TextArea } = Input

// Hàm format
const formatMarkdown = (text: string) => {
  if (!text) return "";
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")  
    .replace(/^\* (.*)$/gm, "- $1")  
    .replace(/\\n/g, "\n")
    .trim();
};

// 6 chức năng
const FUNCTIONS = [
  { key: 'method', label: 'Gợi ý phương pháp giảng dạy', prompt: 'Học sinh lớp : (Ví dụ lớp 1,2),Môn học : (Ví dụ Toán, Tiếng Anh),Tên bài học : (Ví dụ: Phép cộng),Phương pháp dạy học : (Ví dụ: Phương pháp truyền thống)' },
  { key: 'concept', label: 'Giải thích khái niệm', prompt: 'Hãy giải thích khái niệm : (Ví dụ: Khái niệm toán)' },
  { key: 'quiz', label: 'Đề xuất câu đố vui tư duy', prompt: 'Tạo các câu hỏi đố vui giúp học sinh tư duy: Môn : (Ví dụ: Toán),Tên bài học : (Ví dụ: Phép cộng)' },
  { key: 'example', label: 'Tạo ví dụ thực tế', prompt: 'Soạn ví dụ thực tế :Nội dung kiến thức : (Ví dụ: Phép cộng)' },
  { key: 'slide', label: 'Soạn slide trình chiếu', prompt: 'Soạn slide trình chiếu :Môn học : (Ví dụ: Toán),Tên bài học : (Ví dụ: Phép cộng),Slide: (Ví dụ: số trang)' },
  { key: 'flashcards', label: 'Tạo bộ ghi nhớ ảo', prompt: 'Tạo bộ ghi nhớ ảo (flashcards) :Môn học : (Ví dụ: Toán),Tên bài học : (Ví dụ: Phép cộng),Flashcards: (Ví dụ: số thẻ)' },
]

const API_URL = 'http://localhost:5001/api/v1/exercise/chat'

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

  useEffect(() => {
    const selectedFunc = FUNCTIONS.find(f => f.key === activeFunction)
    if (selectedFunc) {
      setInputValue(selectedFunc.prompt)   // reset input
      setMessages([])                      // clear chat history
      setSelectedImage(null)               // clear file
      setImagePreview('')                  // clear preview
    }
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

  const handleSend = async () => {
    if (!inputValue.trim() && !selectedImage) return;
  
    const newUserMessage: ChatMessage = {
      content: inputValue,
      imageUrl: imagePreview || undefined,
    };
    setMessages((prev) => [...prev, newUserMessage]);
    setLoading(true);
  
    try {
      const formData = new FormData();
      formData.append("function", activeFunction);
      formData.append("prompt", newUserMessage.content);
      if (selectedImage) {
        formData.append("image", selectedImage); // gửi file thật, không phải preview
      }
  
      const res = await axios.post(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      const aiResponse: ChatMessage = {
        content: res.data?.answer || "AI không trả lời được.",
      };
      setMessages((prev) => [...prev, aiResponse]);
  
      // ✅ Reset sau khi API trả về
      setInputValue(FUNCTIONS.find((f) => f.key === activeFunction)?.prompt || "");
      setSelectedImage(null);
      setImagePreview("");
    } catch (err) {
      message.error("Có lỗi khi gửi câu hỏi.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex min-h-screen mr-40">
      <Sidebar />
      <div className="ml-[200px] w-full p-6 pb-48 max-w-[1100px] mx-auto">
        <div className="text-center mb-8">
          <Title level={2} style={{ color: "#E8612A" }}>Trợ lý AI</Title>
          <Text className="text-lg text-gray-700">
            GEN AI hỗ trợ giải bài tập nhanh chóng chính xác
          </Text>
        </div>

        {/* Function Grid */}
        <Row gutter={[12, 12]} className="mb-8">
          {FUNCTIONS.map((func) => (
            <Col xs={24} sm={12} md={8} key={func.key}>
              <Card
                hoverable
                onClick={() => setActiveFunction(func.key)}
                style={{
                  borderColor: activeFunction === func.key ? '#E8612A' : '#e6e6e6',
                  borderRadius: 12,
                }}
              >
                <Text strong style={{ color: activeFunction === func.key ? '#E8612A' : '#333' }}>
                  {func.label}
                </Text>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Chat Messages */}
        <div className="space-y-4 mb-8">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${index % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${index % 2 === 0 ? 'bg-[#E8612A] text-white' : 'bg-gray-100 border border-gray-200 text-gray-800'}`}>
                {msg.imageUrl && <Image src={msg.imageUrl} width={200} className="rounded-lg mb-2" />}
                <div className="whitespace-pre-wrap">
                  {formatMarkdown(msg.content)}
                </div>
              </div>
            </div>
          ))}
          {loading && <Spin tip="AI đang suy nghĩ..." />}
        </div>

        {/* Input */}
        <div className="fixed bottom-0 left-[200px] right-0 bg-white p-4 border-t border-gray-200">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 max-w-[1100px] mx-auto flex items-center gap-3">
            {imagePreview && (
              <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
                <Image src={imagePreview} width={60} height={60} className="rounded-lg object-cover" />
                <Button type="text" onClick={removeSelectedImage} className="text-red-500">✕</Button>
              </div>
            )}
            <TextArea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              autoSize={{ minRows: 1, maxRows: 4 }}
              className="flex-1"
            />
            <Upload showUploadList={false} beforeUpload={handleImageUpload} accept="image/*">
              <Button icon={<PictureOutlined />} />
            </Upload>
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSend}
              loading={loading}
              style={{ background: "#E8612A", borderRadius: 25 }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExercisePage
