import { useState } from 'react'
import { X, FileText } from 'lucide-react'
import { GeminiService } from '@/modules/ai/pages/ai/Service/gemini.service'
import Sidebar from '@/shared/components/Sidebar'

// Mock GeminiService - Replace with your actual service

const Initiative = () => {
  const [formData, setFormData] = useState({
    who: '',
    researchObject: '',
    difficulty: '',
    solution: ''
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleClear = () => {
    setFormData({
      who: '',
      researchObject: '',
      difficulty: '',
      solution: ''
    })
    setResult('')
  }

  const handleSubmit = async () => {
    if (!formData.who || !formData.researchObject) {
      return
    }

    setLoading(true)
    setResult('')

    try {
      // Tạo prompt từ form data
      const prompt = `Hãy viết một sáng kiến kinh nghiệm cho giáo viên với thông tin sau:

Bạn là ai: ${formData.who}
Đối tượng nghiên cứu: ${formData.researchObject}
Khó khăn cần giải quyết: ${formData.difficulty || 'Chưa có thông tin'}
Ý tưởng giải pháp: ${formData.solution || 'Chưa có thông tin'}

Hãy viết một bài sáng kiến kinh nghiệm hoàn chỉnh với các phần:
1. Thông tin chung
2. Thực trạng vấn đề
3. Giải pháp đề xuất
4. Kết quả thực hiện
5. Kết luận và khuyến nghị

Viết bằng tiếng Việt, chuyên nghiệp và có cấu trúc rõ ràng`

      // Gọi API giống ExercisePage
      const messages = [
        {
          role: 'assistant' as const,
          content: '',
          timestamp: new Date()
        },
        {
          role: 'user' as const,
          content: prompt,
          timestamp: new Date()
        }
      ]

      const aiResponse = await GeminiService.chat(messages, '', undefined)

      setResult(aiResponse)
    } catch (error) {
      setResult('❌ Có lỗi xảy ra khi tạo nội dung. Vui lòng thử lại!')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // Format markdown-like text to HTML
  const formatResult = (text: string) => {
    if (!text) return ''

    let html = text

    // --- BOLD (**) ---
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

    // --- ITALIC (*) ---
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')

    // --- TIÊU ĐỀ SỐ: "1. THÔNG TIN CHUNG" ---
    html = html.replace(/^(\d+)\.\s+([^\n]+)/gm, '<h2 class="text-xl font-bold mt-6 mb-3">$1. $2</h2>')

    // --- BULLET "* ..." ---
    // Thêm <li> trước, rồi wrap tất cả li thành <ul>
    html = html.replace(/^\*\s+(.*)$/gm, '<li>$1</li>')

    // --- Wrap <ul> cho các li liên tiếp ---
    html = html.replace(/(<li>[\s\S]*?<\/li>)/g, (match) => {
      // Nếu match nhiều li liên tiếp, wrap bằng ul
      const liGroup = match
        .split('</li>')
        .filter((l) => l.trim())
        .map((l) => l + '</li>')
        .join('')
      return `<ul class="list-disc ml-6 mb-3">${liGroup}</ul>`
    })

    // --- Các đoạn văn ---
    html = html.replace(/^\s*(?!<h2|<ul|<li|<p)(.+)$/gm, '<p class="mb-3 leading-relaxed">$1</p>')

    // --- Xóa thừa dòng trắng liên tiếp ---
    html = html.replace(/\n{2,}/g, '')

    return html
  }

  const roleLabels: Record<string, string> = {
    'giao-vien-mam-non': 'Giáo viên mầm non',
    'giao-vien-tieu-hoc': 'Giáo viên tiểu học',
    'giao-vien-trung-hoc': 'Giáo viên trung học',
    'giao-vien-thpt': 'Giáo viên THPT',
    'quan-ly-truong': 'Quản lý trường'
  }

  const objectLabels: Record<string, string> = {
    'hoc-sinh': 'Học sinh',
    'gia-vien': 'Giáo viên',
    'nha-truong': 'Nhà trường',
    'mon-hoc': 'Môn học'
  }

  return (
    <div className='flex min-h-screen bg-gray-50'>
      <Sidebar></Sidebar>
      {/* Left Panel - Input Form */}
      <div></div>
      <div className='flex w-[520px] flex-col border-r border-gray-200 bg-white'>
        <div className='border-b border-gray-200 p-6'>
          <h2 className='text-lg font-semibold text-gray-800'>Nhập dữ liệu</h2>
        </div>

        <div className='flex-1 space-y-5 overflow-y-auto p-6'>
          {/* Bạn là ai? */}
          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700'>
              Bạn là ai? <span className='text-red-500'>*</span>
            </label>
            <select
              value={formData.who}
              onChange={(e) => handleChange('who', e.target.value)}
              className='w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-orange-500'
            >
              <option value=''>Chọn giá trị</option>
              <option value='giao-vien-mam-non'>Giáo viên mầm non</option>
              <option value='giao-vien-tieu-hoc'>Giáo viên tiểu học</option>
              <option value='giao-vien-trung-hoc'>Giáo viên trung học</option>
              <option value='giao-vien-thpt'>Giáo viên THPT</option>
              <option value='quan-ly-truong'>Quản lý trường</option>
            </select>
          </div>

          {/* Đối tượng nghiên cứu */}
          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700'>
              Đối tượng nghiên cứu <span className='text-red-500'>*</span>
            </label>
            <select
              value={formData.researchObject}
              onChange={(e) => handleChange('researchObject', e.target.value)}
              className='w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-orange-500'
            >
              <option value=''>Chọn giá trị</option>
              <option value='hoc-sinh'>Học sinh</option>
              <option value='gia-vien'>Giáo viên</option>
              <option value='nha-truong'>Nhà trường</option>
              <option value='mon-hoc'>Môn học</option>
            </select>
          </div>

          {/* Khó khăn cần giải quyết là gì? */}
          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700'>Khó khăn cần giải quyết là gì?</label>
            <textarea
              value={formData.difficulty}
              onChange={(e) => handleChange('difficulty', e.target.value)}
              placeholder='Mô tả khó khăn, vấn đề cần giải quyết...'
              rows={6}
              className='w-full resize-none rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-orange-500'
            />
          </div>

          {/* Ý tưởng giải pháp */}
          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700'>
              Ý tưởng giải pháp để giải quyết khó khăn trên
            </label>
            <textarea
              value={formData.solution}
              onChange={(e) => handleChange('solution', e.target.value)}
              placeholder='Đề xuất giải pháp của bạn...'
              rows={6}
              className='w-full resize-none rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-orange-500'
            />
          </div>

          <div className='flex items-center justify-between border-t border-gray-200 p-6'>
            <button
              onClick={handleClear}
              className='flex items-center gap-2 rounded-lg px-4 py-2 text-gray-700 transition-colors hover:bg-gray-100'
            >
              <X size={18} />
              Xóa
            </button>
            <button
              onClick={handleSubmit}
              disabled={!formData.who || !formData.researchObject || loading}
              className='flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-2 text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-300'
            >
              <FileText size={18} />
              Tạo nội dung
              {loading && (
                <span className='ml-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
              )}
            </button>
          </div>
        </div>

        {/* Bottom Buttons */}
      </div>

      {/* Right Panel - Result */}
      <div className='flex flex-1 flex-col overflow-y-auto'>
        <div className='flex items-center gap-3 bg-orange-500 px-6 py-4 text-white'>
          <FileText size={24} />
          <h1 className='text-xl font-semibold'>Trợ lý viết Sáng kiến kinh nghiệm cho giáo viên</h1>
        </div>

        <div className='border-b border-gray-200'>
          <div className='flex'>
            <button className='border-b-2 border-orange-500 px-6 py-3 text-sm font-medium text-orange-500'>
              Result
            </button>
          </div>
        </div>

        <div className='flex-1 overflow-y-auto p-8'>
          {loading ? (
            <div className='flex h-full items-center justify-center'>
              <div className='text-center'>
                <div className='mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent' />
                <p className='text-gray-600'>Đang tạo nội dung sáng kiến kinh nghiệm...</p>
              </div>
            </div>
          ) : result ? (
            <div className='mx-auto max-w-4xl'>
              <div className='rounded-lg border border-gray-200 bg-white p-8 shadow-sm'>
                {/* Metadata */}
                {(formData.who || formData.researchObject) && (
                  <div className='mb-6 border-b border-gray-200 pb-4'>
                    <div className='grid grid-cols-2 gap-4 text-sm'>
                      {formData.who && (
                        <div>
                          <span className='text-gray-500'>Người thực hiện:</span>
                          <span className='ml-2 font-medium text-gray-800'>{roleLabels[formData.who]}</span>
                        </div>
                      )}
                      {formData.researchObject && (
                        <div>
                          <span className='text-gray-500'>Đối tượng:</span>
                          <span className='ml-2 font-medium text-gray-800'>
                            {objectLabels[formData.researchObject]}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Content */}
                <div
                  className='prose prose-sm h-[calc(100vh-300px)] max-w-none overflow-y-auto'
                  dangerouslySetInnerHTML={{ __html: formatResult(result) }}
                />

                {/* Actions */}
                {/* <div className='mt-8 flex gap-3 border-t border-gray-200 pt-4'>
                  <button className='rounded-lg bg-orange-500 px-4 py-2 text-white transition-colors hover:bg-orange-600'>
                    📥 Tải xuống
                  </button>
                  <button className='rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50'>
                    📋 Sao chép
                  </button>
                </div> */}
              </div>
            </div>
          ) : (
            <div className='flex h-full items-center justify-center'>
              <div className='text-center'>
                <div className='mb-4 text-gray-300'>
                  <FileText size={64} className='mx-auto' />
                </div>
                <p className='text-lg text-gray-400'>Điền thông tin và nhấn "Tạo nội dung"</p>
                <p className='mt-2 text-sm text-gray-400'>AI sẽ tạo nội dung sáng kiến kinh nghiệm cho bạn</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .writing-mode-vertical {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
        .prose h1 {
          color: #1f2937;
        }
        .prose h2 {
          color: #f97316;
        }
        .prose p {
          color: #374151;
          line-height: 1.75;
        }
        .prose li {
          color: #374151;
        }
      `}</style>
    </div>
  )
}

export default Initiative
