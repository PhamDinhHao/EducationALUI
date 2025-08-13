import { Pagination, Row } from 'antd'

import type { PaginationProps } from 'antd'

type TableFooterProps = {
  paginationProps: PaginationProps
  children: React.ReactNode
}

const TableFooter: React.FC<TableFooterProps> = ({ paginationProps, children }) => {
  return (
    <Row justify='space-between' className=''>
      {children}
      <Pagination {...paginationProps} />
    </Row>
  )
}

export default TableFooter
