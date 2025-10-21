import { useMemo, useState } from 'react'
import { Card, Typography, Select, Button, Spin, message } from 'antd'
import { ReadOutlined } from '@ant-design/icons'

import Sidebar from '@/shared/components/Sidebar'
import { GeminiService, ChatMessage } from '@/modules/ai/pages/ai/Service/gemini.service'
import { formatAIText } from '@/shared/lib/aiFormat'

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
const generatePrompt = (
  subjectLabel: string, 
  grade: string, 
  levelLabel: string, 
  topicLabel: string
): string => {
  return `Tạo nội dung ôn tập cho học sinh với các tham số:\n\n- Môn: ${subjectLabel}\n- Lớp: ${grade}\n- Mức độ: ${levelLabel}\n- Chủ đề: ${topicLabel}\n\nYêu cầu output bằng tiếng Việt, rõ ràng, có cấu trúc:\n1) Tóm tắt kiến thức trọng tâm (gạch đầu dòng)\n2) Công thức/định nghĩa quan trọng (code block hoặc định dạng dễ đọc)\n3) 3-5 bài luyện tập mẫu theo đúng chủ đề (ghi rõ câu hỏi → đáp án → giải thích ngắn)\n4) Mẹo ghi nhớ (ít nhất 3 mẹo cụ thể)\n5) Lỗi sai thường gặp (ít nhất 3 lỗi phổ biến)\n6) Đề xuất lộ trình ôn tập 3 ngày ngắn gọn.\n\nQUAN TRỌNG: \n- Bắt đầu trực tiếp với nội dung ôn tập, KHÔNG có lời chào hỏi hay giới thiệu vai trò gia sư\n- Đảm bảo hoàn thành đầy đủ tất cả 6 phần, không được cắt cụt\n- Phần "Mẹo ghi nhớ" và "Lỗi sai thường gặp" phải có nội dung cụ thể, không được để trống`
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

type ReviewFormProps = {
  subject: string
  grade: string
  level: string
  topic: string
  topicOptions: TopicOption[]
  onSubjectChange: (value: string) => void
  onGradeChange: (value: string) => void
  onLevelChange: (value: string) => void
  onTopicChange: (value: string) => void
}

const ReviewForm = ({
  subject,
  grade,
  level,
  topic,
  topicOptions,
  onSubjectChange,
  onGradeChange,
  onLevelChange,
  onTopicChange
}: ReviewFormProps) => (
  <Card className="rounded-2xl" bodyStyle={{ padding: 20 }}>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div>
        <div className="text-sm font-semibold mb-2">Môn:</div>
        <Select
          className="w-full"
          value={subject}
          options={SUBJECTS}
          onChange={(value) => {
            onSubjectChange(value)
            // Reset topic when subject changes
            const newTopics = SUBJECT_TOPICS[value] || []
            onTopicChange(newTopics[0]?.value || '')
          }}
        />
      </div>

      <div>
        <div className="text-sm font-semibold mb-2">Lớp:</div>
        <Select
          className="w-full"
          value={grade}
          options={GRADES}
          onChange={onGradeChange}
        />
      </div>

      <div>
        <div className="text-sm font-semibold mb-2">Mức độ:</div>
        <Select
          className="w-full"
          value={level}
          options={LEVELS}
          onChange={onLevelChange}
        />
      </div>

      <div>
        <div className="text-sm font-semibold mb-2">Chọn bài cần luyện tập:</div>
        <Select
          className="w-full"
          value={topic}
          options={topicOptions}
          onChange={onTopicChange}
        />
      </div>
    </div>
  </Card>
)

type ReviewResultProps = {
  result: string
}

const ReviewResult = ({ result }: ReviewResultProps) => (
  <Card 
    className="rounded-2xl mt-4" 
    title="Kết quả ôn tập" 
    bodyStyle={{ padding: 0 }}
  >
    <div className="max-h-[65vh] overflow-y-auto p-5">
      <div 
        className="prose prose-sm max-w-none" 
        dangerouslySetInnerHTML={{ __html: result }} 
      />
    </div>
  </Card>
)

const TermsFooter = () => (
  <div className="text-center mt-3">
    <Text type='secondary' className="text-xs">
      Khi đặt câu hỏi, bạn đồng ý với <strong>Điều khoản</strong> và <strong>Chính sách quyền riêng tư</strong>.
    </Text>
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
  const [result, setResult] = useState<string>('')

  // Computed values
  const topicOptions = useMemo(() => SUBJECT_TOPICS[subject] || [], [subject])

  // Event Handlers
  const handleGenerate = async () => {
    try {
      setLoading(true)
      setResult('')

      const subjectLabel = SUBJECTS.find(s => s.value === subject)?.label || subject
      const levelLabel = LEVELS.find(l => l.value === level)?.label || level
      const topicLabel = topicOptions.find(t => t.value === topic)?.label || topic

      const prompt = generatePrompt(subjectLabel, grade, levelLabel, topicLabel)

      const messages: ChatMessage[] = [
        { role: 'user', content: prompt, timestamp: new Date() }
      ]

      const aiText = await GeminiService.chat(messages, subjectLabel)
      setResult(formatAIText(aiText))
    } catch (err) {
      message.error('Không thể tạo nội dung ôn tập. Vui lòng thử lại!')
    } finally {
      setLoading(false)
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

          {result && (
            <Card className="rounded-2xl mt-4" title="Kết quả ôn tập" bodyStyle={{ padding: 0 }}>
              <div className="max-h-[65vh] overflow-y-auto p-5">
                <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: result }} />
              </div>
            </Card>
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
