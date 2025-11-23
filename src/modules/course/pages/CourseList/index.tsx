import { useEffect, useState, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Pagination, Typography, Spin, Alert, Input, Row, Col, Card, Empty } from 'antd'
import { SearchOutlined, ArrowUpOutlined } from '@ant-design/icons'
import { fetchQueryCourses, fetchTopEnrolledCourses } from '@/shared/server-action/courses.server'
import { fetchCourseTypes } from '@/shared/server-action/courseTypes.server'
import { ICourse, ICourseType } from '@/modules/home/cores/interfaces'
import { OptimizedCourseCard } from '@/modules/course/components/OptimizedCourseCard'

const { Title, Text } = Typography
const { Search } = Input

export default function CourseList() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const [courses, setCourses] = useState<ICourse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState<string>(searchParams.get('search') || '')
  const [courseTypeId, setCourseTypeId] = useState<number | undefined>(
    searchParams.get('courseTypeId') ? parseInt(searchParams.get('courseTypeId') || '0') : undefined
  )
  const [courseTypes, setCourseTypes] = useState<ICourseType[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showScrollTop, setShowScrollTop] = useState(false)

  const currentPage = parseInt(searchParams.get('page') || '1', 10)
  const limit = 12

  // Banner slides data - text only
  const bannerSlides = [
    {
      id: 1,
      title: 'Khám phá Khóa học Tuyệt vời',
      subtitle: 'Khám phá bộ sưu tập các khóa học và hướng dẫn đầy thông tin của chúng tôi'
    },
    {
      id: 2,
      title: 'Tham gia Cộng đồng Sáng tạo',
      subtitle: 'Chia sẻ kiến thức của bạn và học hỏi từ các chuyên gia'
    },
    {
      id: 3,
      title: 'Truyền cảm hứng và Được truyền cảm hứng',
      subtitle: 'Học những điều quan trọng và tạo ra tác động'
    }
  ]

  // Auto slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Handle scroll to show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      setShowScrollTop(scrollTop > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Fetch course types on mount
  useEffect(() => {
    const loadCourseTypes = async () => {
      try {
        const types = await fetchCourseTypes()
        setCourseTypes(types)
      } catch (err) {
        console.error('Error loading course types:', err)
      }
    }
    loadCourseTypes()
  }, [])

  const fetchCourses = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const result = await fetchQueryCourses({
        page: currentPage,
        limit,
        search: search || undefined,
        courseTypeId: courseTypeId
      })

      if (!result) {
        setCourses([])
        setTotal(0)
        return
      }
      if (result && typeof result === 'object' && 'data' in result) {
        const coursesData = Array.isArray(result.data) ? result.data : []
        setCourses(coursesData)

        if (result.pagination && typeof result.pagination === 'object') {
          setTotal(result.pagination.total || 0)
        } else {
          setTotal(coursesData.length)
        }
      }
      else if (Array.isArray(result)) {
        setCourses(result)
        setTotal(result.length)
      }
      else {
        setCourses([])
        setTotal(0)
      }
    } catch (err: any) {
      setError(err.message || 'Lỗi khi tải danh sách khóa học')
      setCourses([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [currentPage, search, courseTypeId])

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  const handlePageChange = (page: number) => {
    const params: any = { page: page.toString() }
    if (search) params.search = search
    if (courseTypeId) params.courseTypeId = courseTypeId.toString()
    setSearchParams(params)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSearch = (value: string) => {
    setSearch(value)
    const params: any = { page: '1' }
    if (value) params.search = value
    if (courseTypeId) params.courseTypeId = courseTypeId.toString()
    setSearchParams(params)
  }

  const handleCourseTypeFilterChange = (value: number | undefined) => {
    setCourseTypeId(value)
    const params: any = { page: '1' }
    if (search) params.search = search
    if (value) params.courseTypeId = value.toString()
    setSearchParams(params)
  }

  const handleCardClick = (courseId: number) => {
    navigate(`/courses/${courseId}`)
  }

  if (loading && courses.length === 0) {
    return <Spin size="large" style={{ margin: 24, display: 'block', textAlign: 'center' }} />
  }

  if (error) {
    return <Alert message="Lỗi" description={error} type="error" showIcon style={{ margin: 24 }} />
  }

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .banner-slider {
          position: relative;
          overflow: hidden;
          border-radius: 24px;
          height: 400px;
        }

        .banner-slide {
          position: absolute;
          width: 100%;
          height: 100%;
          opacity: 0;
          transition: opacity 1s ease-in-out;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 2rem;
          text-align: center;
        }

        .banner-slide.active {
          opacity: 1;
        }

        .banner-title {
          color: white;
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          animation: fadeInUp 0.8s ease-out;
        }

        .banner-subtitle {
          color: rgba(255,255,255,0.95);
          font-size: 1.25rem;
          max-width: 600px;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
          animation: fadeInUp 0.8s ease-out 0.2s both;
        }

        .slider-dots {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 10px;
          z-index: 10;
        }

        .slider-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(255,255,255,0.5);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .slider-dot.active {
          width: 32px;
          border-radius: 6px;
          background: white;
        }

        .slider-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255,255,255,0.2);
          backdrop-filter: blur(10px);
          border: none;
          color: white;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }

        .slider-nav:hover {
          background: rgba(255,255,255,0.3);
          transform: translateY(-50%) scale(1.1);
        }

        .slider-nav.prev {
          left: 20px;
        }

        .slider-nav.next {
          right: 20px;
        }

        @media (max-width: 768px) {
          .banner-slider {
            height: 300px;
          }
          
          .banner-title {
            font-size: 2rem;
          }
          
          .banner-subtitle {
            font-size: 1rem;
          }
        }

        .search-input input:focus {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px -10px rgba(102, 126, 234, 0.4);
        }

        .scroll-to-top {
          position: fixed;
          bottom: 40px;
          right: 40px;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #222;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 1000;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .scroll-to-top:hover {
          background: #667eea;
          transform: translateY(-4px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

        .scroll-to-top.hidden {
          opacity: 0;
          pointer-events: none;
          transform: translateY(20px);
        }

        @media (max-width: 768px) {
          .scroll-to-top {
            bottom: 20px;
            right: 20px;
            width: 40px;
            height: 40px;
          }
        }
      `}</style>

      <div className='bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-10' style={{ width: '100%', paddingBottom: '40px' }}>
        <div className='mx-auto max-w-7xl' style={{ width: '100%' }}>
          {/* Banner Slider */}
          <div className={`mb-16 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}>
            <div className='banner-slider shadow-2xl'>
              {bannerSlides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`banner-slide ${index === currentSlide ? 'active' : ''}`}
                >
                  <h1 className='banner-title'>{slide.title}</h1>
                  <p className='banner-subtitle'>{slide.subtitle}</p>
                </div>
              ))}

              {/* Navigation Buttons */}
              <button
                className='slider-nav prev'
                onClick={() => setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length)}
              >
                ‹
              </button>
              <button
                className='slider-nav next'
                onClick={() => setCurrentSlide((prev) => (prev + 1) % bannerSlides.length)}
              >
                ›
              </button>

              {/* Dots Indicator */}
              <div className='slider-dots'>
                {bannerSlides.map((_, index) => (
                  <div
                    key={index}
                    className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
                    onClick={() => setCurrentSlide(index)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className='grid grid-cols-1 gap-8 lg:grid-cols-4'>
            {/* Sidebar Filter */}
            <div className='lg:col-span-1'>
              <div
                className={`${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}
                style={{ animationDelay: '0.1s' }}
              >
                <Card
                  title={
                    <span style={{ fontSize: '18px', fontWeight: 700, color: '#222' }}>
                      Categories
                    </span>
                  }
                  style={{
                    borderRadius: '16px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    border: 'none'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div
                      onClick={() => handleCourseTypeFilterChange(undefined)}
                      className='sidebar-item'
                      style={{
                        padding: '12px 16px',
                        borderRadius: 8,
                        cursor: 'pointer',
                        background: !courseTypeId ? '#e6f4ff' : 'transparent',
                        border: !courseTypeId ? '1px solid #1890ff' : '1px solid #f0f0f0',
                        transition: 'all 0.3s'
                      }}
                      onMouseEnter={(e) => {
                        if (!courseTypeId) return
                        e.currentTarget.style.background = '#f5f5f5'
                      }}
                      onMouseLeave={(e) => {
                        if (!courseTypeId) return
                        e.currentTarget.style.background = 'transparent'
                      }}
                    >
                      <Text strong={!courseTypeId} style={{ color: !courseTypeId ? '#1890ff' : '#333', fontSize: '15px' }}>
                        Tất cả khóa học
                      </Text>
                    </div>
                    {courseTypes.map((type) => (
                      <div
                        key={type.id}
                        onClick={() => handleCourseTypeFilterChange(type.id)}
                        className='sidebar-item'
                        style={{
                          padding: '12px 16px',
                          borderRadius: 8,
                          cursor: 'pointer',
                          background: courseTypeId === type.id ? '#e6f4ff' : 'transparent',
                          border: courseTypeId === type.id ? '1px solid #1890ff' : '1px solid #f0f0f0',
                          transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => {
                          if (courseTypeId !== type.id) {
                            e.currentTarget.style.background = '#f5f5f5'
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (courseTypeId !== type.id) {
                            e.currentTarget.style.background = 'transparent'
                          }
                        }}
                      >
                        <Text strong={courseTypeId === type.id} style={{ color: courseTypeId === type.id ? '#1890ff' : '#333', fontSize: '15px' }}>
                          {type.name}
                        </Text>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>

            {/* Course List */}
            <div className='lg:col-span-3'>
              <div
                className={`${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}
                style={{ animationDelay: '0.2s' }}
              >
                <h2 className='mb-6 text-4xl font-bold text-gray-800'>
                  All Courses
                </h2>
                <div className='search-input mb-10'>
                  <input
                    type='text'
                    placeholder='🔍 Search for courses...'
                    className='w-full rounded-2xl border-2 border-gray-200 bg-white px-6 py-4 text-lg shadow-md transition-all focus:border-indigo-400 focus:outline-none'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyPress={(e: any) => {
                      if (e.key === 'Enter') handleSearch(e.target.value)
                    }}
                  />
                </div>

                <div style={{ position: 'relative' }}>
                  {loading && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(255, 255, 255, 0.7)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 10,
                      borderRadius: '8px',
                      backdropFilter: 'blur(2px)'
                    }}>
                      <Spin size="large" />
                    </div>
                  )}
                  <div style={{ opacity: loading ? 0.5 : 1, transition: 'opacity 0.2s ease-in-out', pointerEvents: loading ? 'none' : 'auto' }}>
                    {courses.length === 0 && !loading ? (
                      <Empty
                        description="Không có khóa học"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                      />
                    ) : (
                      <>
                        {/* Chia 2 section khi chọn "Tất cả khóa học" */}
                        {!courseTypeId ? (
                          <>
                            {/* Section: Khóa học cơ bản */}
                            <div style={{ marginBottom: 48 }}>
                              <h3 style={{ 
                                fontSize: '28px', 
                                fontWeight: 700, 
                                color: '#222', 
                                marginBottom: 24,
                                paddingBottom: 12,
                                borderBottom: '3px solid #52c41a'
                              }}>
                                Khóa học cơ bản
                              </h3>
                              <Row gutter={[16, 16]}>
                                {courses
                                  .filter(course => 
                                    course.level === 'BASIC' || 
                                    course.level === 'basic' || 
                                    !course.level // Nếu không có level, mặc định là BASIC
                                  )
                                  .map((course) => (
                                    <Col xs={24} sm={12} lg={8} key={course.id}>
                                      <OptimizedCourseCard course={course} onCardClick={handleCardClick} />
                                    </Col>
                                  ))}
                              </Row>
                              {courses.filter(course => 
                                course.level === 'BASIC' || 
                                course.level === 'basic' || 
                                !course.level
                              ).length === 0 && (
                                <Empty
                                  description="Chưa có khóa học cơ bản"
                                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                                  style={{ padding: '40px 0' }}
                                />
                              )}
                            </div>

                            {/* Section: Khóa học ứng dụng */}
                            <div style={{ marginBottom: 32 }}>
                              <h3 style={{ 
                                fontSize: '28px', 
                                fontWeight: 700, 
                                color: '#222', 
                                marginBottom: 24,
                                paddingBottom: 12,
                                borderBottom: '3px solid #1890ff'
                              }}>
                                Khóa học ứng dụng
                              </h3>
                              <Row gutter={[16, 16]}>
                                {courses
                                  .filter(course => 
                                    course.level === 'APPLICATION' || 
                                    course.level === 'application'
                                  )
                                  .map((course) => (
                                    <Col xs={24} sm={12} lg={8} key={course.id}>
                                      <OptimizedCourseCard course={course} onCardClick={handleCardClick} />
                                    </Col>
                                  ))}
                              </Row>
                              {courses.filter(course => 
                                course.level === 'APPLICATION' || 
                                course.level === 'application'
                              ).length === 0 && (
                                <Empty
                                  description="Chưa có khóa học ứng dụng"
                                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                                  style={{ padding: '40px 0' }}
                                />
                              )}
                            </div>
                          </>
                        ) : (
                          /* Hiển thị bình thường khi có filter */
                          <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
                            {courses.map((course) => (
                              <Col xs={24} sm={12} lg={8} key={course.id}>
                                <OptimizedCourseCard course={course} onCardClick={handleCardClick} />
                              </Col>
                            ))}
                          </Row>
                        )}

                        {total > 0 && (
                          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
                            <Pagination
                              current={currentPage}
                              total={total}
                              pageSize={limit}
                              showSizeChanger={false}
                              showQuickJumper
                              showTotal={(total: number) => `Tổng ${total} khóa học`}
                              onChange={handlePageChange}
                            />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll to Top Button */}
        <div
          className={`scroll-to-top ${showScrollTop ? '' : 'hidden'}`}
          onClick={scrollToTop}
        >
          <ArrowUpOutlined style={{ color: '#fff', fontSize: 20 }} />
        </div>
      </div>
    </>
  )
}

