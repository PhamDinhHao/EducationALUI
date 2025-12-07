import TitleHeaderHome from '@shared/components/TitleHeaderHome/TitleHeaderHome.tsx'
import ItemTopArticles from '@/modules/home/component/TopArticles/ItemTopArticles.tsx'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getRecentPosts } from '@/modules/blog/services/blogService.service'
import { Row, Col } from 'antd'

const TopArticles = () => {
  const naviagte = useNavigate();

  const [blog, setBlogs] = useState<any[]>([])

  useEffect(() => {

    const fetchTopEnrolledCourse = async () => {
      const data = await getRecentPosts({ limit: 8 })
      setBlogs(data.data)
    }

    fetchTopEnrolledCourse()
  }, [])

  const handleNavigate = () => {
    naviagte('/blog')
  }

  // Limit to 8 articles for grid display (2 rows x 4 items)
  const displayArticles = (blog || []).slice(0, 8)

  return (
    <div>
      <TitleHeaderHome onAction={handleNavigate} heading='Bài viết nổi bật' description='Khám phá, học hỏi và chia sẻ' buttonLabel='Xem tất cả' />
      <Row gutter={[16, 16]}>
        {displayArticles.map((item, index) => (
          <Col xs={24} sm={12} md={12} lg={6} xl={6} key={item.id || index}>
            <ItemTopArticles item={item} />
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default TopArticles
