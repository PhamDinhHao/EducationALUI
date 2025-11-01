import { useEffect, useState, useCallback, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
// @ts-expect-error - react-window v2 export structure
import { Grid } from 'react-window'
import { Pagination, Typography, Spin, Alert, Select } from 'antd'
import { fetchQueryCourses } from '@/shared/server-action/courses.server'
import { ICourse } from '@/modules/home/cores/interfaces'
import { OptimizedCourseCard } from '@/modules/course/components/OptimizedCourseCard'

const { Title } = Typography
const { Option } = Select

const COLUMN_WIDTH = 280
const ROW_HEIGHT = 380
const GUTTER_SIZE = 16

export default function CourseList() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const [courses, setCourses] = useState<ICourse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [total, setTotal] = useState(0)
  const [containerWidth, setContainerWidth] = useState(1200)
  const [sortBy, setSortBy] = useState<string>('createdAt')
  const [sortType, setSortType] = useState<'asc' | 'desc'>('desc')

  const currentPage = parseInt(searchParams.get('page') || '1', 10)
  const limit = 12

  const columnCount = useMemo(() => {
    return Math.floor((containerWidth - GUTTER_SIZE) / (COLUMN_WIDTH + GUTTER_SIZE)) || 1
  }, [containerWidth])

  const rowCount = useMemo(() => {
    return Math.ceil(courses.length / columnCount)
  }, [courses.length, columnCount])

  useEffect(() => {
    const updateSize = () => {
      const container = document.querySelector('.course-list-container')
      if (container) {
        setContainerWidth(container.clientWidth - 48)
      }
    }

    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  const fetchCourses = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const result = await fetchQueryCourses({
        page: currentPage,
        limit,
        sortBy,
        sortType
      })

      if (!result) {
        setCourses([])
        setTotal(0)
        return
      }
      if (result && typeof result === 'object' && 'data' in result) {
        const coursesData = Array.isArray(result.data) ? result.data : []
        setCourses(coursesData)

        if (result.pagination && typeof result.pagination === 'object') {
          setTotal(result.pagination.total || 0)
        } else {
          setTotal(coursesData.length)
        }
      }
      else if (Array.isArray(result)) {
        setCourses(result)
        setTotal(result.length)
      }
      else {
        setCourses([])
        setTotal(0)
      }
    } catch (err: any) {
      setError(err.message || 'Lỗi khi tải danh sách khóa học')
      setCourses([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [currentPage, sortBy, sortType])

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString(), sortBy, sortType: sortType })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSortChange = (value: string) => {
    const [newSortBy, newSortType] = value.split('-') as [string, 'asc' | 'desc']
    setSortBy(newSortBy)
    setSortType(newSortType)
    setSearchParams({ page: '1', sortBy: newSortBy, sortType: newSortType })
  }

  const handleCardClick = (courseId: number) => {
    navigate(`/courses/${courseId}`)
  }

  const Cell = useCallback(
    ({ columnIndex, rowIndex, style }: {
      columnIndex: number
      rowIndex: number
      style: React.CSSProperties
      ariaAttributes?: { "aria-colindex": number; role: "gridcell" }
    }) => {
      const index = rowIndex * columnCount + columnIndex
      const course = courses[index]

      if (!course) {
        return null
      }

      return (
        <div
          style={{
            ...style,
            paddingLeft: columnIndex === 0 ? 0 : GUTTER_SIZE,
            paddingRight: GUTTER_SIZE,
            paddingTop: rowIndex === 0 ? 0 : GUTTER_SIZE,
            paddingBottom: GUTTER_SIZE
          }}
        >
          <OptimizedCourseCard course={course} onCardClick={handleCardClick} />
        </div>
      )
    },
    [courses, columnCount, handleCardClick]
  )

  if (loading && courses.length === 0) {
    return <Spin size="large" style={{ margin: 24, display: 'block', textAlign: 'center' }} />
  }

  if (error) {
    return <Alert message="Lỗi" description={error} type="error" showIcon style={{ margin: 24 }} />
  }

  return (
    <div className="course-list-container" style={{ padding: 24, maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <Title level={2} style={{ margin: 0 }}>
          Danh sách khóa học
        </Title>
        <Select
          value={`${sortBy}-${sortType}`}
          onChange={handleSortChange}
          style={{ width: 300 }}
          placeholder="Sắp xếp theo"
        >
          <Option value="createdAt-desc">Mới nhất</Option>
          <Option value="createdAt-asc">Cũ nhất</Option>
          <Option value="title-asc">Tên A-Z</Option>
          <Option value="title-desc">Tên Z-A</Option>
        </Select>
      </div>

      {courses.length === 0 ? (
        <Alert message="Không có khóa học" description="Hiện tại chưa có khóa học nào." type="info" showIcon style={{ marginTop: 24 }} />
      ) : (
        <>
          <div style={{ minHeight: 400 }}>
            <Grid
              columnCount={columnCount}
              columnWidth={COLUMN_WIDTH + GUTTER_SIZE}
              height={Math.min(rowCount * (ROW_HEIGHT + GUTTER_SIZE), 800)}
              rowCount={rowCount}
              rowHeight={ROW_HEIGHT + GUTTER_SIZE}
              width={containerWidth}
              cellComponent={Cell}
              cellProps={{}}
            />
          </div>

          <div style={{ marginTop: 32, display: 'flex', justifyContent: 'center' }}>
            <Pagination
              current={currentPage}
              total={total}
              pageSize={limit}
              showSizeChanger={false}
              showQuickJumper
              showTotal={(total: number) => `Tổng ${total} khóa học`}
              onChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  )
}

