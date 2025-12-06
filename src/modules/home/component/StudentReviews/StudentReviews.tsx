import { motion } from 'framer-motion'
import { Button, Card, Carousel } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useRef } from 'react'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'

interface Testimonial {
  id: number
  content: string
  name: string
  role: string
  avatar: string
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    role: 'Cô giáo',
    name: 'Nguyễn Kim Oanh',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Oanh',
    content: 'Tôi rất hài lòng với chất lượng khóa học. Giảng viên nhiệt tình, nội dung phong phú và dễ hiểu. Đặc biệt là phần thực hành rất bổ ích.'
  },
  {
    id: 2,
    role: 'Thầy giáo',
    name: 'Phan Văn Năm',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nam',
    content: 'Khóa học giúp tôi nâng cao kỹ năng và kiến thức một cách đáng kể. Tôi đã áp dụng được nhiều điều học được vào công việc thực tế.'
  },
  {
    id: 3,
    role: 'Học sinh',
    name: 'Lê Minh Nhật',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nhat',
    content: 'Nền tảng học tập rất tiện lợi, có thể học mọi lúc mọi nơi. Nội dung được cập nhật thường xuyên và phù hợp với xu hướng hiện tại.'
  },
  {
    id: 4,
    role: 'Thầy giáo',
    name: 'Trần Văn Minh',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Minh',
    content: 'Môi trường giảng dạy trực tuyến chuyên nghiệp. Các công cụ hỗ trợ rất tốt giúp tôi truyền đạt kiến thức hiệu quả đến học viên.'
  },
  {
    id: 5,
    role: 'Học sinh',
    name: 'Phạm Văn Long',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Long',
    content: 'Các khóa học ở đây rất thiết thực, giúp mình tự tin hơn khi đi phỏng vấn xin việc. Rất cảm ơn đội ngũ giảng viên.'
  },
  {
    id: 6,
    role: 'Học sinh',
    name: 'Hoàng Thị Lan',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lan',
    content: 'Giao diện thân thiện, bài giảng được thiết kế khoa học. Tôi đã học được rất nhiều kỹ năng mới áp dụng ngay được vào công việc.'
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
  const carouselRef = useRef<any>(null)

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

        {/* Testimonials Carousel */}
        <div className='relative px-8'>
          {/* Custom Buttons */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden sm:block">
            <motion.div
              className="cursor-pointer bg-white rounded-full p-2 shadow-md flex items-center justify-center hover:text-[#ff8c00]"
              whileHover={{ scale: 1.1, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
              onClick={() => carouselRef.current?.prev()}
              style={{ width: '40px', height: '40px' }}
            >
              <LeftOutlined style={{ fontSize: '16px' }} />
            </motion.div>
          </div>

          <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden sm:block">
            <motion.div
              className="cursor-pointer bg-white rounded-full p-2 shadow-md flex items-center justify-center hover:text-[#ff8c00]"
              whileHover={{ scale: 1.1, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
              onClick={() => carouselRef.current?.next()}
              style={{ width: '40px', height: '40px' }}
            >
              <RightOutlined style={{ fontSize: '16px' }} />
            </motion.div>
          </div>

          <Carousel
            ref={carouselRef}
            autoplay
            autoplaySpeed={3000}
            dots={false}
            arrows={false}
            slidesToShow={4}
            slidesToScroll={1}
            responsive={[
              {
                breakpoint: 1024,
                settings: {
                  slidesToShow: 3,
                }
              },
              {
                breakpoint: 768,
                settings: {
                  slidesToShow: 2,
                }
              },
              {
                breakpoint: 640,
                settings: {
                  slidesToShow: 1,
                }
              }
            ]}
          >
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="p-3 h-full">
                <motion.div
                  whileHover={{ y: -10 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="h-full"
                >
                  <Card
                    className='h-full shadow-lg hover:shadow-xl transition-shadow duration-300'
                    style={{
                      borderRadius: '12px',
                      border: 'none',
                      position: 'relative',
                      padding: '12px',
                      height: '100%'
                    }}
                    bodyStyle={{ padding: '12px' }}
                  >
                    <div className="flex items-start mb-4 gap-3">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover bg-gray-200"
                      />
                      <div>
                        <div className="font-semibold text-blue-600 text-sm">
                          {testimonial.role}
                        </div>
                        <div className="font-bold text-blue-500 text-sm">
                          {testimonial.name}
                        </div>
                      </div>
                    </div>

                    {/* Testimonial Content */}
                    <p
                      className='text-gray-600 leading-relaxed text-sm text-justify h-32 overflow-hidden'
                    >
                      {testimonial.content}
                    </p>
                  </Card>
                </motion.div>
              </div>
            ))}
          </Carousel>
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
                Hãy bắt đầu với GenAI
              </h3>
            </div>

            {/* Right: Buttons */}
            <div className='flex flex-col sm:flex-row gap-4 flex-shrink-0'>
              <Button
                size='large'
                className='rounded-full px-10 py-4 h-auto text-base font-semibold hover:bg-[#ff8c00] hover:text-white'
                style={{
                  border: '2px solid #ff8c00',
                  color: '#ff8c00',
                  background: 'transparent',
                  transition: 'all 0.3s ease',
                }}
                onClick={() => navigate('/ai/search-ai')}
              >
                Bắt đầu ngay
              </Button>
              <Button
                type='primary'
                size='large'
                className='rounded-full px-10 py-4 h-auto text-base font-semibold hover:bg-[#ff8c00] hover:text-white'
                style={{
                  background: '#ff8c00',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(255, 140, 0, 0.3)',
                  transition: 'all 0.3s ease',
                }}
                onClick={() => navigate('/ai/search-ai')}
              >
                Tôi sẽ giúp bạn
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default StudentReviews

