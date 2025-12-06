import { useState, useRef } from 'react'
import { Button, Card, Input, Spin, Tooltip, Typography, message, Alert } from 'antd'
import { CalendarOutlined, AimOutlined, ReadOutlined, RocketOutlined, EditOutlined, MedicineBoxOutlined, SendOutlined } from '@ant-design/icons'

import Sidebar from '@/shared/components/Sidebar'
import { GeminiService, type ChatMessage } from '@/modules/ai/pages/ai/Service/gemini.service'
import ExportStudyPlan, { type StudyPlan } from './ExportStudyPlan'

const { Title, Text } = Typography

// Plan types
type PlanKey = 'general' | 'exam' | 'ability' | 'singleSubject' | 'summer' | 'weakStudents'

const PLAN_TYPES: { key: PlanKey; title: string; icon: React.ReactNode; description: string }[] = [
  { key: 'general', title: 'Kế hoạch học tập tổng quát', icon: <CalendarOutlined />, description: 'Lập kế hoạch tổng thể theo thời gian' },
  { key: 'exam', title: 'Kế hoạch ôn thi', icon: <RocketOutlined />, description: 'Ôn thi theo mục tiêu và thời gian thi' },
  { key: 'ability', title: 'Theo năng lực học sinh', icon: <AimOutlined />, description: 'Cá nhân hoá theo năng lực hiện tại' },
  { key: 'singleSubject', title: 'Chuyên sâu cho một môn', icon: <ReadOutlined />, description: 'Tập trung một môn cụ thể' },
  { key: 'summer', title: 'Kế hoạch học tập dịp hè', icon: <EditOutlined />, description: 'Ôn tập/tiến bộ trong kỳ nghỉ' },
  { key: 'weakStudents', title: 'Cho học sinh yếu', icon: <MedicineBoxOutlined />, description: 'Cải thiện lỗ hổng kiến thức' }
]

// Placeholders shown in the fixed input based on plan type (follow the images)
const PLACEHOLDER_BY_TYPE: Record<PlanKey, string> = {
  general:
    'Học sinh lớp: [lớp, ví dụ: lớp 11]\nThời gian: [một tuần/ một tháng/ một học kỳ/ cả năm học]\nMôn học ưu tiên: [ví dụ: Toán, Địa lý, Anh...]',
  exam:
    'Học sinh lớp: [lớp, ví dụ: lớp 11]\nÔn thi: [môn gì/ kỳ thi nào, ví dụ: thi cuối kỳ, thi học kỳ]\nThời gian: [thời gian từ đây cho đến lúc thi, ví dụ: 1 tuần]',
  ability:
    'Học sinh lớp: [lớp, ví dụ: lớp 11]\nNăng lực: [tốt/khá/đạt/CD]\nMục tiêu cho từng môn: [ví dụ: Toán từ 6 → 7, Anh từ 5 → 6.5]',
  singleSubject:
    'Học sinh lớp: [lớp, ví dụ: lớp 11]\nMôn: [ví dụ: Toán]\nMục tiêu: [ví dụ: Toán – đạt 8 điểm, giỏi giải phương trình/Tiếng Anh – đạt 7.5 IELTS, giỏi kỹ năng đọc hiểu]',
  summer:
    'Học sinh lớp: [lớp, ví dụ: lớp 11]\nThời gian: [ví dụ: 2 tháng]\nMục tiêu: [ví dụ:  ôn lại kiến thức cũ/học trước kiến thức mới/cải thiện môn yếu]',
  weakStudents:
    'Học sinh lớp: [lớp, ví dụ: lớp 11]\nMôn học: [liệt kê các môn yếu]\nMục tiêu: [ví dụ: Toán từ 3 → 5, Anh từ 4 → 6]\nThời gian: [1 tháng/1 học kỳ]'
}

// Prompt builders per type
const buildPrompt = (type: PlanKey, userInput: string) => {
  const baseGuide = `Bạn là cố vấn học tập. Trả về kết quả JSON với schema: { "title": string, "sections": [{ "label": string, "items": string[] }] }. KHÔNG kèm giải thích hay markdown, chỉ trả JSON hợp lệ.

YÊU CẦU CHI TIẾT CAO:
- Các "sections" nên bao gồm (tuỳ ngữ cảnh):
  1) Mục tiêu SMART (ít nhất 5 mục)
  2) Kiến thức nền tảng cần nắm (>= 8 gạch đầu dòng)
  3) Lộ trình theo tuần (mỗi tuần nêu mục tiêu, đầu việc chính)
  4) Lịch học hằng ngày mẫu (sáng/chiều/tối, thời lượng từng phiên)
  5) Nhiệm vụ theo từng môn/chủ đề (>= 8 mục)
  6) Tài nguyên & phương pháp (nguồn học, kỹ thuật ghi nhớ, Pomodoro, Active Recall...)
  7) Kiểm tra – đánh giá (KPI/quiz/đề thi thử; tần suất; tiêu chí đạt)
  8) Rủi ro & biện pháp (xao nhãng, thiếu thời gian, mất động lực)
  9) Mẹo duy trì & sức khoẻ (ngủ, ăn, vận động)
- Nếu đầu vào chưa đúng mẫu hoặc thiếu thông tin thì CHỈ TRẢ VỀ DUY NHẤT một section có label "Yêu cầu bổ sung" (không thêm các section khác) và liệt kê ≥5 câu hỏi cụ thể để người dùng trả lời.
- Mỗi section trả về mảng "items" là các gạch đầu dòng ngắn gọn, hành động được.
- Ngôn ngữ: tiếng Việt, súc tích, rõ ràng, đúng chính tả.`
  const header = {
    general: 'Kế hoạch học tập tổng quát',
    exam: 'Kế hoạch ôn thi',
    ability: 'Kế hoạch học tập theo năng lực học sinh',
    singleSubject: 'Kế hoạch học tập chuyên sâu cho một môn',
    summer: 'Kế hoạch học tập dịp hè',
    weakStudents: 'Kế hoạch học tập cho học sinh yếu'
  }[type]

  return `${header}\n\nThông tin đầu vào của học sinh:\n${userInput}\n\n${baseGuide}`
}

const exampleByType = (type: PlanKey) => {
  switch (type) {
    case 'general':
      return 'Học sinh lớp: lớp 11\nThời gian: 1 học kỳ\nMôn học ưu tiên: Toán, Địa lý, Anh';
    case 'exam':
      return 'Học sinh lớp: lớp 12\nÔn thi: thi cuối kỳ môn Toán\nThời gian: 3 tuần';
    case 'ability':
      return 'Học sinh lớp: lớp 10\nNăng lực: khá\nMục tiêu cho từng môn: Toán 7→8; Anh 6→7';
    case 'singleSubject':
      return 'Học sinh lớp: lớp 11\nMôn: Toán\nMục tiêu: đạt 8 điểm, vững giải phương trình';
    case 'summer':
      return 'Học sinh lớp: lớp 9\nThời gian: 2 tháng\nMục tiêu: ôn kiến thức cũ, học trước kiến thức mới';
    case 'weakStudents':
      return 'Học sinh lớp: lớp 8\nMôn học: Toán, Vật lý\nMục tiêu: Toán 3→5; Lý 4→6\nThời gian: 1 tháng';
  }
}

// Basic client-side validation to avoid over-generating with ambiguous inputs
const isInputInsufficient = (type: PlanKey, text: string): boolean => {
  const t = text.trim().toLowerCase()
  if (t.length < 20) return true
  // Require at least two key-value style hints (using ":" or line breaks with keywords)
  const hasColon = t.includes(':')
  const keywordHits = ['lớp', 'môn', 'thời gian', 'mục tiêu', 'ôn thi'].filter((k) => t.includes(k)).length
  if (!hasColon && keywordHits < 2) return true
  // Type-specific minimal cues
  if (type === 'singleSubject' && !t.includes('môn')) return true
  if (type === 'exam' && !t.includes('ôn thi') && keywordHits < 3) return true
  return false
}

const buildRequestMoreInfoPlan = (type: PlanKey): StudyPlan => {
  const commonQuestions = [
    'Bạn đang học lớp/khối nào?',
    'Bạn muốn học/ôn môn nào là trọng tâm?',
    'Thời gian thực hiện kế hoạch là bao lâu?',
    'Mục tiêu điểm số/KPI cụ thể mong muốn là gì?',
    'Thời gian rảnh trong tuần và hạn chế cá nhân?',
  ]
  const extra: string[] =
    type === 'exam'
      ? ['Kỳ thi gì? (giữa kỳ/cuối kỳ/THPTQG/IELTS...)', 'Ngày thi dự kiến?']
      : type === 'singleSubject'
        ? ['Môn cụ thể nào? (Toán/Địa lý/Anh...)', 'Phần kiến thức yếu nhất hiện tại?']
        : type === 'weakStudents'
          ? ['Những môn đang yếu nhất?', 'Mục tiêu tăng bao nhiêu điểm cho mỗi môn?']
          : []
  return {
    title: 'Yêu cầu bổ sung thông tin',
    sections: [
      {
        label: 'Yêu cầu bổ sung',
        items: [...commonQuestions, ...extra]
      }
    ]
  }
}

const StudyPlanPage = () => {
  const [active, setActive] = useState<PlanKey>('general')
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string>('')
  const [plan, setPlan] = useState<StudyPlan | null>(null)

  const inputRef = useRef<any>(null)

  const handleChangeType = (type: PlanKey) => {
    setActive(type)
    // reset all user inputs and results for a fresh start
    setInputValue('')
    setResult('')
    setPlan(null)
    // focus input for convenience
    setTimeout(() => inputRef.current?.focus?.(), 0)
  }

  const tryParsePlan = (text: string): StudyPlan | null => {
    // Clean fenced code blocks if any
    const cleaned = text.replace(/```json|```/g, '').trim()
    try {
      const obj = JSON.parse(cleaned)
      if (obj && obj.title && Array.isArray(obj.sections)) {
        return {
          title: obj.title,
          sections: (obj.sections || []).map((s: any) => ({ label: s.label, items: s.items || [] }))
        }
      }
      return null
    } catch {
      return null
    }
  }

  const handleGenerate = async () => {
    if (!inputValue.trim()) return
    try {
      setIsLoading(true)
      setResult('')
      setPlan(null)
      // Guard: avoid calling AI when input is clearly insufficient
      if (isInputInsufficient(active, inputValue)) {
        setPlan(buildRequestMoreInfoPlan(active))
        message.warning('Thông tin chưa đủ. Vui lòng bổ sung theo gợi ý.')
        return
      }
      const prompt = buildPrompt(active, inputValue.trim())
      const messages: ChatMessage[] = [{ role: 'user', content: prompt, timestamp: new Date() }]
      let aiText = await GeminiService.chat(messages, 'Kế hoạch học tập')
      setResult(aiText)

      let parsed = tryParsePlan(aiText)
      if (!parsed) {
        // Fallback: force JSON conversion
        const forcePrompt = `Chỉ TRẢ JSON đúng schema {"title":string,"sections":[{"label":string,"items":string[]}]}. Nếu thiếu thông tin hãy thêm section "Yêu cầu bổ sung" với ≥5 câu hỏi. Nội dung: ${inputValue.trim()}`
        const retryMessages: ChatMessage[] = [{ role: 'user', content: forcePrompt, timestamp: new Date() }]
        aiText = await GeminiService.chat(retryMessages, 'Kế hoạch học tập (chuẩn hoá JSON)')
        setResult(aiText)
        parsed = tryParsePlan(aiText)
      }
      if (parsed) {
        setPlan(parsed)
      } else {
        // Guide user with example template
        message.warning('Thông tin chưa đúng mẫu. Vui lòng nhập theo gợi ý bên dưới.')
        setInputValue(exampleByType(active))
        setTimeout(() => inputRef.current?.focus?.(), 0)
      }
      message.success('Đã tạo kế hoạch học tập!')
    } catch (e) {
      message.error('Không thể tạo kế hoạch. Vui lòng thử lại!')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-full bg-gray-50">
      <Sidebar />
      <div className="flex flex-1 flex-col h-full overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="max-w-[1100px] mx-auto relative min-h-full pb-24">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Title level={1} className="!text-orange-500 !mb-0">Lập kế hoạch học tập</Title>
              </div>
              <Text className="text-lg text-gray-700">GEN AI giúp bạn xây dựng kế hoạch học tập hiệu quả</Text>
            </div>

            {/* Plan Type Pills (Mindmap-style buttons) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {PLAN_TYPES.map((p) => (
                <button
                  key={p.key}
                  onClick={() => handleChangeType(p.key)}
                  className={`w-full rounded-full border-2 px-6 py-4 text-left transition-all duration-200 flex items-center justify-between shadow-sm ${active === p.key
                    ? 'border-orange-400 bg-orange-50'
                    : 'border-orange-300 hover:bg-orange-50'
                    }`}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[18px] text-orange-500">{p.icon}</span>
                    <div>
                      <div className="font-semibold text-gray-800">{p.title}</div>
                      <div className="text-xs text-gray-500">{p.description}</div>
                    </div>
                  </div>
                  <span className="text-orange-400">➜</span>
                </button>
              ))}
            </div>

            {/* Result */}
            {(result || plan) && (
              <Card className="rounded-2xl mt-4" title="Kế hoạch được đề xuất" bodyStyle={{ padding: 16 }}>
                {plan ? (
                  <div className="space-y-4">
                    {/* Guidance when AI requests more information */}
                    {plan.sections.some((s) => (s.label || '').toLowerCase().includes('yêu cầu bổ sung')) && (
                      <Alert
                        type="warning"
                        showIcon
                        message="Thiếu thông tin đầu vào"
                        description={
                          <div className="text-sm">
                            Kế hoạch hiện chỉ có mục "Yêu cầu bổ sung". Hãy cung cấp thêm thông tin theo mẫu gợi ý để AI tạo kế hoạch chi tiết hơn.
                            <div className="mt-2">
                              <Button size="small" onClick={() => { setInputValue(exampleByType(active)); setTimeout(() => inputRef.current?.focus?.(), 0) }}>Điền mẫu gợi ý</Button>
                            </div>
                          </div>
                        }
                        className="mb-2"
                      />
                    )}
                    <div className="text-xl font-semibold">{plan.title}</div>
                    {(() => {
                      const hasRequest = plan.sections.some((s) => (s.label || '').toLowerCase().includes('yêu cầu bổ sung'))
                      const sectionsToShow = hasRequest ? plan.sections.filter((s) => (s.label || '').toLowerCase().includes('yêu cầu bổ sung')) : plan.sections
                      return sectionsToShow.map((s, idx) => (
                        <div key={idx}>
                          <div className="font-semibold text-gray-800 mb-1">{s.label}</div>
                          <ul className="list-disc pl-5 text-gray-700">
                            {s.items.map((it, i) => (
                              <li key={i}>{it}</li>
                            ))}
                          </ul>
                        </div>
                      ))
                    })()}
                  </div>
                ) : (
                  <div className="max-h-[65vh] overflow-y-auto p-1">
                    <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                      {result}
                    </div>
                  </div>
                )}

                {/* Export Button */}
                {plan && !plan.sections.some((s) => (s.label || '').toLowerCase().includes('yêu cầu bổ sung')) && (
                  <div className="mt-4 flex justify-end">
                    <ExportStudyPlan plan={plan} />
                  </div>
                )}
              </Card>
            )}

            {/* Spacer to avoid overlap with fixed bottom input */}
            <div className="h-24" />

          </div>
        </div>

        {/* Fixed Bottom Input (Mindmap-style) */}
        <div className="flex-shrink-0 p-6 pt-0 bg-gray-50 z-10">
          <div className="max-w-[1100px] mx-auto">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <Input.TextArea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  autoSize={{ minRows: 2, maxRows: 6 }}
                  className="flex-1 resize-none border-0 rounded-none p-0 shadow-none text-base leading-6 focus:outline-none focus:ring-0 focus:border-0"
                  placeholder={PLACEHOLDER_BY_TYPE[active]}
                  disabled={isLoading}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleGenerate()
                    }
                  }}
                />
                <div className="flex gap-2 flex-shrink-0">
                  <Tooltip title='Tạo kế hoạch'>
                    <Button
                      type='primary'
                      shape='circle'
                      size='large'
                      icon={isLoading ? <Spin size="small" /> : <SendOutlined />}
                      onClick={handleGenerate}
                      disabled={!inputValue.trim() || isLoading}
                      className="w-10 h-10 bg-orange-500 border-orange-500 hover:bg-orange-600 hover:border-orange-600"
                    />
                  </Tooltip>
                </div>
              </div>
            </div>

            <div className="text-center my-2">
              <Text type='secondary' className="text-xs">
                Khi đặt câu hỏi, bạn đồng ý với <strong>Điều khoản</strong> và <strong>Chính sách quyền riêng tư</strong>.
              </Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudyPlanPage
