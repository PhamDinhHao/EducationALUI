import { motion } from 'framer-motion'
import { ReactNode, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CarouselSliderProps<T> {
  data: T[]
  renderItem: (item: T, idx: number) => ReactNode
  itemsPerView?: number
}

const CarouselSlider = <T,>({ data, renderItem, itemsPerView = 4 }: CarouselSliderProps<T>) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const itemWidth = 100 / itemsPerView
  const maxIndex = Math.max(0, data.length - itemsPerView)

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1))
  }

  return (
    <div className='relative'>
      {/* Navigation Buttons */}
      {currentIndex > 0 && (
        <button
          onClick={handlePrev}
          className='absolute left-0 top-1/2 z-10 -translate-x-4 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg transition-all hover:scale-110 hover:bg-gray-50'
          aria-label='Previous'
        >
          <ChevronLeft className='h-6 w-6 text-gray-700' />
        </button>
      )}

      {currentIndex < maxIndex && (
        <button
          onClick={handleNext}
          className='absolute right-0 top-1/2 z-10 -translate-y-1/2 translate-x-4 rounded-full bg-white p-2 shadow-lg transition-all hover:scale-110 hover:bg-gray-50'
          aria-label='Next'
        >
          <ChevronRight className='h-6 w-6 text-gray-700' />
        </button>
      )}

      {/* Carousel Container */}
      <div className='overflow-hidden'>
        <motion.div
          className='flex gap-4'
          animate={{
            x: `-${currentIndex * itemWidth}%`
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30
          }}
        >
          {data.map((item, idx) => (
            <motion.div
              key={idx}
              className='flex-shrink-0'
              style={{ width: `calc(${itemWidth}% - ${(itemsPerView - 1) * 16 / itemsPerView}px)` }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
            >
              {renderItem(item, idx)}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Dots Indicator */}
      <div className='mt-6 flex justify-center gap-2'>
        {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all ${
              idx === currentIndex ? 'w-8 bg-blue-600' : 'w-2 bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default CarouselSlider
