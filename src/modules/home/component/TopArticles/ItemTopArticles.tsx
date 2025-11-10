import { CalendarOutlined, EyeOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

interface IArticle {
  id: string
  title: string
  image?: string
  createdAt: string
  tags?: Array<{ name: string }>
  content?: string
  views?: number
}

const ItemTopArticles = (item: IArticle) => {
  const navigate = useNavigate()

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
        .article-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .article-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.6s;
        }

        .article-card:hover::before {
          left: 100%;
        }

        .article-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.2);
        }

        .article-image {
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .article-card:hover .article-image {
          transform: scale(1.1);
        }

        .article-tag {
          transition: all 0.3s ease;
        }

        .article-tag:hover {
          transform: translateY(-2px);
        }
      `}</style>

      <div
        className='article-card cursor-pointer overflow-hidden rounded-2xl bg-white shadow-lg'
        onClick={() => navigate(`/blog/${item.id}`)}
      >
        {/* Image Section */}
        <div className='relative h-48 overflow-hidden'>
          <div
            className='article-image h-full w-full bg-cover bg-center'
            style={{
              backgroundImage: `url(${item.image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&h=400&fit=crop'})`
            }}
          />
          {/* Badge */}
          <div className='absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-indigo-600 backdrop-blur-sm'>
            TOP
          </div>
        </div>

        {/* Content Section */}
        <div className='p-5'>
          {/* Title */}
          <h4 className='mb-3 line-clamp-2 text-lg font-bold text-gray-800 transition-colors duration-300 hover:text-indigo-600'>
            {item.title}
          </h4>

          {/* Meta Info */}
          <div className='mb-4 flex items-center gap-4 text-xs text-gray-500'>
            <div className='flex items-center gap-1'>
              <CalendarOutlined className='text-indigo-500' />
              <span>{formatDate(item.createdAt)}</span>
            </div>
            {item.views && (
              <div className='flex items-center gap-1'>
                <EyeOutlined className='text-indigo-500' />
                <span>{item.views}</span>
              </div>
            )}
          </div>

          {/* Content Preview */}
          {item.content && (
            <p
              className='mb-4 line-clamp-2 text-sm leading-relaxed text-gray-600'
              dangerouslySetInnerHTML={{
                __html: item.content.substring(0, 100) + '...'
              }}
            />
          )}

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className='flex flex-wrap gap-2'>
              {item.tags.slice(0, 2).map((tag, idx) => (
                <span
                  key={idx}
                  className='article-tag rounded-full border border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 px-3 py-1 text-xs font-semibold text-indigo-700'
                >
                  #{tag.name}
                </span>
              ))}
              {item.tags.length > 2 && (
                <span className='rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600'>
                  +{item.tags.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ItemTopArticles