import { useState } from 'react'
import { Document, Packer, Paragraph, TextRun } from 'docx'
import { saveAs } from 'file-saver'
import { useEffect } from 'react'
import { useBoundStore } from '@/shared/stores'
import { Save, FileDown, Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react'
import toast from 'react-hot-toast'
import { Question } from '@/shared/core/types'

const EXAM_STORAGE_KEY = 'exam_data'
export default function ExamEditor() {
  const [exam, setExam] = useState<any[]>([])
  const [expandedSections, setExpandedSections] = useState([0, 1, 2])
  const storeExam = useBoundStore((state) => state.exam)
  // Load dữ liệu từ localStorage hoặc store
  useEffect(() => {
    const data = localStorage.getItem(EXAM_STORAGE_KEY)
    if (data) {
      try {
        let parsed = JSON.parse(data)
        if (parsed && typeof parsed === 'object' && parsed.raw) {
          let raw = parsed.raw.replace(/```json|```/g, '').trim()
          parsed = JSON.parse(raw)
        }
        if (parsed) {
          setExam(parsed)
          return
        }
      } catch (err) {
        console.error('Lỗi parse localStorage:', err)
      }
    }
  }, [storeExam])
  // Toggle section expand/collapse
  const toggleSection = (index : number) => {
    setExpandedSections((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  // Edit question
  const handleEditQuestion = (sectionIdx : number, qIdx : number, value : string) => {
    setExam((prev : any[]) => {
      const newExam = [...prev]
      newExam[sectionIdx].questions[qIdx].question = value
      return newExam
    })
  }

  // Edit option
  const handleEditOption = (sectionIdx : number, qIdx : number, optIdx : number, value : string) => {
    setExam((prev : any[]) => {
      const newExam = [...prev]
      newExam[sectionIdx].questions[qIdx].options[optIdx] = value
      return newExam
    })
  }

  // Edit statement
  const handleEditStatement = (sectionIdx : number, qIdx : number, stmtIdx : number, value : string) => {
    setExam((prev) => {
      const newExam = [...prev]
      newExam[sectionIdx].questions[qIdx].statements[stmtIdx] = value
      return newExam
    })
  }

  // Edit answer
  const handleEditAnswer = (sectionIdx : number, qIdx : number, value : string) => {
    setExam((prev) => {
      const newExam = [...prev]
      newExam[sectionIdx].questions[qIdx].answer = value
      return newExam
    })
  }

  // Delete question
  const handleDeleteQuestion = (sectionIdx : number, qIdx : number) => {
    if (confirm('Xóa câu hỏi này?')) {
      setExam((prev) => {
        const newExam = [...prev]
        newExam[sectionIdx].questions.splice(qIdx, 1)
        return newExam
      })
    }
  }

  // Add question
  const handleAddQuestion = (sectionIdx : number) => {
    const section = exam[sectionIdx]
    let newQuestion

    if (section.type === 'Nhiều phương án lựa chọn') {
      newQuestion = {
        question: 'Câu hỏi mới',
        options: ['Đáp án A', 'Đáp án B', 'Đáp án C', 'Đáp án D'],
        answer: 'A'
      }
    } else if (section.type === 'Trắc nghiệm đúng sai') {
      newQuestion = {
        question: 'Câu hỏi mới',
        statements: ['Phát biểu a', 'Phát biểu b', 'Phát biểu c', 'Phát biểu d'],
        answer: ['a']
      }
    } else {
      newQuestion = {
        question: 'Câu hỏi mới',
        answer: 'Đáp án mẫu'
      }
    }

    setExam((prev) => {
      const newExam = [...prev]
      newExam[sectionIdx].questions.push(newQuestion)
      return newExam
    })
  }

  // Save to localStorage
  const handleSave = () => {
    localStorage.setItem('exam_data', JSON.stringify(exam))
    toast.success('✓ Đã lưu thành công!')
  }

  // Export Word
  const exportWord = async () => {
    const multipleChoices = exam.find((e : any) => e.type === 'Nhiều phương án lựa chọn')?.questions || []
    const trueFalse = exam.find((e : any) => e.type === 'Trắc nghiệm đúng sai')?.questions || []
    const shortAnswers = exam.find((e : any) => e.type === 'Trả lời ngắn')?.questions || []

    const children = []

    // Header
    children.push(
      new Paragraph({
        children: [new TextRun({ text: 'TRƯỜNG THPT ……………', bold: true })],
        alignment: 'center'
      }),
      new Paragraph({
        children: [new TextRun({ text: 'ĐỀ KIỂM TRA CUỐI KÌ II – NĂM HỌC 2024 – 2025', bold: true })],
        alignment: 'center'
      }),
      new Paragraph({
        children: [new TextRun({ text: 'MÔN: Lịch sử – LỚP 10', bold: true })],
        alignment: 'center'
      }),
      new Paragraph({
        children: [new TextRun({ text: 'Thời gian: 45 phút (không kể thời gian phát đề)\n\n' })],
        alignment: 'center'
      }),
      new Paragraph('Họ và tên:……………………………… Số báo danh:………………\n\n')
    )

    // Multiple Choice
    children.push(
      new Paragraph({
        children: [new TextRun({ text: 'PHẦN I (4,0 điểm). Trắc nghiệm nhiều lựa chọn\n', bold: true })]
      })
    )
    multipleChoices.forEach((q : Question, idx : number) => {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: `Câu ${idx + 1}. ${q.question}`, bold: true })]
        })
      )
      q.options?.forEach((opt : string, i : number) => {
        const letter = ['A', 'B', 'C', 'D'][i]
        children.push(
          new Paragraph({
            children: [new TextRun({ text: `${letter}. ${opt}` })],
            indent: { left: 400 }
          })
        )
      })
    })

    // True/False
    children.push(
      new Paragraph({
        children: [new TextRun({ text: '\nPHẦN II (2,0 điểm). Câu trắc nghiệm đúng sai\n', bold: true })]
      })
    )
    trueFalse.forEach((item : Question, index : number) => {
      const baseIndex = multipleChoices.length + index + 1
      children.push(
        new Paragraph({
          children: [new TextRun({ text: `Câu ${baseIndex}. ${item.question}`, bold: true })]
        })
      )
      item?.statements?.forEach((st : string) => {
        children.push(
          new Paragraph({
            children: [new TextRun(st)],
            indent: { left: 400 }
          })
        )
      })
    })

    // Short Answer
    children.push(
      new Paragraph({
        children: [new TextRun({ text: '\nPHẦN III (4,0 điểm). Trả lời ngắn\n', bold: true })]
      })
    )
    shortAnswers.forEach((q : Question, index : number) => {
      const baseIndex = multipleChoices.length + trueFalse.length + index + 1
      children.push(
        new Paragraph({
          children: [new TextRun({ text: `Câu ${baseIndex}. ${q.question}`, bold: true })]
        })
      )
    })

    const doc = new Document({ sections: [{ children }] })
    const blob = await Packer.toBlob(doc)
    saveAs(blob, 'exam.docx')
  }

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='mx-auto max-w-6xl'>
        {/* Header */}
        <div className='mb-6 rounded-lg bg-white p-6 shadow-sm'>
          <h1 className='mb-2 text-3xl font-bold text-gray-800'>Chỉnh sửa đề thi</h1>
          <p className='text-gray-600'>Chỉnh sửa nội dung trước khi xuất file Word</p>

          {/* Action buttons */}
          <div className='mt-4 flex gap-3'>
            <button
              onClick={handleSave}
              className='flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white transition hover:bg-green-700'
            >
              <Save size={18} />
              Lưu thay đổi
            </button>
            <button
              onClick={exportWord}
              className='flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700'
            >
              <FileDown size={18} />
              Xuất Word
            </button>
          </div>
        </div>

        {/* Exam Sections */}
        {exam.map((section : any, sectionIdx : number) => (
          <div key={sectionIdx} className='mb-6 overflow-hidden rounded-lg bg-white shadow-sm'>
            {/* Section Header */}
            <div
              onClick={() => toggleSection(sectionIdx)}
              className='flex cursor-pointer items-center justify-between bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white transition hover:from-indigo-600 hover:to-purple-700'
            >
              <div className='flex items-center gap-3'>
                <span className='text-2xl font-bold'>{sectionIdx === 0 ? 'I' : sectionIdx === 1 ? 'II' : 'III'}</span>
                <div>
                  <h2 className='text-xl font-bold'>{section.type}</h2>
                  <p className='text-sm text-indigo-100'>{section.questions.length} câu hỏi</p>
                </div>
              </div>
              {expandedSections.includes(sectionIdx) ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </div>

            {/* Questions */}
            {expandedSections.includes(sectionIdx) && (
              <div className='p-6'>
                {section.questions.map((q : Question, qIdx : number) => (
                  <div
                    key={qIdx}
                    className='mb-8 rounded-lg border-2 border-gray-200 p-4 transition hover:border-indigo-300'
                  >
                    {/* Question header */}
                    <div className='mb-4 flex items-start justify-between'>
                      <span className='text-lg font-bold text-indigo-600'>Câu {qIdx + 1}</span>
                      <button
                        onClick={() => handleDeleteQuestion(sectionIdx, qIdx)}
                        className='text-red-500 transition hover:text-red-700'
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    {/* Question text */}
                    <div className='mb-4'>
                      <label className='mb-2 block text-sm font-medium text-gray-700'>Câu hỏi:</label>
                      <textarea
                        value={q.question}
                        onChange={(e) => handleEditQuestion(sectionIdx, qIdx, e.target.value)}
                        className='w-full rounded-lg border border-gray-300 p-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500'
                        rows={2}
                      />
                    </div>

                    {/* Multiple Choice Options */}
                    {section.type === 'Nhiều phương án lựa chọn' && q.options && (
                      <div className='mb-4'>
                        <label className='mb-2 block text-sm font-medium text-gray-700'>Các phương án:</label>
                        {q.options.map((opt : string, optIdx : number) => (
                          <div key={optIdx} className='mb-2 flex items-center gap-2'>
                            <span className='w-8 font-semibold text-gray-600'>{['A', 'B', 'C', 'D'][optIdx]}.</span>
                            <input
                              type='text'
                              value={opt}
                              onChange={(e) => handleEditOption(sectionIdx, qIdx, optIdx, e.target.value)}
                              className='flex-1 rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-indigo-500'
                            />
                          </div>
                        ))}
                        <div className='mt-3'>
                          <label className='mb-2 block text-sm font-medium text-gray-700'>Đáp án đúng:</label>
                          <select
                            value={q.answer}
                            onChange={(e) => handleEditAnswer(sectionIdx, qIdx, e.target.value)}
                            className='rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-indigo-500'
                          >
                            <option value='A'>A</option>
                            <option value='B'>B</option>
                            <option value='C'>C</option>
                            <option value='D'>D</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {/* True/False Statements */}
                    {section.type === 'Trắc nghiệm đúng sai' && q.statements && (
                      <div className='mb-4'>
                        <label className='mb-2 block text-sm font-medium text-gray-700'>Các phát biểu:</label>
                        {q.statements.map((stmt : string, stmtIdx : number) => (
                          <div key={stmtIdx} className='mb-2'>
                            <div className='flex items-center gap-2'>
                              <span className='w-8 font-semibold text-gray-600'>{['a', 'b', 'c', 'd'][stmtIdx]}.</span>
                              <input
                                type='text'
                                value={stmt}
                                onChange={(e) => handleEditStatement(sectionIdx, qIdx, stmtIdx, e.target.value)}
                                className='flex-1 rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-indigo-500'
                              />
                            </div>
                          </div>
                        ))}
                        <div className='mt-3'>
                          <label className='mb-2 block text-sm font-medium text-gray-700'>Phát biểu đúng:</label>
                          <input
                            type='text'
                            value={Array.isArray(q.answer) ? q.answer.join(', ') : q.answer}
                            onChange={(e) =>
                              handleEditAnswer(
                                sectionIdx,
                                qIdx,
                                e.target.value
                              )
                            }
                            placeholder='Ví dụ: a, c'
                            className='rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-indigo-500'
                          />
                        </div>
                      </div>
                    )}

                    {/* Short Answer */}
                    {section.type === 'Trả lời ngắn' && (
                      <div className='mb-4'>
                        <label className='mb-2 block text-sm font-medium text-gray-700'>Gợi ý đáp án:</label>
                        <textarea
                          value={q.answer}
                          onChange={(e) => handleEditAnswer(sectionIdx, qIdx, e.target.value)}
                          className='w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-indigo-500'
                          rows={3}
                        />
                      </div>
                    )}
                  </div>
                ))}

                {/* Add Question Button */}
                <button
                  onClick={() => handleAddQuestion(sectionIdx)}
                  className='flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 py-3 text-gray-600 transition hover:border-indigo-500 hover:text-indigo-600'
                >
                  <Plus size={20} />
                  Thêm câu hỏi mới
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
