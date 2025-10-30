import React from 'react'
import { ClockCircleOutlined, UserOutlined } from '@ant-design/icons'
import { Card } from 'antd'
import { useNavigate } from 'react-router-dom'
import { ICourse } from '@/modules/home/cores/interfaces'

const { Meta } = Card

const ItemTopCourses: React.FC<ICourse> = (course) => {
  const navigate = useNavigate()
  const fallbackImg = '/vite.svg'
  return (
    <Card
      cover={
        <img
          draggable={false}
          alt={`Khoá học ${course.title}`}
          src={course?.img || fallbackImg}
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement
            if (target.src !== window.location.origin + fallbackImg && !target.src.endsWith(fallbackImg)) {
              target.src = fallbackImg
            }
          }}
        />
      }
      hoverable
      className="group text-center rounded-2xl p-4 border border-gray-200"
      style={{ borderRadius: 16, padding: 16, border: '1px solid #f0f0f0' }}
      onClick={() => {
        navigate(`/learncap/courses/${course.id}`)
      }}
      actions={[
        <span
          key='view'
          className="transition-colors duration-300 cursor-pointer group-hover:text-blue-500"
        >
          Xem chi tiết
        </span>
      ]}
    >
      <Meta
        title={course.title}
      />
      <div className="mt-2 text-sm text-gray-500">
        <div className="flex items-center justify-center">
          <UserOutlined className="text-gray-500 group-hover:text-blue-500" />
          <span className="ml-2 text-gray-500 group-hover:text-blue-500">{course?.enrollCount} học viên</span>
          <span className="mx-2 text-gray-500 group-hover:text-blue-500">•</span>
          <ClockCircleOutlined className="text-gray-500 group-hover:text-blue-500" />
          <span className="ml-2 text-gray-500 group-hover:text-blue-500">{course?.duration}</span>
        </div>
      </div>
    </Card>
  )
}

export default ItemTopCourses