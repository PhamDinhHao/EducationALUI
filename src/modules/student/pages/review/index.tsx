import { useMemo, useState } from 'react'
import { Card, Typography, Select, Button, Spin, message } from 'antd'

import Sidebar from '@/shared/components/Sidebar'
import { GeminiService, ChatMessage } from '@/modules/ai/pages/ai/Service/gemini.service'
import AdvancedQuiz, { QuizData, QuizResult } from './AdvancedQuiz'

// Types and Interfaces
interface SubjectOption {
  label: string
  value: string
}

interface TopicOption {
  label: string
  value: string
}

// Constants
const { Title, Text } = Typography

const SUBJECTS: SubjectOption[] = [
  { label: 'Toán học', value: 'math' },
  { label: 'Vật lý', value: 'physics' },
  { label: 'Hóa học', value: 'chemistry' },
  { label: 'Sinh học', value: 'biology' },
  { label: 'Địa lý', value: 'geography' },
  { label: 'Lịch sử', value: 'history' }
]

const LEVELS: SubjectOption[] = [
  { label: 'Dễ', value: 'easy' },
  { label: 'Trung bình', value: 'medium' },
  { label: 'Khó', value: 'hard' }
]

const GRADES: SubjectOption[] = Array.from({ length: 12 }, (_, i) => ({ 
  label: `Lớp ${i + 1}`, 
  value: `${i + 1}` 
}))

const SUBJECT_TOPICS: Record<string, TopicOption[]> = {
  math: [
    { label: 'Tập hợp và tổ hợp', value: 'set-combinatorics' },
    { label: 'Đại số', value: 'algebra' },
    { label: 'Hình học', value: 'geometry' },
    { label: 'Giải tích', value: 'calculus' }
  ],
  physics: [
    { label: 'Cơ học', value: 'mechanics' },
    { label: 'Điện - Từ', value: 'em' },
    { label: 'Quang học', value: 'optics' }
  ],
  chemistry: [
    { label: 'Hóa vô cơ', value: 'inorganic' },
    { label: 'Hóa hữu cơ', value: 'organic' }
  ],
  biology: [
    { label: 'Di truyền', value: 'genetics' },
    { label: 'Sinh thái học', value: 'ecology' }
  ],
  geography: [
    { label: 'Địa lý tự nhiên', value: 'natural' },
    { label: 'Địa lý kinh tế - xã hội', value: 'economic' }
  ],
  history: [
    { label: 'Lịch sử Việt Nam', value: 'vn' },
    { label: 'Lịch sử thế giới', value: 'world' }
  ]
}

// Utility Functions
const generateQuizPrompt = (
  subjectLabel: string, 
  grade: string, 
  levelLabel: string, 
  topicLabel: string
): string => {
  return `#NGỮ CẢNH

Bạn là một giáo viên dạy ${subjectLabel} có nhiều năm kinh nghiệm, am hiểu sâu sắc về tâm lý học sinh và phương pháp đánh giá. Đồng thời, bạn cũng là một chuyên gia lập trình web có khả năng xây dựng các ứng dụng giáo dục tương tác, bảo mật và kết nối với cơ sở dữ liệu.

#NGUỒN DỮ LIỆU

Nội dung để tạo câu hỏi và đáp án chỉ được phép lấy thông tin từ sách giáo khoa kết nối tri thức, bộ kết nối tri thức. Cụ thể là nội dung về chủ đề: ${topicLabel}. Tập trung hỏi vào các phần kiến thức trong chủ đề này.

#HƯỚNG DẪN CHI TIẾT

##1. Nội dung đề thi

Tạo một bộ đề kiểm tra gồm 20 câu hỏi, chia làm 3 phần:

###Phần 1: Trắc nghiệm khách quan nhiều lựa chọn (12 câu):
- Mỗi câu có 4 phương án (A, B, C, D), trong đó chỉ có duy nhất 1 đáp án đúng.
- Các phương án nhiễu phải hợp lý, có tính thách thức.

###Phần 2: Trắc nghiệm Đúng/Sai (4 câu):
Mỗi câu bao gồm 4 nhận định nhỏ (a, b, c, d), bao quát các cấp độ: Nhận biết, Thông hiểu, Vận dụng, Vận dụng cao. Mỗi nhận định có thể đúng hoặc sai.

###Phần 3: Trả lời ngắn (4 câu):
- Bao gồm các câu hỏi lý thuyết (ví dụ: đếm số phát biểu đúng/sai) và câu hỏi tính toán.
- Câu trả lời là một con số hoặc một chuỗi ký tự ngắn. Đáp án không vượt quá 4 ký tự (bao gồm cả dấu "-" hoặc "," nếu có, không tính số 0 ở đầu nếu là số nguyên).

##5. Quy trình tự kiểm tra và Đảm bảo chất lượng

TRƯỚC KHI TẠO RA SẢN PHẨM CUỐI CÙNG, bạn phải thực hiện một bước tự kiểm tra nội bộ để đảm bảo chất lượng học thuật cao nhất. Quy trình này bao gồm:

1. Đối chiếu Nguồn: So sánh từng câu hỏi, dữ kiện và đáp án với nội dung trong Sách giáo khoa để đảm bảo tính chính xác 100%.
2. Kiểm tra Đáp án: Xác thực lại rằng đáp án được đánh dấu là "đúng" thực sự là phương án chính xác nhất và không gây tranh cãi.
3. Loại bỏ Mơ hồ: Rà soát các câu hỏi và phương án nhiễu để đảm bảo chúng rõ ràng, không đa nghĩa, tránh gây hiểu lầm cho học sinh.
4. Kiểm tra Danh pháp: Đảm bảo tất cả thuật ngữ đều tuân thủ danh pháp quốc tế như trong sách giáo khoa.

#YÊU CẦU ĐỊNH DẠNG KẾT QUẢ ĐẦU RA

Trả về KẾT QUẢ DUY NHẤT dưới dạng JSON với format sau (KHÔNG có text thừa, KHÔNG có markdown, CHỈ JSON thuần):

{
  "part1": [
    {
      "question": "Nội dung câu hỏi",
      "options": ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
      "correctAnswer": 0,
      "explanation": "Giải thích ngắn gọn tại sao đáp án này đúng"
    }
  ],
  "part2": [
    {
      "question": "Cho các nhận định sau về [chủ đề]:",
      "statements": [
        {"text": "Nội dung nhận định a", "correct": true},
        {"text": "Nội dung nhận định b", "correct": false},
        {"text": "Nội dung nhận định c", "correct": true},
        {"text": "Nội dung nhận định d", "correct": false}
      ],
      "explanation": "Giải thích ngắn gọn"
    }
  ],
  "part3": [
    {
      "question": "Nội dung câu hỏi",
      "correctAnswer": "1234",
      "explanation": "Giải thích ngắn gọn"
    }
  ]
}

QUAN TRỌNG:
- CHỈ trả về JSON, KHÔNG có text thừa, KHÔNG có markdown code block
- correctAnswer trong part1 là index (0, 1, 2, hoặc 3) của đáp án đúng
- correctAnswer trong part3 là chuỗi tối đa 4 ký tự
- Tất cả nội dung bằng tiếng Việt
- Câu hỏi phải phù hợp với mức độ ${levelLabel} và lớp ${grade}
- Môn: ${subjectLabel}
- Chủ đề: ${topicLabel}`
}

// Components
const ReviewHeader = () => (
  <div className="text-center mb-8">
    <div className="flex items-center justify-center gap-3 mb-4">
      <Title level={1} className="!text-orange-500 !mb-0">Ôn tập</Title>
    </div>
    <Text className="text-lg text-gray-700">GEN AI hỗ trợ ôn tập kiến thức một cách nhanh chóng</Text>
  </div>
)

// Main Component
const ReviewPage = () => {
  // State
  const [subject, setSubject] = useState('geography')
  const [grade, setGrade] = useState('12')
  const [level, setLevel] = useState('easy')
  const [topic, setTopic] = useState('natural')
  const [loading, setLoading] = useState(false)
  const [quizData, setQuizData] = useState<QuizData | null>(null)

  // Computed values
  const topicOptions = useMemo(() => SUBJECT_TOPICS[subject] || [], [subject])

  // Parse JSON from AI response
  const parseQuizJSON = (text: string): QuizData | null => {
    try {
      // Try to extract JSON from markdown code blocks
      const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/) || text.match(/(\{[\s\S]*\})/)
      const jsonString = jsonMatch ? jsonMatch[1] : text.trim()
      
      // Remove any leading/trailing whitespace and parse
      const parsed = JSON.parse(jsonString.trim())
      
      if (parsed.part1 && parsed.part2 && parsed.part3) {
        return {
          part1: parsed.part1.map((q: any) => ({
            question: q.question || '',
            options: q.options || [],
            correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : parseInt(q.correctAnswer) || 0,
            explanation: q.explanation || ''
          })),
          part2: parsed.part2.map((q: any) => ({
            question: q.question || '',
            statements: q.statements || [],
            explanation: q.explanation || ''
          })),
          part3: parsed.part3.map((q: any) => ({
            question: q.question || '',
            correctAnswer: String(q.correctAnswer || ''),
            explanation: q.explanation || ''
          }))
        }
      }
      
      throw new Error('Invalid format')
    } catch (error) {
      console.error('Error parsing quiz JSON:', error)
      message.error('Không thể parse dữ liệu từ AI. Vui lòng thử lại!')
      return null
    }
  }

  // Event Handlers
  const handleGenerate = async () => {
    try {
      setLoading(true)
      setQuizData(null)

      const subjectLabel = SUBJECTS.find(s => s.value === subject)?.label || subject
      const levelLabel = LEVELS.find(l => l.value === level)?.label || level
      const topicLabel = topicOptions.find(t => t.value === topic)?.label || topic

      const prompt = generateQuizPrompt(subjectLabel, grade, levelLabel, topicLabel)

      const messages: ChatMessage[] = [
        { role: 'user', content: prompt, timestamp: new Date() }
      ]

      const aiResponse = await GeminiService.chat(messages, subjectLabel)
      const data = parseQuizJSON(aiResponse)
      
      if (data && data.part1.length > 0 && data.part2.length > 0 && data.part3.length > 0) {
        setQuizData(data)
        const totalQuestions = data.part1.length + data.part2.length + data.part3.length
        message.success(`Đã tạo ${totalQuestions} câu hỏi trắc nghiệm!`)
      } else {
        message.error('Không thể tạo câu hỏi. Vui lòng thử lại!')
      }
    } catch (err) {
      console.error('Error generating quiz:', err)
      message.error('Không thể tạo bài thi trắc nghiệm. Vui lòng thử lại!')
    } finally {
      setLoading(false)
    }
  }

  const handleQuizComplete = (result: QuizResult) => {
    const percentage = Math.round((result.score / result.total) * 100)
    if (percentage >= 80) {
      message.success(`Xuất sắc! Bạn đã đạt ${percentage}%`)
    } else if (percentage >= 50) {
      message.info(`Tốt! Bạn đã đạt ${percentage}%`)
    } else {
      message.warning(`Cần cố gắng thêm! Bạn đã đạt ${percentage}%`)
    }
  }

  const handleRetry = () => {
    setQuizData(null)
    handleGenerate()
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className=" w-full p-6 pb-24">
        <div className="max-w-[1100px] mx-auto">
          <ReviewHeader />
          
          <Card className="rounded-2xl" bodyStyle={{ padding: 20 }}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <div className="text-sm font-semibold mb-2">Môn:</div>
                <Select
                  className="w-full"
                  value={subject}
                  options={SUBJECTS}
                  onChange={(value) => {
                    setSubject(value)
                    const newTopics = SUBJECT_TOPICS[value] || []
                    setTopic(newTopics[0]?.value || '')
                  }}
                />
              </div>

              <div>
                <div className="text-sm font-semibold mb-2">Lớp:</div>
                <Select
                  className="w-full"
                  value={grade}
                  options={GRADES}
                  onChange={setGrade}
                />
              </div>

              <div>
                <div className="text-sm font-semibold mb-2">Mức độ:</div>
                <Select
                  className="w-full"
                  value={level}
                  options={LEVELS}
                  onChange={setLevel}
                />
              </div>

              <div>
                <div className="text-sm font-semibold mb-2">Chọn bài cần luyện tập:</div>
                <Select
                  className="w-full"
                  value={topic}
                  options={topicOptions}
                  onChange={setTopic}
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button 
                type="primary" 
                size="large" 
                className="!bg-orange-500 !border-orange-500" 
                onClick={handleGenerate} 
                disabled={loading}
              >
                {loading ? <Spin /> : 'BẮT ĐẦU ÔN TẬP'}
              </Button>
            </div>
          </Card>

          {loading && (
            <Card className="rounded-2xl mt-4" bodyStyle={{ padding: 40, textAlign: 'center' }}>
              <Spin size="large" />
              <div className="mt-4">
                <Text>Đang tạo bài thi trắc nghiệm...</Text>
              </div>
            </Card>
          )}

          {quizData && !loading && (
            <div className="mt-4">
              <AdvancedQuiz 
                quizData={quizData} 
                onComplete={handleQuizComplete}
                onRetry={handleRetry}
              />
            </div>
          )}

          <div className="text-center mt-3">
            <Text type='secondary' className="text-xs">
              Khi đặt câu hỏi, bạn đồng ý với <strong>Điều khoản</strong> và <strong>Chính sách quyền riêng tư</strong>.
            </Text>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReviewPage
