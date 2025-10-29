import { ICourse } from '@/modules/home/cores/interfaces'
import ResponsiveGrid from '@shared/ResponsiveGrid/ResponsiveGrid.tsx'
import TitleHeaderHome from '@shared/components/TitleHeaderHome/TitleHeaderHome.tsx'
import ItemTopCourses from '@/modules/home/component/TopCourses/ItemTopCourses.tsx'

const TopCourses = () => {
  const categories = [
    { title: 'Art & Design', courses: 38 },
    { title: 'Development', courses: 38 },
    { title: 'Communication', courses: 38 },
    { title: 'Videography', courses: 38 },
    { title: 'Photography', courses: 38 },
    { title: 'Marketing', courses: 38 },
    { title: 'Videography', courses: 38 },
    { title: 'Photography', courses: 38 }
  ]

  return (
    <div>
      <TitleHeaderHome heading='Khóa học nổi bật' description='Explore our Popular Courses' buttonLabel='All Courses' />
      <ResponsiveGrid<ICourse>
        data={categories}
        cols={4}
        colSpans={{ xs: 24, sm: 12, md: 8, lg: 6, xl: 6 }}
        renderCell={ItemTopCourses}
      />
    </div>
  )
}

export default TopCourses
