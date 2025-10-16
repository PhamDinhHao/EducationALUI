import { ITopCategory } from '@/modules/home/cores/interfaces'
import ResponsiveGrid from '@shared/ResponsiveGrid/ResponsiveGrid.tsx'
import TitleHeaderHome from '@shared/components/TitleHeaderHome/TitleHeaderHome.tsx'
import ItemTopCategory from '@/modules/home/component/TopCategories/ItemTopCategory.tsx'
import { TeamOutlined } from '@ant-design/icons'

const TopCategories = () => {
  const categories: ITopCategory[] = [
    {
      title: 'Art & Design',
      courses: 38,
      icon: <TeamOutlined />
    },
    {
      title: 'Development',
      courses: 38,
      icon: <TeamOutlined />
    },
    {
      title: 'Communication',
      courses: 38,
      icon: <TeamOutlined />
    },
    {
      title: 'Videography',
      courses: 38,
      icon: <TeamOutlined />
    },
    {
      title: 'Photography',
      courses: 38,
      icon: <TeamOutlined />
    },
    {
      title: 'Marketing',
      courses: 38,
      icon: <TeamOutlined />
    },
    {
      title: 'Content Writing',
      courses: 38,
      icon: <TeamOutlined />
    },
    {
      title: 'Finance',
      courses: 38,
      icon: <TeamOutlined />
    },
    {
      title: 'Science',
      courses: 38,
      icon: <TeamOutlined />
    },
    {
      title: 'Network',
      courses: 38,
      icon: <TeamOutlined />
    }
  ]

  return (
    <div>
      <TitleHeaderHome
        heading='Top Categories'
        description='Explore our Popular Categories'
        buttonLabel='All categories'
      />
      <ResponsiveGrid<ITopCategory>
        data={categories}
        cols={5}
        colSpans={{ xs: 24, sm: 12, md: 6, lg: 6, xl: 4 }}
        renderCell={ItemTopCategory}
      />
    </div>
  )
}

export default TopCategories
