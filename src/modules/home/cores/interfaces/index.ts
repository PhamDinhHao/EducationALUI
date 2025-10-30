import { ReactNode } from 'react'


export interface ICourseType {
  id: number
  name: string
}

export interface ICourse {
  id: number
  title: string
  description: string
  img: string
  url?: string
  teacher: string
  students?: number
  duration?: string
  courseType?: ICourseType
  enrollCount?: number
}


export interface ITopCategory {
  icon: ReactNode
  title: string
  courses: number
}