import { useEffect, useState } from 'react'
import { ITopCategory } from '@/modules/home/cores/interfaces'
import ResponsiveGrid from '@shared/ResponsiveGrid/ResponsiveGrid.tsx'
import TitleHeaderHome from '@shared/components/TitleHeaderHome/TitleHeaderHome.tsx'
import ItemTopCategory from '@/modules/home/component/TopCategories/ItemTopCategory.tsx'
import { fetchTopCategories } from '@/shared/server-action/courseTypes.server'
import { getCategoryIcon } from '@/modules/home/component/TopCategories/utils/categoryIconMapper'

interface ApiCategoryResponse {
  id: number
  name: string
  description: string | null
  createdAt: string
  updatedAt: string
  courseCount: number
}

const TopCategories = () => {
  const [categories, setCategories] = useState<ITopCategory[]>([])

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await fetchTopCategories(8)
      if (data && Array.isArray(data)) {
        const mappedCategories: ITopCategory[] = data.map((item: ApiCategoryResponse) => ({
          id: item.id,
          title: item.name,
          courses: item.courseCount || 0,
          icon: getCategoryIcon(item.name)
        }))
        setCategories(mappedCategories)
      }
    }

    fetchCategories()
  }, [])

  return (
    <div>
      <TitleHeaderHome
        heading='Top Categories'
        description='Explore our Popular Categories'
        buttonLabel='All categories'
        isButtonHeading={false}
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
