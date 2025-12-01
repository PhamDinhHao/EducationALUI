import React from 'react'
import { Typography, Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { BookOutlined, CodeOutlined } from '@ant-design/icons'
import Sidebar from '@/shared/components/Sidebar'

const { Title, Text } = Typography

const LessonBuilder: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className='flex min-h-screen bg-gray-50'>
      <Sidebar />
      <div className='w-full'>
        <div className='mx-auto max-w-[1100px]'></div>
        <div
          style={{
            width: '100%',
            minHeight: '100vh',
            background: '#fff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '3rem',
            justifyContent: 'start',
            marginTop: '12rem'
          }}
        >
          <BookOutlined style={{ fontSize: 72, color: '#E8612A' }} />
          <Title level={2} style={{ textAlign: 'center', color: '#E8612A' }}>
            Xây dựng giáo án
          </Title>
          <Text style={{ display: 'block', textAlign: 'center', marginBottom: 24 }}>
            GEN AI giúp bạn xây dựng giáo án theo chuẩn cấu trúc 5512
          </Text>

          <div
            style={{
              width: '100%',
              maxWidth: '800px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              margin: '20px 0'
            }}
          >
            <Button
              type='default'
              icon={<BookOutlined />}
              style={{
                border: '1px solid #E8612A',
                color: '#E8612A',
                borderRadius: '999px',
                height: 'auto',
                padding: '20px',
                fontWeight: 'bold'
              }}
              onClick={() => navigate('/ai/lesson-form')}
            >
              Soạn giáo án
            </Button>

            <Button
              type='default'
              icon={<CodeOutlined />}
              style={{
                border: '1px solid #E8612A',
                color: '#E8612A',
                borderRadius: '999px',
                height: 'auto',
                padding: '20px',
                fontWeight: 'bold'
              }}
              onClick={() => navigate('/ai/prompt-lesson')}
            >
              Prompt giáo án
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LessonBuilder
