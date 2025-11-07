import { useState, useEffect } from 'react'
import { CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { PagePath } from '@/shared/core/enum/page.enum'
import { Button } from 'antd'

const Blog = () => {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalArticles, setTotalArticles] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const [tags, setTags] = useState<any[]>([])
  const [recentPosts, setRecentPosts] = useState<any[]>([])
  const navigate = useNavigate()
  const categories = [
    { name: 'Commercial', count: 15, icon: '🏢' },
    { name: 'Office', count: 15, icon: '💼' },
    { name: 'Shop', count: 15, icon: '🛍️' },
    { name: 'Educate', count: 15, icon: '📚' },
    { name: 'Academy', count: 15, icon: '🎓' },
    { name: 'Single family home', count: 15, icon: '🏠' }
  ]

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Fetch blogs from API - Giống code cũ
  const fetchBlogs = async (page = 1, title = '', tag = '') => {
    setLoading(true)
    try {
      const params = {
        page,
        limit: 6,
        sortBy: 'createdAt:desc',
        ...(title && { title }),
        ...(tag && { tags: tag })
      }

      const response = await fetch('http://localhost:5000/api/v1/blogs?' + new URLSearchParams(params as any))
      const responseTags = await fetch('http://localhost:5000/api/v1/blog-tags')
      const responseRecentPosts = await fetch('http://localhost:5000/api/v1/blogs/recent-posts')
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()
      const tagsData = await responseTags.json()
      const recentPostsData = await responseRecentPosts.json()
      console.log(recentPostsData);

      setRecentPosts(recentPostsData || [])
      setTags(tagsData || [])
      setArticles(data.data || [])
      setTotalArticles(data.pagination?.total || 0)
    } catch (error) {
      console.error('Error fetching blogs:', error)
      // Hiển thị thông báo lỗi đơn giản
      alert('Không thể tải dữ liệu blog')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBlogs(currentPage, searchQuery, selectedTag)
  }, [currentPage, searchQuery, selectedTag])

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
      `}</style>

      <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-10'>
        <div className='mx-auto max-w-7xl'>
          {/* Hero Section */}
          <div className={`mb-16 text-center ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}>
            <h1 className='gradient-text mb-6 text-6xl font-extrabold leading-tight'>Discover Amazing Stories</h1>
            <p className='mx-auto max-w-2xl text-xl text-gray-600'>
              Explore our collection of insightful articles, tutorials, and creative resources
            </p>
          </div>

          <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
            {/* Main Content */}
            <div className='lg:col-span-2'>
              <div
                className={`mb-10 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}
                style={{ animationDelay: '0.2s' }}
              >
                <h2 className='mb-6 text-4xl font-bold text-gray-800'>All Articles</h2>
                <div className='search-input'>
                  <input
                    type='text'
                    placeholder='🔍 Search for articles...'
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
                  <div className='mb-6 text-8xl'>📚</div>
                  <p className='text-2xl font-semibold text-gray-500'>Không tìm thấy bài viết nào</p>
                  <p className='mt-2 text-gray-400'>Try adjusting your search or filters</p>
                </div>
              ) : (
                <div className='space-y-6'>
                  {articles.map((item: any, index: number) => (
                    <div
                      onClick={() => navigate(`/blog/${item.id}`)}
                      key={item.id || index}
                      className={`card-hover stagger-item overflow-hidden rounded-3xl bg-white shadow-lg`}
                    >
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
                        <div className='p-8 sm:col-span-3'>
                          <h4 className='mb-4 line-clamp-2 cursor-pointer text-2xl font-bold text-gray-800 transition-colors duration-300 hover:text-indigo-600'>
                            {item.title}
                          </h4>
                          <div className='mb-5 flex items-center gap-4 text-sm text-gray-500'>
                            <div className='flex items-center gap-2'>
                              <CalendarOutlined className='text-indigo-500' />
                              <span className='font-medium'>{formatDate(item.createdAt)}</span>
                            </div>
                          </div>
                          <p className='mb-5 line-clamp-3 leading-relaxed text-gray-600'>
                            {item.description || item.content?.substring(0, 150) + '...'}
                          </p>
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
              {/* Category Section */}
              <Button className='mb-8 rounded-3xl bg-white p-6 shadow-xl' onClick={() => navigate(PagePath.BLOG_ADD)}>Add Blog</Button>
              <div
                className={`mb-8 rounded-3xl bg-white p-6 shadow-xl ${isVisible ? 'animate-slideInRight' : 'opacity-0'}`}
                style={{ animationDelay: '0.3s' }}
              >
                <h4 className='mb-6 text-2xl font-bold text-gray-800'>Categories</h4>
                <div className='space-y-1'>
                  {categories.map((item, idx) => (
                    <div
                      key={idx}
                      className='sidebar-item group flex cursor-pointer items-center justify-between rounded-2xl px-4 py-4 transition-all duration-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50'
                    >
                      <div className='flex items-center gap-3'>
                        <span className='category-icon text-2xl'>{item.icon}</span>
                        <span className='font-semibold text-gray-700 group-hover:text-indigo-600'>{item.name}</span>
                      </div>
                      <span className='rounded-full bg-indigo-100 px-3 py-1 text-sm font-bold text-indigo-700'>
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Posts Section */}
              <div
                className={`mb-8 rounded-3xl bg-white p-6 shadow-xl ${isVisible ? 'animate-slideInRight' : 'opacity-0'}`}
                style={{ animationDelay: '0.4s' }}
              >
                <h4 className='mb-6 text-2xl font-bold text-gray-800'>Recent Posts</h4>
                <div className='space-y-4'>
                  {recentPosts?.map((item: any) => (
                    <div key={item.id} className='group flex cursor-pointer gap-4'>
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

              {/* Tags Section */}
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
    </>
  )
}

export default Blog
