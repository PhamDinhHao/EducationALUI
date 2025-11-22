import { useEffect, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { Card, Form, Input, Button, Typography, message, Spin, Tabs, Divider, Upload, Empty, Image, Dropdown } from 'antd'
import { UserOutlined, LockOutlined, SaveOutlined, CameraOutlined, LoadingOutlined, TrophyOutlined, DownloadOutlined, FilePdfOutlined, FileImageOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import type { RcFile } from 'antd/es/upload/interface'
import { useBoundStore } from '@/shared/stores'
import { getProfile, updateProfile, changePassword, uploadAvatar } from '@/shared/services/auth.service'
import { User } from '@/shared/core/types'
import { beforeUpload } from '@/shared/utils/image-utils'
import { getMyCertificates, downloadCertificate, type Certificate } from '@/modules/course/services/certificate.service'
import { downloadCertificatePDF, downloadCertificateImage } from '@/modules/course/services/certificateGenerator.service'

const { Title, Text } = Typography
const { TabPane } = Tabs

export default function Profile() {
  const { user, userProfile, userLogin } = useBoundStore((state) => state)
  const [profileForm] = Form.useForm()
  const [passwordForm] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [userData, setUserData] = useState<User | null>(user)
  const [imageUrl, setImageUrl] = useState<string | null>(user?.avatar || null)
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loadingCertificates, setLoadingCertificates] = useState(false)
  const [downloadingCertId, setDownloadingCertId] = useState<number | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState<string>('profile')
  
  // Get courseId from location state if exists
  const courseIdFromState = location.state?.courseId as number | undefined

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      try {
        const res = await getProfile()
        const profileUser = res.data?.data?.user || res.data?.user
        if (profileUser) {
          setUserData(profileUser)
          setImageUrl(profileUser.avatar || null)
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

  useEffect(() => {
    const fetchCertificates = async () => {
      setLoadingCertificates(true)
      try {
        const certs = await getMyCertificates()
        setCertificates(certs)
      } catch (err: any) {
        console.error('Error fetching certificates:', err)
      } finally {
        setLoadingCertificates(false)
      }
    }

    fetchCertificates()
  }, [])

  // Handle tab from URL query params
  useEffect(() => {
    const tabParam = searchParams.get('tab')
    if (tabParam === 'certificates') {
      setActiveTab('certificates')
      // Clear the tab param after setting it
      setSearchParams({}, { replace: true })
    }
  }, [searchParams, setSearchParams])

  const handleUpdateProfile = async (values: { name: string; email: string }) => {
    setLoading(true)
    try {
      const res = await updateProfile(values)
      const updatedUser = res.data?.data?.user || res.data?.user
      if (updatedUser) {
        setUserData(updatedUser)
        setImageUrl(updatedUser.avatar || null)
        userProfile(updatedUser)
        userLogin(updatedUser)
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

  const handleAvatarUpload = async (file: RcFile) => {
    try {
      setUploadingAvatar(true)
      const res = await uploadAvatar(file)
      const updatedUser = res.data?.data?.user || res.data?.user
      if (updatedUser) {
        setUserData(updatedUser)
        setImageUrl(updatedUser.avatar || null)
        userProfile(updatedUser)
        message.success('Cập nhật ảnh đại diện thành công')
      }
    } catch (err: any) {
      message.error(err.message || 'Không thể tải lên ảnh đại diện')
    } finally {
      setUploadingAvatar(false)
    }
  }

  const uploadButton = (
    <div>
      {uploadingAvatar ? <LoadingOutlined /> : <CameraOutlined />}
      <div style={{ marginTop: 8 }}>Tải lên</div>
    </div>
  )

  const handleDownloadCertificate = async (certificate: Certificate, format: 'pdf' | 'png' = 'pdf') => {
    try {
      setDownloadingCertId(certificate.id)
      message.loading('Đang tạo chứng chỉ...', 0)

      // If server has PDF/image URL, use it
      if (format === 'pdf' && certificate.pdfUrl) {
        window.open(certificate.pdfUrl, '_blank')
        message.destroy()
        message.success('Đã mở chứng chỉ PDF')
        return
      }

      if (format === 'png' && certificate.imageUrl) {
        const link = document.createElement('a')
        link.href = certificate.imageUrl
        link.download = `certificate-${certificate.certificateNumber}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        message.destroy()
        message.success('Đã tải chứng chỉ PNG')
        return
      }

      // Generate certificate on frontend
      if (format === 'pdf') {
        await downloadCertificatePDF(certificate, userData || undefined)
        message.destroy()
        message.success('Đã tải chứng chỉ PDF')
      } else {
        await downloadCertificateImage(certificate, userData || undefined)
        message.destroy()
        message.success('Đã tải chứng chỉ PNG')
      }
    } catch (err: any) {
      message.destroy()
      message.error(err.message || 'Không thể tải chứng chỉ')
      console.error('Download certificate error:', err)
    } finally {
      setDownloadingCertId(null)
    }
  }

  const getDownloadMenuItems = (certificate: Certificate): MenuProps['items'] => [
    {
      key: 'pdf',
      label: 'Tải PDF',
      icon: <FilePdfOutlined />,
      onClick: () => handleDownloadCertificate(certificate, 'pdf')
    },
    {
      key: 'png',
      label: 'Tải PNG',
      icon: <FileImageOutlined />,
      onClick: () => handleDownloadCertificate(certificate, 'png')
    }
  ]

  if (loading && !userData) {
    return <Spin size="large" style={{ margin: 24, display: 'block', textAlign: 'center' }} />
  }

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <Title level={2} style={{ marginBottom: 24 }}>Quản lý tài khoản</Title>

      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <Upload
            name="avatar"
            listType="picture-circle"
            className="avatar-uploader"
            showUploadList={false}
            beforeUpload={(file) => {
              const isValid = beforeUpload(file)
              if (isValid) {
                handleAvatarUpload(file as RcFile)
              }
              return false
            }}
            accept="image/*"
          >
            {imageUrl ? (
              <img src={imageUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
            ) : (
              uploadButton
            )}
          </Upload>
          <div>
            <Title level={4} style={{ margin: 0 }}>{userData?.name || 'Chưa có tên'}</Title>
            <Text type="secondary">{userData?.email}</Text>
          </div>
        </div>

        <Divider />

        <Tabs activeKey={activeTab} onChange={setActiveTab}>
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

          <TabPane tab={<span><TrophyOutlined /> Chứng chỉ</span>} key="certificates">
            <div style={{ marginTop: 24 }}>
              {loadingCertificates ? (
                <Spin size="large" style={{ display: 'block', textAlign: 'center', padding: 40 }} />
              ) : certificates.length === 0 ? (
                <Empty
                  description="Bạn chưa có chứng chỉ nào"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
                  {certificates.map((cert) => {
                    const isHighlighted = courseIdFromState && cert.courseId === courseIdFromState
                    return (
                    <Card
                      key={cert.id}
                      hoverable
                      style={{
                        border: isHighlighted ? '3px solid #1890ff' : undefined,
                        boxShadow: isHighlighted ? '0 4px 12px rgba(24, 144, 255, 0.3)' : undefined,
                        transition: 'all 0.3s ease'
                      }}
                      cover={
                        cert.imageUrl ? (
                          <Image
                            src={cert.imageUrl}
                            alt={cert.course?.title || 'Certificate'}
                            style={{ height: 200, objectFit: 'cover' }}
                            preview={false}
                          />
                        ) : (
                          <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                            <TrophyOutlined style={{ fontSize: 64, color: '#fff' }} />
                          </div>
                        )
                      }
                      actions={[
                        <Dropdown
                          key="download"
                          menu={{ items: getDownloadMenuItems(cert) }}
                          trigger={['click']}
                        >
                          <Button
                            type="primary"
                            icon={<DownloadOutlined />}
                            loading={downloadingCertId === cert.id}
                            block
                          >
                            Tải về
                          </Button>
                        </Dropdown>
                      ]}
                    >
                      <Card.Meta
                        title={cert.course?.title || 'Chứng chỉ khóa học'}
                        description={
                          <div>
                            <Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>
                              Giảng viên: {cert.course?.teacher || 'N/A'}
                            </Text>
                            <Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>
                              Số chứng chỉ: {cert.certificateNumber}
                            </Text>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              Ngày cấp: {new Date(cert.issuedAt).toLocaleDateString('vi-VN')}
                            </Text>
                          </div>
                        }
                      />
                    </Card>
                    )
                  })}
                </div>
              )}
            </div>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  )
}

