import { BookOutlined, EditOutlined, BulbOutlined } from '@ant-design/icons'
import Sidebar from '@/shared/components/Sidebar'
import { useNavigate } from 'react-router-dom'

const LessonBuilder = () => {
  const navigate = useNavigate()
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 bg-gradient-to-br from-orange-50 via-white to-blue-50 flex items-center justify-center p-8">
        <div className="w-full max-w-4xl">
        {/* Header Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <BookOutlined className="text-6xl text-orange-500" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-orange-500 text-center mb-3">
          Xây dựng giáo án
        </h1>

        {/* Subtitle */}
        <p className="text-gray-600 text-center mb-12">
          GenAI giúp bạn xây dựng giáo án theo chuẩn cấu trúc 5512
        </p>

        {/* Cards Container */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Card 1 - Soạn giáo án tự động */}
          <div className="bg-white rounded-3xl shadow-lg p-8 border-2 border-orange-100 hover:shadow-xl transition-shadow">
            <div className="mb-4">
              <EditOutlined className="text-3xl text-orange-500" />
            </div>
            
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Soạn giáo án tự động
            </h3>
            
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              Hỗ trợ giáo viên soạn giáo án siêu nhanh theo ứng cả của chuẩn thim GDPT 2018
            </p>
            
            <button onClick={() => navigate('/ai/lesson-form')} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-full transition-colors">
              Bắt đầu soạn
            </button>
          </div>

          {/* Card 2 - Tạo giáo án bằng prompt AI */}
          <div className="bg-white rounded-3xl shadow-lg p-8 border-2 border-blue-100 hover:shadow-xl transition-shadow">
            <div className="mb-4">
              <BulbOutlined className="text-3xl text-blue-500" />
            </div>
            
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Tạo giáo án bằng prompt AI
            </h3>
            
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              Chỉ cần nhập thông tin theo hướng dẫn, GenAI sẽ tạo giáo án và chỉnh sửa theo yêu cầu của bạn
            </p>
            
            <button onClick={() => navigate('/ai/prompt-lesson')} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-full transition-colors">
              Tạo bằng Prompt
            </button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-orange-200 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 blur-xl"></div>
      </div>
    </div>
    </div>
  )
}

export default LessonBuilder