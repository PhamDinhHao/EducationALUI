import { ICourse } from '@/modules/home/cores/interfaces'
import ResponsiveGrid from '@shared/ResponsiveGrid/ResponsiveGrid.tsx'
import TitleHeaderHome from '@shared/components/TitleHeaderHome/TitleHeaderHome.tsx'
import ItemTopCategory from '@/modules/home/component/TopCategories/ItemTopCategory.tsx'

const TopCategories = () => {
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
      <TitleHeaderHome
        heading='Top Categories'
        description='Explore our Popular Categories'
        buttonLabel='All categories'
      />
      <ResponsiveGrid<ICourse>
        data={categories}
        cols={5}
        colSpans={{ xs: 24, sm: 12, md: 6, lg: 6, xl: 4 }}
        renderCell={ItemTopCategory}
      />
    </div>
  )
}

export default TopCategories
