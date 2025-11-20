import { motion } from 'framer-motion'
import TopCourses from '@/modules/home/component/TopCourses/TopCourses.tsx'
import ExplorerCourse from '@/modules/home/component/ExplorerCourse/ExplorerCourse.tsx'
import TopArticles from '@/modules/home/component/TopArticles/TopArticles.tsx'
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
  return (
    <div className='h-screen w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth bg-white'>
      {/* Banner Section */}
      <section className='relative h-screen w-full snap-start'>
        <motion.div
          className='relative h-full w-full overflow-hidden bg-gray-200'
          initial="hidden"
          animate="visible"
          variants={bannerVariants}
        >
          <motion.img
            src='https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            alt='Banner'
            className='h-full w-full object-cover'
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
          <div className='absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-black/60 via-black/50 to-black/60 text-white'>
            <motion.h1
              className='mb-4 text-6xl font-bold tracking-tight'
              variants={bannerChildVariants}
            >
              Welcome to Our Learning Platform
            </motion.h1>
            <motion.p
              className='text-2xl font-light'
              variants={bannerChildVariants}
            >
              Explore a world of knowledge and enhance your skills.
            </motion.p>
            <motion.button
              className='mt-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-10 py-4 text-lg font-semibold shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-blue-500/50'
              variants={bannerChildVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
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

      {/* Footer Section */}
      <section className='flex h-screen w-full snap-start items-end justify-center bg-gradient-to-br from-gray-900 to-gray-800'>
        <motion.div
          className='w-full'
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
        >
          <Footer />
        </motion.div>
      </section>
    </div>
  )
}

export default Home
