import { useState, useRef, useEffect } from 'react'
import { Card, Image } from 'antd'
import { ClockCircleOutlined, UserOutlined } from '@ant-design/icons'
import { ICourse } from '@/modules/home/cores/interfaces'
import images from '@/assets/images'

const { Meta } = Card

interface OptimizedCourseCardProps {
  course: ICourse
  onCardClick: (courseId: number) => void
  style?: React.CSSProperties
}

export const OptimizedCourseCard: React.FC<OptimizedCourseCardProps> = ({
  course,
  onCardClick,
  style
}) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [inView, setInView] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true)
            observer.disconnect()
          }
        })
      },
      { rootMargin: '50px' }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  const handleImageError = () => {
    setImageError(true)
    setImageLoaded(true)
  }

  return (
    <div ref={cardRef} style={style}>
      <Card
        className="transition-all duration-300 hover:-translate-y-2"
        cover={
          <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
            {inView ? (
              <>
                {!imageLoaded && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 1.5s infinite',
                      zIndex: 1
                    }}
                  />
                )}
                <Image
                  preview={false}
                  src={imageError ? images.imgeNotFond : course?.img}
                  alt={`Khoá học ${course.title}`}
                  fallback={images.imgeNotFond}
                  style={{
                    height: '250px',
                    width: '100%',
                    objectFit: 'contain',
                    opacity: imageLoaded ? 1 : 0,
                    transition: 'opacity 0.3s ease-in-out',
                    position: 'relative',
                    zIndex: 2
                  }}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  loading="lazy"
                />
              </>
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: '#f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#999'
                }}
              >
                Loading...
              </div>
            )}
          </div>
        }
        hoverable
        style={{
          borderRadius: 16,
          border: '1px solid #f0f0f0',
          marginBottom: 16,
          height: '100%'
        }}
        onClick={() => onCardClick(course.id)}
        actions={[
          <span
            key="view"
            style={{ color: '#1890ff', cursor: 'pointer' }}
            onClick={(e) => {
              e.stopPropagation()
              onCardClick(course.id)
            }}
          >
            Xem chi tiết
          </span>
        ]}
      >
        <Meta title={course.title} />
        <div style={{ marginTop: 12, fontSize: 14, color: '#666' }}>
          <div style={{ marginBottom: 8 }}>
            <UserOutlined style={{ marginRight: 4 }} />
            <span>{course?.enrollCount ?? course?.students ?? 0} học viên</span>
            {course?.duration && (
              <>
                <span style={{ margin: '0 8px' }}>•</span>
                <ClockCircleOutlined style={{ marginRight: 4 }} />
                <span>{course.duration}</span>
              </>
            )}
          </div>
          <div style={{ color: '#888', fontSize: 12 }}>{course.teacher}</div>
        </div>
      </Card>
      <style>
        {`
          @keyframes shimmer {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }
        `}
      </style>
    </div>
  )
}

