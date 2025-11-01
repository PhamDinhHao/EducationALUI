import { useEffect, useState } from 'react'
import { Card, Form, Input, Button, Avatar, Typography, message, Spin, Tabs, Space, Divider } from 'antd'
import { UserOutlined, LockOutlined, SaveOutlined } from '@ant-design/icons'
import { useBoundStore } from '@/shared/stores'
import { getProfile, updateProfile, changePassword } from '@/shared/services/auth.service'
import { User } from '@/shared/core/types'

const { Title, Text } = Typography
const { TabPane } = Tabs

export default function Profile() {
  const { user, userProfile } = useBoundStore((state) => state)
  const [profileForm] = Form.useForm()
  const [passwordForm] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState<User | null>(user)

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      try {
        const res = await getProfile()
        const profileUser = res.data?.data?.user || res.data?.user
        if (profileUser) {
          setUserData(profileUser)
          profileForm.setFieldsValue({
            name: profileUser.name || '',
            email: profileUser.email || ''
          })
          userProfile(profileUser)
        }
      } catch (err: any) {
        message.error(err.message || 'Không thể tải thông tin profile')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [profileForm, userProfile])

  const handleUpdateProfile = async (values: { name: string; email: string }) => {
    setLoading(true)
    try {
      const res = await updateProfile(values)
      const updatedUser = res.data?.data?.user || res.data?.user
      if (updatedUser) {
        setUserData(updatedUser)
        userProfile(updatedUser)
        message.success('Cập nhật thông tin thành công')
      }
    } catch (err: any) {
      message.error(err.message || 'Không thể cập nhật thông tin')
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (values: { oldPassword: string; newPassword: string; confirmPassword: string }) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('Mật khẩu mới và xác nhận mật khẩu không khớp')
      return
    }

    setLoading(true)
    try {
      await changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword
      })
      message.success('Đổi mật khẩu thành công')
      passwordForm.resetFields()
    } catch (err: any) {
      message.error(err.message || 'Không thể đổi mật khẩu')
    } finally {
      setLoading(false)
    }
  }

  if (loading && !userData) {
    return <Spin size="large" style={{ margin: 24, display: 'block', textAlign: 'center' }} />
  }

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <Title level={2} style={{ marginBottom: 24 }}>Quản lý tài khoản</Title>

      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <Avatar 
            size={64} 
            icon={<UserOutlined />}
            style={{ backgroundColor: '#1890ff' }}
          >
            {userData?.name?.[0]?.toUpperCase() || userData?.email?.[0]?.toUpperCase()}
          </Avatar>
          <div>
            <Title level={4} style={{ margin: 0 }}>{userData?.name || 'Chưa có tên'}</Title>
            <Text type="secondary">{userData?.email}</Text>
          </div>
        </div>

        <Divider />

        <Tabs defaultActiveKey="profile">
          <TabPane tab={<span><UserOutlined /> Thông tin cá nhân</span>} key="profile">
            <Form
              form={profileForm}
              layout="vertical"
              onFinish={handleUpdateProfile}
              style={{ marginTop: 24 }}
            >
              <Form.Item
                label="Tên"
                name="name"
                rules={[{ required: false, message: 'Vui lòng nhập tên' }]}
              >
                <Input placeholder="Nhập tên của bạn" prefix={<UserOutlined />} />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email' },
                  { type: 'email', message: 'Email không hợp lệ' }
                ]}
              >
                <Input placeholder="Nhập email" disabled />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
                  Lưu thông tin
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane tab={<span><LockOutlined /> Đổi mật khẩu</span>} key="password">
            <Form
              form={passwordForm}
              layout="vertical"
              onFinish={handleChangePassword}
              style={{ marginTop: 24 }}
            >
              <Form.Item
                label="Mật khẩu cũ"
                name="oldPassword"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu cũ' }]}
              >
                <Input.Password placeholder="Nhập mật khẩu cũ" prefix={<LockOutlined />} />
              </Form.Item>

              <Form.Item
                label="Mật khẩu mới"
                name="newPassword"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu mới' },
                  { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
                ]}
              >
                <Input.Password placeholder="Nhập mật khẩu mới" prefix={<LockOutlined />} />
              </Form.Item>

              <Form.Item
                label="Xác nhận mật khẩu mới"
                name="confirmPassword"
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: 'Vui lòng xác nhận mật khẩu mới' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve()
                      }
                      return Promise.reject(new Error('Mật khẩu xác nhận không khớp'))
                    }
                  })
                ]}
              >
                <Input.Password placeholder="Nhập lại mật khẩu mới" prefix={<LockOutlined />} />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" icon={<LockOutlined />} loading={loading}>
                  Đổi mật khẩu
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  )
}

