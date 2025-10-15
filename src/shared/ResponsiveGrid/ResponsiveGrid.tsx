import { Col, Row } from 'antd'
import { ReactNode } from 'react'
import { cn } from '@shared/utils'

interface ResponsiveGridProps<T> {
  data: T[]
  cols: number
  colSpans: {
    xs: number
    sm: number
    md: number
    lg: number
    xl: number
  }
  colClass?: string
  renderCell: (item: T, idx: number) => ReactNode
}

const ResponsiveGrid = <T,>({ data, cols, colSpans, colClass = '', renderCell }: ResponsiveGridProps<T>) => {
  const rows = Math.ceil(data.length / cols)

  return (
    <>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <Row gutter={[24, 16]} key={rowIdx}>
          {Array.from({ length: cols }).map((_, colIdx) => {
            const idx = rowIdx * cols + colIdx
            return idx < data.length ? (
              <Col {...colSpans} className={cn('m-auto p-2', ...colClass)} key={colIdx}>
                {renderCell(data[idx], idx)}
              </Col>
            ) : (
              <Col {...colSpans} key={colIdx} />
            )
          })}
        </Row>
      ))}
    </>
  )
}

export default ResponsiveGrid
