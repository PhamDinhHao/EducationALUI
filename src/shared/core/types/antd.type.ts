import type { MenuProps } from 'antd'

export type MenuItem = Required<MenuProps>['items'][number] & {
  key: string
  label: React.ReactNode
  children?: MenuItem[]
  icon?: React.ReactNode
}
