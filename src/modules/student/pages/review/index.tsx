import { useMemo, useState } from 'react'
import { Card, Typography, Select, Button, Spin, message } from 'antd'

import Sidebar from '@/shared/components/Sidebar'
import { GeminiService, ChatMessage } from '@/modules/ai/pages/ai/Service/gemini.service'
import Quiz, { QuizQuestion } from './Quiz'

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
  return `Tạo một bài thi trắc nghiệm cho học sinh với các tham số:
- Môn: ${subjectLabel}
- Lớp: ${grade}
- Mức độ: ${levelLabel}
- Chủ đề: ${topicLabel}

Yêu cầu:
1. Tạo 10 câu hỏi trắc nghiệm (nếu mức độ Dễ thì 8 câu, Trung bình 10 câu, Khó 12 câu)
2. Mỗi câu hỏi có 4 đáp án (A, B, C, D)
3. Chỉ có 1 đáp án đúng cho mỗi câu
4. Mỗi câu hỏi cần có giải thích ngắn gọn

Trả về KẾT QUẢ DUY NHẤT dưới dạng JSON với format sau (KHÔNG có text thừa, KHÔNG có markdown, CHỈ JSON thuần):
{
  "questions": [
    {
      "question": "Nội dung câu hỏi",
      "options": ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
      "correctAnswer": 0,
      "explanation": "Giải thích ngắn gọn tại sao đáp án này đúng"
    }
  ]
}

QUAN TRỌNG:
- CHỈ trả về JSON, KHÔNG có text thừa, KHÔNG có markdown code block
- correctAnswer là index (0, 1, 2, hoặc 3) của đáp án đúng trong mảng options
- Tất cả nội dung bằng tiếng Việt
- Câu hỏi phải phù hợp với mức độ ${levelLabel} và lớp ${grade}`
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
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([])

  // Computed values
  const topicOptions = useMemo(() => SUBJECT_TOPICS[subject] || [], [subject])

  // Parse JSON from AI response
  const parseQuizJSON = (text: string): QuizQuestion[] => {
    try {
      // Try to extract JSON from markdown code blocks
      const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/) || text.match(/(\{[\s\S]*\})/)
      const jsonString = jsonMatch ? jsonMatch[1] : text.trim()
      
      // Remove any leading/trailing whitespace and parse
      const parsed = JSON.parse(jsonString.trim())
      
      if (parsed.questions && Array.isArray(parsed.questions)) {
        return parsed.questions.map((q: any) => ({
          question: q.question || '',
          options: q.options || [],
          correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : parseInt(q.correctAnswer) || 0,
          explanation: q.explanation || ''
        }))
      }
      
      throw new Error('Invalid format')
    } catch (error) {
      console.error('Error parsing quiz JSON:', error)
      message.error('Không thể parse dữ liệu từ AI. Vui lòng thử lại!')
      return []
    }
  }

  // Event Handlers
  const handleGenerate = async () => {
    try {
      setLoading(true)
      setQuizQuestions([])

      const subjectLabel = SUBJECTS.find(s => s.value === subject)?.label || subject
      const levelLabel = LEVELS.find(l => l.value === level)?.label || level
      const topicLabel = topicOptions.find(t => t.value === topic)?.label || topic

      const prompt = generateQuizPrompt(subjectLabel, grade, levelLabel, topicLabel)

      const messages: ChatMessage[] = [
        { role: 'user', content: prompt, timestamp: new Date() }
      ]

      const aiResponse = await GeminiService.chat(messages, subjectLabel)
      const questions = parseQuizJSON(aiResponse)
      
      if (questions.length > 0) {
        setQuizQuestions(questions)
        message.success(`Đã tạo ${questions.length} câu hỏi trắc nghiệm!`)
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

  const handleQuizComplete = (score: number, total: number) => {
    const percentage = Math.round((score / total) * 100)
    if (percentage >= 80) {
      message.success(`Xuất sắc! Bạn đã đạt ${percentage}%`)
    } else if (percentage >= 50) {
      message.info(`Tốt! Bạn đã đạt ${percentage}%`)
    } else {
      message.warning(`Cần cố gắng thêm! Bạn đã đạt ${percentage}%`)
    }
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

          {quizQuestions.length > 0 && !loading && (
            <div className="mt-4">
              <Quiz questions={quizQuestions} onComplete={handleQuizComplete} />
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
