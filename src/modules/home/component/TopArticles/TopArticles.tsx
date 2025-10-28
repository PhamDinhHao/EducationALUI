import { ICourse } from '@/modules/home/cores/interfaces'
import ResponsiveGrid from '@shared/ResponsiveGrid/ResponsiveGrid.tsx'
import TitleHeaderHome from '@shared/components/TitleHeaderHome/TitleHeaderHome.tsx'
import ItemTopArticles from '@/modules/home/component/TopArticles/ItemTopArticles.tsx'

const TopArticles = () => {
  const categories = [
    { title: 'Art & Design', courses: 38 },
    { title: 'Development', courses: 38 },
    { title: 'Communication', courses: 38 },
    { title: 'Videography', courses: 38 },
    { title: 'Photography', courses: 38 },
    { title: 'Marketing', courses: 38 },
    { title: 'Content Writing', courses: 38 },
    { title: 'Finance', courses: 38 },
    { title: 'Science', courses: 38 },
    { title: 'Network', courses: 38 }
  ]

  return (
    <div>
      <TitleHeaderHome heading='Latest articles' description='Explore our Free Acticles' buttonLabel='All articles' />
      <ResponsiveGrid<ICourse>
        data={categories}
        cols={3}
        colSpans={{ xs: 24, sm: 12, md: 8, lg: 8, xl: 8 }}
        renderCell={ItemTopArticles}
      />
    </div>
  )
}

export default TopArticles
