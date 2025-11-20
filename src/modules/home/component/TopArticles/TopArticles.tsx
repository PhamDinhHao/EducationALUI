import TitleHeaderHome from '@shared/components/TitleHeaderHome/TitleHeaderHome.tsx'
import ItemTopArticles from '@/modules/home/component/TopArticles/ItemTopArticles.tsx'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getRecentPosts } from '@/modules/blog/services/blogService.service'
import CarouselSlider from '@shared/components/CarouselSlider/CarouselSlider.tsx'

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
    naviagte('/courses')
  }
  return (
    <div>
      <TitleHeaderHome onAction={handleNavigate} heading='Latest articles' description='Explore our Free Acticles' buttonLabel='All articles' />
      <CarouselSlider<any>
        data={blog}
        renderItem={(item) => <ItemTopArticles item={item} />}
        itemsPerView={4}
      />
    </div>
  )
}

export default TopArticles
