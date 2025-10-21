import React, { useState } from 'react'
import { Form, Input, Button, Typography, Radio, Spin, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Sidebar from '@/shared/components/Sidebar'

const { Title } = Typography
const API_URL = 'http://localhost:5000/api/v1/plan/plans'

const PersonalPlan: React.FC = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onFinish = async (values: any) => {
    try {
      setLoading(true)
      const res = await axios.post(API_URL, values)
      let data = res.data?.data ?? res.data

      // Nếu API trả về dạng string ```json ... ```
      if (typeof data === 'string') {
        data = data
          .replace(/```json\n?/, '')
          .replace(/```$/, '')
          .trim()
        data = JSON.parse(data)
      }

      navigate('/ai/plan-result', { state: data })
      message.success('Tạo kế hoạch cá nhân thành công!')
    } catch (err: any) {
      console.error(err)
      message.error(err?.response?.data?.message || 'Lỗi khi tạo kế hoạch.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex min-h-screen bg-gray-50'>
      <Sidebar />
      <div className='w-full p-[3rem]'>
        <div className='mx-auto max-w-[1100px]'>
          <div style={{ marginBottom: 20, textAlign: 'center' }}>
            <Title level={2} style={{ color: '#ff6600', display: 'inline' }}>
              Kế hoạch cá nhân
            </Title>
          </div>

          <div
            style={{
              maxWidth: 600,
              margin: '0 auto',
              background: '#fff',
              padding: 30,
              borderRadius: 12,
              border: '2px solid #ff6600',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
            }}
          >
            <Form layout='vertical' form={form} onFinish={onFinish}>
              <Form.Item label='Môn:' name='subject' rules={[{ required: true, message: 'Vui lòng nhập môn!' }]}>
                <Input placeholder='Ví dụ: Toán' style={{ borderRadius: 8 }} />
              </Form.Item>

              <Form.Item label='Năm học:' name='year'>
                <Input placeholder='Ví dụ: 2024 - 2025' style={{ borderRadius: 8 }} />
              </Form.Item>

              <Form.Item label='Tên trường:' name='school'>
                <Input placeholder='Ví dụ: THPT' style={{ borderRadius: 8 }} />
              </Form.Item>

              <Form.Item label='Lớp giảng dạy:' name='class'>
                <Input placeholder='Ví dụ: 10A5 - 43 HS' style={{ borderRadius: 8 }} />
              </Form.Item>

              <Form.Item label='Vai trò:' name='role'>
                <Radio.Group style={{ display: 'flex', flexDirection: 'column' }}>
                  <Radio value='chunhiem'>Chủ nhiệm</Radio>
                  <Radio value='hocsinhgioi'>Học sinh giỏi</Radio>
                  <Radio value='doantruong'>Đoàn trường</Radio>
                  <Radio value='khoahockythuat'>Khoa học kỹ thuật</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item>
                <Button
                  type='primary'
                  htmlType='submit'
                  disabled={loading}
                  style={{
                    width: '100%',
                    background: '#ff6600',
                    borderColor: '#ff6600',
                    borderRadius: 20,
                    padding: '5px 20px'
                  }}
                >
                  {loading ? <Spin size='small' /> : 'Bắt đầu tạo'}
                </Button>
              </Form.Item>
            </Form>
          </div>
          <p style={{ textAlign: 'center', color: '#666', marginTop: 10 }}>
            Khi đã tạo hồ sơ, bạn đồng ý với Điều khoản và Chính sách quyền riêng tư.
          </p>
        </div>
      </div>
    </div>
  )
}

export default PersonalPlan
