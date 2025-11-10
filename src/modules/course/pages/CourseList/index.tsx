import { useEffect, useState, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Pagination, Typography, Spin, Alert, Select, Input, Row, Col } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { fetchQueryCourses } from '@/shared/server-action/courses.server'
import { fetchCourseTypes } from '@/shared/server-action/courseTypes.server'
import { ICourse, ICourseType } from '@/modules/home/cores/interfaces'
import { OptimizedCourseCard } from '@/modules/course/components/OptimizedCourseCard'

const { Title } = Typography
const { Option } = Select
const { Search } = Input

export default function CourseList() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const [courses, setCourses] = useState<ICourse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState<string>(searchParams.get('search') || '')
  const [courseTypeId, setCourseTypeId] = useState<number | undefined>(
    searchParams.get('courseTypeId') ? parseInt(searchParams.get('courseTypeId') || '0') : undefined
  )
  const [courseTypes, setCourseTypes] = useState<ICourseType[]>([])

  const currentPage = parseInt(searchParams.get('page') || '1', 10)
  const limit = 12

  // Fetch course types on mount
  useEffect(() => {
    const loadCourseTypes = async () => {
      try {
        const types = await fetchCourseTypes()
        setCourseTypes(types)
      } catch (err) {
        console.error('Error loading course types:', err)
      }
    }
    loadCourseTypes()
  }, [])

  const fetchCourses = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const result = await fetchQueryCourses({
        page: currentPage,
        limit,
        search: search || undefined,
        courseTypeId: courseTypeId
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
  }, [currentPage, search, courseTypeId])

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  const handlePageChange = (page: number) => {
    const params: any = { page: page.toString() }
    if (search) params.search = search
    if (courseTypeId) params.courseTypeId = courseTypeId.toString()
    setSearchParams(params)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSearch = (value: string) => {
    setSearch(value)
    const params: any = { page: '1' }
    if (value) params.search = value
    if (courseTypeId) params.courseTypeId = courseTypeId.toString()
    setSearchParams(params)
  }

  const handleCourseTypeFilterChange = (value: number | undefined) => {
    setCourseTypeId(value)
    const params: any = { page: '1' }
    if (search) params.search = search
    if (value) params.courseTypeId = value.toString()
    setSearchParams(params)
  }

  const handleCardClick = (courseId: number) => {
    navigate(`/courses/${courseId}`)
  }

  if (loading && courses.length === 0) {
    return <Spin size="large" style={{ margin: 24, display: 'block', textAlign: 'center' }} />
  }

  if (error) {
    return <Alert message="Lỗi" description={error} type="error" showIcon style={{ margin: 24 }} />
  }

  return (
    <div className="course-list-container" style={{ padding: '24px 16px', maxWidth: 1400, margin: '0 auto', minHeight: 'calc(100vh - 64px)' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ marginBottom: 24 }}>
          Danh sách khóa học
        </Title>
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={12} lg={12}>
            <Search
              placeholder="Tìm kiếm khóa học..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onSearch={handleSearch}
            />
          </Col>
          <Col xs={24} sm={12} md={12} lg={12}>
            <Select
              placeholder="Lọc theo loại khóa học"
              allowClear
              size="large"
              style={{ width: '100%' }}
              value={courseTypeId}
              onChange={handleCourseTypeFilterChange}
            >
              {courseTypes.map((type) => (
                <Option key={type.id} value={type.id}>
                  {type.name}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
      </div>

      {courses.length === 0 && !loading ? (
        <Alert message="Không có khóa học" description="Hiện tại chưa có khóa học nào." type="info" showIcon style={{ marginTop: 24 }} />
      ) : (
        <>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Spin size="large" />
            </div>
          ) : (
            <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
              {courses.map((course) => (
                <Col xs={24} sm={12} md={8} lg={6} key={course.id}>
                  <OptimizedCourseCard course={course} onCardClick={handleCardClick} />
                </Col>
              ))}
            </Row>
          )}

          {total > 0 && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32, paddingBottom: 40 }}>
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
          )}
        </>
      )}
    </div>
  )
}

