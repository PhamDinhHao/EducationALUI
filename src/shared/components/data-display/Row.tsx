import { Button } from 'antd'
import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'
import { HolderOutlined } from '@ant-design/icons'
import React, { useContext, useMemo } from 'react'

import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities'

interface RowContextProps {
  setActivatorNodeRef?: (element: HTMLElement | null) => void
  listeners?: SyntheticListenerMap
}

const RowContext = React.createContext<RowContextProps>({})

export const DragHandle: React.FC = () => {
  const { setActivatorNodeRef, listeners } = useContext(RowContext)
  return (
    <Button
      icon={<HolderOutlined />}
      ref={setActivatorNodeRef}
      size='small'
      style={{ cursor: 'move' }}
      type='text'
      {...listeners}
    />
  )
}

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string
}

export const Row: React.FC<RowProps> = (props) => {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    // eslint-disable-next-line react/destructuring-assignment
    id: props['data-row-key']
  })

  const style: React.CSSProperties = {
    // eslint-disable-next-line react/destructuring-assignment
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    ...(isDragging ? { position: 'relative', zIndex: 2 } : {})
  }

  const contextValue = useMemo<RowContextProps>(
    () => ({ setActivatorNodeRef, listeners }),
    [setActivatorNodeRef, listeners]
  )

  return (
    <RowContext.Provider value={contextValue}>
      <tr {...props} ref={setNodeRef} style={style} {...attributes} />
    </RowContext.Provider>
  )
}
