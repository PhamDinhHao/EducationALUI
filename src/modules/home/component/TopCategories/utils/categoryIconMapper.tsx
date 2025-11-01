import { ReactNode } from 'react'
import {
  TeamOutlined,
  CodeOutlined,
  MessageOutlined,
  VideoCameraOutlined,
  CameraOutlined,
  FundOutlined,
  EditOutlined,
  DollarOutlined,
  ExperimentOutlined,
  ApiOutlined,
  BookOutlined,
  RobotOutlined,
  BulbOutlined,
  GlobalOutlined,
  TrophyOutlined,
  HeartOutlined
} from '@ant-design/icons'

const iconMap: { [key: string]: ReactNode } = {
  'art': <EditOutlined />,
  'design': <EditOutlined />,
  'development': <CodeOutlined />,
  'programming': <CodeOutlined />,
  'communication': <MessageOutlined />,
  'videography': <VideoCameraOutlined />,
  'video': <VideoCameraOutlined />,
  'photography': <CameraOutlined />,
  'marketing': <FundOutlined />,
  'content writing': <EditOutlined />,
  'writing': <EditOutlined />,
  'finance': <DollarOutlined />,
  'science': <ExperimentOutlined />,
  'network': <ApiOutlined />,
  'business': <FundOutlined />,
  'education': <BookOutlined />,
  'technology': <RobotOutlined />,
  'ai': <BulbOutlined />,
  'web': <GlobalOutlined />,
  'sport': <TrophyOutlined />,
  'health': <HeartOutlined />
}

export const getCategoryIcon = (categoryName: string): ReactNode => {
  if (!categoryName) return <TeamOutlined />

  const normalizedName = categoryName.toLowerCase().trim()

  if (iconMap[normalizedName]) {
    return iconMap[normalizedName]
  }

  for (const [key, icon] of Object.entries(iconMap)) {
    if (normalizedName.includes(key)) {
      return icon
    }
  }

  return <TeamOutlined />
}

