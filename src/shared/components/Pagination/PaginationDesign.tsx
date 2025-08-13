import { memo, useCallback } from 'react'
import { Pagination } from 'antd'

type PaginationProps = {
  onChangePage: (page: { page: number }) => void
  perPage: number
  currentPage: number
  total: number
}

const PaginationDesign = memo(({ onChangePage, perPage, currentPage, total }: PaginationProps) => {
  const handleChange = useCallback((page: number) => {
    onChangePage({ page })
  }, [currentPage])

  return (
    <div className='mb-6 mt-5 flex items-center justify-between'>
      <Pagination
        showSizeChanger={false}
        className='float-end'
        current={currentPage}
        total={total}
        pageSize={perPage}
        onChange={handleChange}
      />
      <p className='text-sm'>検索件数{total}件</p>
    </div>
  )
})

PaginationDesign.displayName = 'PaginationDesign'

export default PaginationDesign
