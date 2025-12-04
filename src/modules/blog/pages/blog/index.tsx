import { useState, useEffect } from 'react'
import { CalendarOutlined, ClockCircleOutlined, EyeOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { PagePath } from '@/shared/core/enum/page.enum'
import { Button, Modal } from 'antd'
import { getBlogList, getBlogTags, getRecentPosts } from '@/modules/blog/services/blogService.service'
import { useBoundStore } from '@/shared/stores'
import images from '@/assets/images/images'

const categories = [
  { name: 'Student', icon: '🎓' },
  { name: 'Teacher', icon: '🏫' },
  { name: 'Management staff', icon: '💼' },
  { name: 'New technology', icon: '📱' }
]

const Blog = () => {
  const { user } = useBoundStore((state) => state)
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalArticles, setTotalArticles] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const [tags, setTags] = useState<any[]>([])
  const [recentPosts, setRecentPosts] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('articles') // 'articles' or 'contests'
  const [currentSlide, setCurrentSlide] = useState(0)
  const [activeCategory, setActiveCategory] = useState('')
  const [isBannerPreviewOpen, setIsBannerPreviewOpen] = useState(false)
  const navigate = useNavigate()

  // Banner slides data
  const bannerSlides = [
    {
      id: 1,
      image: images.bgBanner1
    },
    {
      id: 2,
      image: images.bgBanner2
    },
    {
      id: 3,
      image: images.bgBanner3
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

  const fetchBlogs = async (page = 1, title = '', tag = '') => {
    setLoading(true)
    try {
      const params = {
        page,
        limit: 6,
        sortBy: 'createdAt:desc',
        ...(title && { title }),
        ...(tag && { tags: tag }),
        ...(activeTab === 'contests' ? { type: 'CONTESTS' } : { type: 'BLOG' }),
        ...(activeCategory && { category: activeCategory.toUpperCase().replace(' ', '_') })
      }

      Promise.all([
        getBlogList(params),
        getBlogTags(),
        getRecentPosts({ limit: 3, type: activeTab === 'contests' ? 'CONTESTS' : 'BLOG' })
      ]).then(([response, responseTags, responseRecentPosts]) => {
        setRecentPosts(responseRecentPosts.data || [])
        setTags(responseTags.data || [])
        setArticles(response.data.data || [])
        setTotalArticles(response.data.pagination?.total || 0)
      })
    } catch (error) {
      console.error('Error fetching blogs:', error)
      alert('Không thể tải dữ liệu blog')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBlogs(currentPage, searchQuery, selectedTag)
  }, [currentPage, searchQuery, selectedTag, activeTab, activeCategory])

  // Reset category filter when switching between tabs
  useEffect(() => {
    setActiveCategory('')
  }, [activeTab])

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag === selectedTag ? '' : tag)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Function to strip HTML tags and get plain text
  const getPlainTextFromHTML = (html: string, maxLength: number = 150) => {
    if (!html) return 'No content available'

    // Create a temporary div to parse HTML
    const temp = document.createElement('div')
    temp.innerHTML = html

    // Remove all img tags
    const images = temp.getElementsByTagName('img')
    while (images.length > 0) {
      images[0].parentNode?.removeChild(images[0])
    }

    // Get text content only
    const text = temp.textContent || temp.innerText || ''

    // Trim and limit length
    const trimmedText = text.trim()
    if (trimmedText.length > maxLength) {
      return trimmedText.substring(0, maxLength) + '...'
    }

    return trimmedText || 'No content available'
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

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }

        .animate-slideInRight {
          animation: slideInRight 0.6s ease-out forwards;
        }

        .card-hover {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .card-hover::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.6s;
        }

        .card-hover:hover::before {
          left: 100%;
        }

        .card-hover:hover {
          transform: translateY(-12px) scale(1.02);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .image-zoom {
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card-hover:hover .image-zoom {
          transform: scale(1.15) rotate(2deg);
        }

        .tag-bounce {
          transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .tag-bounce:hover {
          transform: scale(1.15) rotate(-3deg);
        }

        .tag-bounce:active {
          transform: scale(0.95);
        }

        .sidebar-item {
          transition: all 0.3s ease;
          position: relative;
        }

        .sidebar-item::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #667eea, #764ba2);
          transition: width 0.3s ease;
        }

        .sidebar-item:hover::after {
          width: 100%;
        }

        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .search-input input:focus {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px -10px rgba(102, 126, 234, 0.4);
        }

        .stagger-item {
          opacity: 0;
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .stagger-item:nth-child(1) { animation-delay: 0.1s; }
        .stagger-item:nth-child(2) { animation-delay: 0.2s; }
        .stagger-item:nth-child(3) { animation-delay: 0.3s; }
        .stagger-item:nth-child(4) { animation-delay: 0.4s; }
        .stagger-item:nth-child(5) { animation-delay: 0.5s; }
        .stagger-item:nth-child(6) { animation-delay: 0.6s; }

        .loading-spinner {
          border: 4px solid #f3f4f6;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .float-animation {
          animation: float 3s ease-in-out infinite;
        }

        .pagination-btn {
          transition: all 0.3s ease;
        }

        .pagination-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
        }

        .hero-badge {
          animation: float 4s ease-in-out infinite;
        }

        .category-icon {
          transition: transform 0.3s ease;
          display: inline-block;
        }

        .sidebar-item:hover .category-icon {
          transform: scale(1.3) rotate(10deg);
        }

        .banner-slider {
          position: relative;
          overflow: visible;
          border-radius: 24px;
          height: 400px;
        }

        .banner-slide {
          position: absolute;
          width: 100%;
          height: 100%;
          opacity: 0;
          transition: opacity 1s ease-in-out;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          border-radius: 24px;
        }

        .banner-slide.active {
          opacity: 1;
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

        .banner-slider:hover .slider-nav {
          opacity: 1;
        }

        .slider-nav {
          position: absolute;
          top: 50%;
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255,255,255,0.5);
          color: #333;
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
          opacity: 0;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .slider-nav:hover {
          background: rgba(255,255,255,1);
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(0,0,0,0.25);
        }

        .slider-nav.prev {
          left: 0;
          transform: translateX(-50%) translateY(-50%);
        }

        .slider-nav.prev:hover {
          transform: translateX(-50%) translateY(-50%) scale(1.1);
        }

        .slider-nav.next {
          right: 0;
          transform: translateX(50%) translateY(-50%);
        }

        .slider-nav.next:hover {
          transform: translateX(50%) translateY(-50%) scale(1.1);
        }

        @media (max-width: 768px) {
          .banner-slider {
            height: 300px;
          }
        }

        .tab-button {
          position: relative;
          transition: all 0.3s ease;
        }

        .tab-button::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 3px;
          background: linear-gradient(90deg, #667eea, #764ba2);
          transition: width 0.3s ease;
        }

        .tab-button.active::after {
          width: 100%;
        }

        .tab-button:hover {
          transform: translateY(-2px);
        }

        .banner-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(15,23,42,0.1), rgba(79,70,229,0.45));
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: all 0.3s ease;
        }

        .banner-wrapper:hover .banner-overlay {
          opacity: 1;
        }

        .banner-eye-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          border-radius: 9999px;
          background: rgba(255,255,255,0.95);
          box-shadow: 0 20px 40px rgba(0,0,0,0.25);
          color: #4f46e5;
          font-size: 30px;
          border: 2px solid rgba(129,140,248,0.6);
          transition: all 0.25s ease;
          cursor: pointer;
        }

        .banner-eye-btn:hover {
          transform: scale(1.08) translateY(-2px);
          box-shadow: 0 24px 50px rgba(0,0,0,0.3);
          background: white;
        }
      `}</style>

      <div className='bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-10' style={{ minHeight: '100%', width: '100%', overflow: 'visible' }}>
        <div className='mx-auto max-w-7xl'>
          {/* Banner Slider */}
          <div className={`mb-16 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}>
            <div className='banner-slider shadow-2xl'>
              {bannerSlides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`banner-slide ${index === currentSlide ? 'active' : ''}`}
                  style={{
                    backgroundImage: `url(${slide.image})`
                  }}
                />
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

          {/* Tabs */}
          <div className={`mb-10 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`} style={{ animationDelay: '0.1s' }}>
            <div className='flex justify-center gap-4'>
              <button
                onClick={() => setActiveTab('articles')}
                className={`tab-button rounded-2xl px-8 py-4 text-lg font-bold transition-all ${
                  activeTab === 'articles'
                    ? 'active bg-white text-indigo-600 shadow-xl'
                    : 'bg-white/50 text-gray-600 hover:bg-white/80'
                }`}
              >
                📝 Bài Viết
              </button>
              <button
                onClick={() => setActiveTab('contests')}
                className={`tab-button rounded-2xl px-8 py-4 text-lg font-bold transition-all ${
                  activeTab === 'contests'
                    ? 'active bg-white text-indigo-600 shadow-xl'
                    : 'bg-white/50 text-gray-600 hover:bg-white/80'
                }`}
              >
                🏆 Cuộc Thi
              </button>
            </div>
          </div>

          <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
            {/* Main Content */}
            <div className='lg:col-span-2'>
              <div
                className={`mb-10 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}
                style={{ animationDelay: '0.2s' }}
              >
                <h2 className='mb-6 text-4xl font-bold text-gray-800'>
                  {activeTab === 'articles' ? 'All Articles' : 'All Contests'}
                </h2>
                <div className='search-input'>
                  <input
                    type='text'
                    placeholder={activeTab === 'articles' ? '🔍 Search for articles...' : '🔍 Search for contests...'}
                    className='w-full rounded-2xl border-2 border-gray-200 bg-white px-6 py-4 text-lg shadow-md transition-all focus:border-indigo-400 focus:outline-none'
                    onKeyPress={(e: any) => {
                      if (e.key === 'Enter') handleSearch(e.target.value)
                    }}
                    onChange={(e) => {
                      if (e.target.value === '') handleSearch('')
                    }}
                  />
                </div>
              </div>

              {loading ? (
                <div className='py-20 text-center'>
                  <div className='loading-spinner mx-auto mb-4'></div>
                  <p className='text-lg text-gray-500'>Loading awesome content...</p>
                </div>
              ) : articles.length === 0 ? (
                <div className='animate-fadeIn rounded-3xl bg-white py-24 text-center shadow-xl'>
                  <div className='mb-6 text-8xl'>{activeTab === 'articles' ? '📚' : '🏆'}</div>
                  <p className='text-2xl font-semibold text-gray-500'>
                    {activeTab === 'articles' ? 'Không tìm thấy bài viết nào' : 'Không tìm thấy cuộc thi nào'}
                  </p>
                  <p className='mt-2 text-gray-400'>Try adjusting your search or filters</p>
                </div>
              ) : (
                <div className='space-y-6'>
                  {articles.map((item: any, index: number) => (
                    <div
                      key={item.id || index}
                      className={`card-hover stagger-item relative overflow-hidden rounded-3xl bg-white shadow-lg`}
                    >
                      {user?.id === item.userId && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            if (user?.id === item.userId) {
                              navigate(`/blog/update/${item.id}`)
                            }
                          }}
                          className='absolute right-4 bottom-4 flex items-center gap-2 rounded-full bg-indigo-600 px-3 py-1.5 text-center text-sm font-semibold text-white shadow-md transition-all duration-200 hover:scale-105 hover:bg-indigo-700'
                        >
                          <span className='hidden sm:inline'>Edit</span>
                        </button>
                      )}
                      <div className='grid grid-cols-1 sm:grid-cols-5'>
                        <div className='relative overflow-hidden sm:col-span-2'>
                          <div
                            className='image-zoom h-64 w-full bg-cover bg-center sm:h-full'
                            style={{
                              backgroundImage: `url(${item.image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&h=400&fit=crop'})`
                            }}
                          />
                          <div className='absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-indigo-600 backdrop-blur-sm'>
                            NEW
                          </div>
                        </div>

                        <div className='cursor-pointer p-8 sm:col-span-3' onClick={() => navigate(`/blog/${item.id}`, { state: { type: activeTab } })}>
                          <h4 className='mb-4 line-clamp-2 text-2xl font-bold text-gray-800 transition-colors duration-300 hover:text-indigo-600'>
                            {item.title}
                          </h4>
                          <div className='mb-5 flex items-center gap-4 text-sm text-gray-500'>
                            <div className='flex items-center gap-2'>
                              <CalendarOutlined className='text-indigo-500' />
                              <span className='font-medium'>{formatDate(item.createdAt)}</span>
                            </div>
                          </div>
                          <p
                            className='mb-5 line-clamp-3 leading-relaxed text-gray-600'
                            dangerouslySetInnerHTML={{
                              __html:
                                getPlainTextFromHTML(item.content?.toString() || '') || '<p>No content available</p>'
                            }}
                          ></p>
                          {item.tags && item.tags.length > 0 && (
                            <div className='flex flex-wrap gap-2'>
                              {item.tags.map((tag: any, idx: number) => (
                                <span
                                  key={idx}
                                  className='rounded-full border border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-1.5 text-sm font-semibold text-indigo-700'
                                >
                                  #{tag.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {totalArticles > 6 && (
                <div className='animate-fadeIn mb-16 mt-12 text-center'>
                  <div className='inline-flex gap-2 rounded-2xl bg-white p-2 shadow-lg'>
                    {[...Array(Math.ceil(totalArticles / 6))].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        className={`pagination-btn rounded-xl px-6 py-3 font-semibold transition-all ${
                          currentPage === i + 1
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className='lg:col-span-1'>
              <Button
                className='mb-8 w-full rounded-3xl bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-lg font-bold text-white shadow-xl hover:shadow-2xl'
                onClick={() => navigate(PagePath.BLOG_ADD, { state: { type: activeTab } })}
              >
                {activeTab === 'articles' ? '➕ Add Blog' : '➕ Add Contest'}
              </Button>

              {activeTab === 'articles' ? (
                <div
                  className={`mb-8 rounded-3xl bg-white p-6 shadow-xl ${isVisible ? 'animate-slideInRight' : 'opacity-0'}`}
                  style={{ animationDelay: '0.3s' }}
                >
                  <h4 className='mb-6 text-2xl font-bold text-gray-800'>Categories</h4>
                  <div className='space-y-1'>
                    {categories.map((item, idx) => (
                      <div
                        onClick={() => setActiveCategory(item.name.toLowerCase())}
                        key={idx}
                        className={`sidebar-item group flex cursor-pointer items-center justify-between rounded-2xl px-4 py-4 transition-all duration-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 ${activeCategory === item.name.toLowerCase() ? 'bg-gradient-to-r from-indigo-50 to-purple-50' : ''}`}
                      >
                        <div className='flex items-center gap-3'>
                          <span className='category-icon text-2xl'>{item.icon}</span>
                          <span className='font-semibold text-gray-700 group-hover:text-indigo-600'>{item.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div
                  className={`mb-8 overflow-hidden rounded-3xl bg-white p-3 shadow-xl ${isVisible ? 'animate-slideInRight' : 'opacity-0'}`}
                  style={{ animationDelay: '0.3s' }}
                >
                  <div className='banner-wrapper relative h-80 w-full rounded-2xl bg-cover bg-center' style={{ backgroundImage: `url(${images.bgCompetition})` }}>
                    <div className='banner-overlay'>
                      <button
                        type='button'
                        className='banner-eye-btn'
                        onClick={() => setIsBannerPreviewOpen(true)}
                      >
                        <EyeOutlined />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div
                className={`mb-8 rounded-3xl bg-white p-6 shadow-xl ${isVisible ? 'animate-slideInRight' : 'opacity-0'}`}
                style={{ animationDelay: '0.4s' }}
              >
                <h4 className='mb-6 text-2xl font-bold text-gray-800'>Recent Posts</h4>
                <div className='space-y-4'>
                  {recentPosts?.map((item: any) => (
                    <div
                      key={item.id}
                      className='group flex cursor-pointer gap-4'
                      onClick={() => navigate(`/blog/${item.id}`)}
                    >
                      <div className='flex-shrink-0 overflow-hidden rounded-2xl shadow-md'>
                        <img
                          src={item.image}
                          alt={item.title}
                          className='h-24 w-24 object-cover transition-transform duration-300 group-hover:scale-110'
                        />
                      </div>
                      <div className='flex-1'>
                        <p className='mb-2 line-clamp-2 text-sm font-semibold text-gray-700 transition-colors duration-300 group-hover:text-indigo-600'>
                          {item.title}
                        </p>
                        <p className='flex items-center gap-1 text-xs text-gray-500'>
                          <ClockCircleOutlined />
                          {formatDate(item.updatedAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className={`mb-16 rounded-3xl bg-white p-6 shadow-xl ${isVisible ? 'animate-slideInRight' : 'opacity-0'}`}
                style={{ animationDelay: '0.5s' }}
              >
                <h4 className='mb-6 text-2xl font-bold text-gray-800'>Popular Tags</h4>
                <div className='flex flex-wrap gap-3'>
                  {tags.map((tag, index) => (
                    <button
                      key={tag.id || index}
                      className={`tag-bounce cursor-pointer rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                        selectedTag === tag.name
                          ? 'scale-110 bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-xl'
                          : 'border-2 border-gray-200 bg-gray-100 text-gray-700 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600 hover:shadow-lg'
                      }`}
                      onClick={() => handleTagClick(tag.name)}
                    >
                      #{tag.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={isBannerPreviewOpen}
        footer={null}
        onCancel={() => setIsBannerPreviewOpen(false)}
        centered
        width={900}
        bodyStyle={{ padding: 0, borderRadius: 24, overflow: 'hidden', backgroundColor: 'transparent' }}
      >
        <img
          src={images.bgCompetition}
          alt='Competition Banner'
          style={{ width: '100%', display: 'block' }}
        />
      </Modal>
    </>
  )
}

export default Blog
