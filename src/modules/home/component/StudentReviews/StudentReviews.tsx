import { motion } from 'framer-motion'
import { Card } from 'antd'

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

const StudentReviews = () => {
  return (
    <div className='w-full py-16 px-4 sm:px-6 lg:px-8' style={{ background: '#f0f4f8' }}>
      <div className='mx-auto max-w-7xl'>
        {/* Heading */}
        <motion.div
          className='text-center mb-12'
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
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
              viewport={{ once: true }}
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
    </div>
  )
}

export default StudentReviews

