import { motion } from 'framer-motion'
import { useState } from 'react'
import { Input, Button } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import TopCourses from '@/modules/home/component/TopCourses/TopCourses.tsx'
import ExplorerCourse from '@/modules/home/component/ExplorerCourse/ExplorerCourse.tsx'
import TopArticles from '@/modules/home/component/TopArticles/TopArticles.tsx'
import StudentReviews from '@/modules/home/component/StudentReviews/StudentReviews.tsx'
import Footer from '@shared/layouts/Footer/Footer.tsx'

// Animation variants for sections
const sectionVariants = {
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

// Banner animation variants
const bannerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 1,
      staggerChildren: 0.2
    }
  }
}

const bannerChildVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
}

const Home = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <div className='h-screen w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth bg-white'>
      {/* Banner Section */}
      <section className='relative h-screen w-full snap-start'>
        <motion.div
          className='relative h-full w-full overflow-hidden'
          style={{
            background: 'linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%)',
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px),
              repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px)
            `
          }}
          initial="hidden"
          animate="visible"
          variants={bannerVariants}
        >
          <div className='container mx-auto h-full px-4 sm:px-6 lg:px-8'>
            <div className='flex h-full items-center justify-between'>
              {/* Left Section - Text and Search */}
              <motion.div
                className='flex-1 max-w-2xl'
                variants={bannerChildVariants}
              >
                <motion.h1
                  className='mb-4 text-5xl sm:text-6xl lg:text-7xl font-bold'
                  variants={bannerChildVariants}
                >
                  Xin chào, Tôi là{' '}
                  <span className='text-[#ff8c00]'>ETA</span>
                </motion.h1>
                <motion.p
                  className='mb-2 text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-700'
                  variants={bannerChildVariants}
                >
                  Trợ lý{' '}
                  <span className='bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent'>
                    AI
                  </span>{' '}
                  của bạn
                </motion.p>
                <motion.p
                  className='mb-8 text-lg sm:text-xl text-gray-600'
                  variants={bannerChildVariants}
                >
                  Chia sẻ miễn phí kiến thức{' '}
                  <span className='font-semibold text-[#667eea]'>Ai Giáo dục</span>
                </motion.p>
                
                {/* Search Bar */}
                <motion.div
                  className='flex gap-3'
                  variants={bannerChildVariants}
                >
                  <Input
                    size='large'
                    placeholder='Tìm kiếm khóa học và nhiều hơn thế nữa...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onPressEnter={handleSearch}
                    className='flex-1 rounded-full border-2 border-gray-300 px-6 py-3 text-base shadow-md hover:border-[#667eea] focus:border-[#667eea]'
                    style={{ height: '56px' }}
                  />
                  <Button
                    type='primary'
                    size='large'
                    icon={<SearchOutlined />}
                    onClick={handleSearch}
                    className='rounded-full px-8 shadow-lg hover:shadow-xl'
                    style={{
                      height: '56px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      fontSize: '16px',
                      fontWeight: 600
                    }}
                  >
                    Tìm kiếm
                  </Button>
                </motion.div>
              </motion.div>

              {/* Right Section - AI Owl Character */}
              <motion.div
                className='hidden lg:flex flex-1 items-center justify-center relative'
                variants={bannerChildVariants}
              >
                {/* AI Owl Character - Placeholder */}
                <div className='relative'>
                  <motion.div
                    className='relative z-10'
                    animate={{
                      y: [0, -10, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                  >
                    <img
                      src='https://via.placeholder.com/500x600/ff8c00/ffffff?text=ETA+AI+Owl'
                      alt='ETA AI Assistant'
                      className='w-[400px] h-[500px] object-contain'
                    />
                  </motion.div>
                  
                  {/* Floating Icons */}
                  <motion.div
                    className='absolute top-10 left-10 w-16 h-16 rounded-xl bg-white shadow-lg'
                    animate={{
                      y: [0, -15, 0],
                      rotate: [0, 5, 0]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: 0.5
                    }}
                  >
                    <img src='https://via.placeholder.com/64' alt='Icon' className='w-full h-full rounded-xl' />
                  </motion.div>
                  
                  <motion.div
                    className='absolute top-32 -left-8 w-20 h-20 rounded-xl bg-white shadow-lg'
                    animate={{
                      y: [0, -20, 0],
                      rotate: [0, -5, 0]
                    }}
                    transition={{
                      duration: 3.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: 1
                    }}
                  >
                    <img src='https://via.placeholder.com/80' alt='Icon' className='w-full h-full rounded-xl' />
                  </motion.div>
                  
                  <motion.div
                    className='absolute top-48 right-8 w-16 h-16 rounded-xl bg-white shadow-lg'
                    animate={{
                      y: [0, -12, 0],
                      rotate: [0, 3, 0]
                    }}
                    transition={{
                      duration: 4.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: 1.5
                    }}
                  >
                    <img src='https://via.placeholder.com/64' alt='Icon' className='w-full h-full rounded-xl' />
                  </motion.div>
                  
                  <motion.div
                    className='absolute top-64 right-0 w-18 h-18 rounded-xl bg-white shadow-lg'
                    animate={{
                      y: [0, -18, 0],
                      rotate: [0, -3, 0]
                    }}
                    transition={{
                      duration: 3.8,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: 0.8
                    }}
                  >
                    <img src='https://via.placeholder.com/72' alt='Icon' className='w-full h-full rounded-xl' />
                  </motion.div>
                  
                  <motion.div
                    className='absolute bottom-20 right-12 w-24 h-24 rounded-xl bg-white shadow-lg'
                    animate={{
                      y: [0, -25, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: 2
                    }}
                  >
                    <img src='https://via.placeholder.com/96' alt='Icon' className='w-full h-full rounded-xl' />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Top Courses Section */}
      <section className='flex h-screen w-full snap-start items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50'>
        <motion.div
          className='w-full max-w-7xl px-8'
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
        >
          <TopCourses />
        </motion.div>
      </section>

      {/* Explorer Course Section */}
      <section className='flex h-screen w-full snap-start items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-8'>
        <motion.div
          className='w-full max-w-7xl'
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
        >
          <ExplorerCourse />
        </motion.div>
      </section>

      {/* Top Articles Section */}
      <section className='flex h-screen w-full snap-start items-center justify-center bg-gradient-to-br from-green-50 to-teal-50'>
        <motion.div
          className='w-full max-w-7xl px-8'
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
        >
          <TopArticles />
        </motion.div>
      </section>

      {/* Student Reviews Section */}
      <section className='w-full snap-start'>
        <StudentReviews />
      </section>

      {/* Footer Section */}
      <section className='w-full snap-start'>
        <Footer />
      </section>
    </div>
  )
}

export default Home
