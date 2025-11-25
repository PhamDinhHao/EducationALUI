import { motion } from 'framer-motion'
import { Button, Card } from 'antd'
import { useNavigate } from 'react-router-dom'

interface Testimonial {
  id: number
  content: string
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    content: 'Tôi rất hài lòng với chất lượng khóa học. Giảng viên nhiệt tình, nội dung phong phú và dễ hiểu. Đặc biệt là phần thực hành rất bổ ích.'
  },
  {
    id: 2,
    content: 'Khóa học giúp tôi nâng cao kỹ năng và kiến thức một cách đáng kể. Tôi đã áp dụng được nhiều điều học được vào công việc thực tế.'
  },
  {
    id: 3,
    content: 'Nền tảng học tập rất tiện lợi, có thể học mọi lúc mọi nơi. Nội dung được cập nhật thường xuyên và phù hợp với xu hướng hiện tại.'
  },
  {
    id: 4,
    content: 'Tôi đã tham gia nhiều khóa học và đều rất hài lòng. Giá cả hợp lý, chất lượng tốt. Sẽ tiếp tục ủng hộ nền tảng này.'
  }
]

// Animation variants for banner
const bannerVariants = {
  hidden: {
    opacity: 0,
    y: 60,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
}

const StudentReviews = () => {
  const navigate = useNavigate()

  return (
    <div className='w-full py-16 px-4 sm:px-6 lg:px-8' style={{ background: '#f0f4f8' }}>
      <div className='mx-auto max-w-7xl'>
        {/* Heading */}
        <motion.div
          className='text-center mb-12'
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6 }}
        >
          <h2 className='text-4xl sm:text-5xl font-bold mb-4' style={{ color: '#ff8c00' }}>
            ĐÁNH GIÁ CỦA HỌC VIÊN
          </h2>
          <p className='text-lg sm:text-xl text-gray-800'>
            Hãy lắng nghe những người đã đến với chúng tôi
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card
                className='h-full shadow-lg hover:shadow-xl transition-shadow duration-300'
                style={{
                  borderRadius: '12px',
                  border: 'none',
                  position: 'relative',
                  padding: '24px'
                }}
              >
                {/* Quotation Marks */}
                <div
                  className='text-6xl font-serif leading-none mb-4'
                  style={{ color: '#e0e0e0' }}
                >
                  "
                </div>

                {/* Testimonial Content */}
                <p
                  className='text-gray-700 leading-relaxed'
                  style={{ fontSize: '15px', lineHeight: '1.6' }}
                >
                  {testimonial.content}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Call to Action Banner */}
      <motion.div
        className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-16'
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        variants={bannerVariants}
      >
          <div
            className='rounded-3xl p-8 md:p-12'
            style={{
              background: 'linear-gradient(135deg, #e0f2fe 0%, #f3e8ff 100%)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Decorative background patterns */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.1,
                backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(0,0,0,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(0,0,0,0.1) 0%, transparent 50%)',
                pointerEvents: 'none'
              }}
            />
            
            <div className='flex flex-col md:flex-row items-center justify-between gap-6 relative z-10'>
              {/* Left: Icon */}
              <div className='flex-shrink-0'>
                <div
                  className='w-20 h-20 rounded-full bg-white flex items-center justify-center'
                  style={{
                    border: '2px solid #333',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                >
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                  </svg>
                </div>
              </div>

              {/* Center: Text */}
              <div className='flex-1 text-center md:text-left'>
                <h3 className='text-2xl md:text-3xl font-bold text-gray-800'>
                  Let's Start With Academy LMS
                </h3>
              </div>

              {/* Right: Buttons */}
              <div className='flex flex-col sm:flex-row gap-4 flex-shrink-0'>
                <Button
                  size='large'
                  className='rounded-full px-8 py-6 h-auto text-base font-semibold'
                  style={{
                    border: '2px solid #ff8c00',
                    color: '#ff8c00',
                    background: 'transparent'
                  }}
                  onClick={() => navigate('/courses')}
                >
                  I'm A Student
                </Button>
                <Button
                  type='primary'
                  size='large'
                  className='rounded-full px-8 py-6 h-auto text-base font-semibold'
                  style={{
                    background: '#ff8c00',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(255, 140, 0, 0.3)'
                  }}
                  onClick={() => navigate('/courses')}
                >
                  Become An Instructor
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
    </div>
  )
}

export default StudentReviews

