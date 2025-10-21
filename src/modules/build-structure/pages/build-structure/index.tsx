import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useBoundStore } from '@shared/stores'
import { Upload } from 'antd'
import Sidebar from '@/shared/components/Sidebar'

const levels = ['Nhận biết', 'Thông hiểu', 'Vận dụng', 'Vận dụng cao']
const types = ['Nhiều phương án lựa chọn', 'Trắc nghiệm đúng sai', 'Trả lời ngắn']

interface Matrix {
  [type: string]: { [level: string]: number }
}

// ✅ Hàm khởi tạo matrix mặc định
const initMatrix: Matrix = types.reduce((acc, type) => {
  acc[type] = levels.reduce(
    (obj, level) => {
      obj[level] = 2 // mặc định 2 câu mỗi level
      return obj
    },
    {} as { [level: string]: number }
  )
  return acc
}, {} as Matrix)

const BuildStructure = () => {
  const [matrix, setMatrix] = useState<Matrix>(initMatrix)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const navigate = useNavigate()
  const setExam = useBoundStore((state) => state.setExam)

  const handleChange = (type: string, level: string, value: number) => {
    setMatrix((prev) => ({
      ...prev,
      [type]: { ...prev[type], [level]: value }
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0])
  }

  const handleSubmit = async () => {
    if (!file) return alert('Hãy chọn file PDF hoặc Word!')
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('matrix', JSON.stringify(matrix))

      const res = await axios.post('http://localhost:5001/api/v1/gemini/generate', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      setExam(res.data)
      navigate('/ai/exam-preview')
    } catch (err) {
      console.error(err)
      alert('Lỗi khi tạo đề!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex min-h-screen bg-gray-50'>
      <Sidebar />
      <div className=' w-full p-6 pb-48'>
        <div className='mx-auto max-w-[1100px]'>
          <div className='m-6 flex min-h-screen flex-col items-center bg-gray-50'>
            <div className='w-full max-w-5xl overflow-y-auto rounded-xl bg-white p-12 shadow'>
              <h1 className='mb-2 text-center text-2xl font-bold text-orange-600'>🎓 Xây dựng đề</h1>
              <p className='mb-6 text-center text-gray-600'>GEN AI giúp bạn xây dựng đề theo chuẩn cấu trúc 5512</p>

              {/* Upload file */}
              <label
                htmlFor='fileUpload'
                className='mb-6 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-orange-400 p-16 transition hover:bg-orange-50'
              >
                <Upload className='mb-2 h-12 w-12 text-gray-500' />
                <p className='font-medium text-gray-700'>Click để up file tài liệu của bạn lên đây</p>
                <input
                  id='fileUpload'
                  type='file'
                  accept='.pdf,.doc,.docx'
                  className='hidden'
                  onChange={handleFileChange}
                />
              </label>
              {file && <p className='mb-6 text-center font-semibold text-green-600'>📂 {file.name}</p>}

              {/* Ma trận câu hỏi */}
              {types.map((type, i) => (
                <div key={i} className='mb-6 border-b pb-4'>
                  <h2 className='mb-2 text-lg font-semibold text-orange-500'>{type}</h2>
                  <div className='grid grid-cols-4 gap-4'>
                    {levels.map((level) => (
                      <div key={level} className='flex flex-col items-center'>
                        <span className='text-sm text-gray-600'>{level}</span>
                        <input
                          type='number'
                          min={0}
                          value={matrix[type][level]} // ✅ dùng value thay vì defaultValue
                          className='mt-1 w-16 rounded border text-center'
                          onChange={(e) => handleChange(type, level, Number(e.target.value))}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Nút duy nhất */}
              <div className='mt-6 flex justify-center'>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className='rounded-full bg-orange-500 px-6 py-2 text-white shadow-md transition hover:bg-orange-600'
                >
                  {loading ? 'Đang tạo...' : 'Tạo đề'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BuildStructure
