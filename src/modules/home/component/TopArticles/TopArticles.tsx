import ResponsiveGrid from '@shared/ResponsiveGrid/ResponsiveGrid.tsx'
import TitleHeaderHome from '@shared/components/TitleHeaderHome/TitleHeaderHome.tsx'
import ItemTopArticles from '@/modules/home/component/TopArticles/ItemTopArticles.tsx'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getRecentPosts } from '@/modules/blog/services/blogService.service'

const TopArticles = () => {
  const naviagte = useNavigate();

  const [blog, setBlogs] = useState<any[]>([])

  useEffect(() => {

    const fetchTopEnrolledCourse = async () => {
      const data = await getRecentPosts({limit: 8})
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
      <ResponsiveGrid<any>
        data={blog}
        cols={4}
        colSpans={{ xs: 24, sm: 12, md: 8, lg: 6, xl: 6 }}
        renderCell={ItemTopArticles}
      />
    </div>
  )
}

export default TopArticles
