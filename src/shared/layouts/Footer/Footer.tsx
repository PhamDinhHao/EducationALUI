import { Row, Col, Typography, Space } from 'antd'
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  FacebookFilled,
  YoutubeFilled,
  InstagramFilled,
  ArrowUpOutlined
} from '@ant-design/icons'
import images from '@/assets/images/images'
import { PagePath } from '@/shared/core/enum/page.enum'

const { Title, Text, Link } = Typography

const Footer = () => {
  const scrollToTop = () => {
    // Tìm container scroll chính
    const rootLayoutContent = document.querySelector('.root-layout-content') as HTMLElement
    
    if (rootLayoutContent) {
      // Scroll container chính với smooth behavior
      rootLayoutContent.scrollTo({ top: 0, behavior: 'smooth' })
      // Cũng scroll window để đảm bảo
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      // Fallback: scroll window và document
      window.scrollTo({ top: 0, behavior: 'smooth' })
      if (document.documentElement) {
        document.documentElement.scrollTo({ top: 0, behavior: 'smooth' })
      }
      if (document.body) {
        document.body.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
    
    // Thêm fallback: scroll đến phần tử đầu tiên
    setTimeout(() => {
      const firstElement = document.querySelector('section, .container, [class*="banner"]')
      if (firstElement) {
        firstElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }

  return (
  <div
    style={{
      background: '#fafafa',
      borderTop: '2px solid #a259ff',
      padding: '48px 0 0 0'
    }}
  >
    <Row gutter={48} style={{ maxWidth: 1200, margin: '0 auto' }}>
      <Col xs={24} md={6}>
        <Space direction='vertical' size={16}>
          <Space align='center'>
            <img src={images.icLogo} alt='GenAI' style={{ height: 32 }} />
          </Space>
          <Text style={{ color: '#555', fontSize: 14, lineHeight: 1.5 }}>
          GenAI là nền tảng hỗ trợ giáo viên và học sinh ứng dụng trí tuệ nhân tạo vào dạy và học một cách hiệu quả, thực tiễn, an toàn. 
          <br />
          Chúng tôi hướng tới việc mang AI đến gần hơn với lớp học.
          </Text>
        </Space>
      </Col>
      <Col xs={24} md={6}>
        <Title level={5} style={{ marginBottom: 16, color: '#222', fontWeight: 700 }}>
          Chính sách
        </Title>
        <Space direction='vertical' size={8}>
          <Link>Điều khoản & chính sách</Link>
          <Link>Câu hỏi thường gặp</Link>
        </Space>
      </Col>
      <Col xs={24} md={6}>
        <Title level={5} style={{ marginBottom: 16, color: '#222', fontWeight: 700 }}>
         Danh mục
        </Title>
        <Space direction='vertical' size={8}>
          <Link href={PagePath.HOME} target='_blank'>Trang chủ</Link>
          <Link href={PagePath.COURSE_LIST} target='_blank'>Khóa học</Link>
          <Link href={PagePath.BLOG} target='_blank'>Bài viết</Link>
          <Link href={PagePath.SEARCH_AI} target='_blank'>Gen AI</Link>
        </Space>
      </Col>
      <Col xs={24} md={6}>
        <Title level={5} style={{ marginBottom: 16, color: '#222', fontWeight: 700 }}>
          Liên hệ
        </Title>
        <Space direction='vertical' size={8}>
          <Text>
            <EnvironmentOutlined /> Địa chỉ: Trường THPT Trần Phú, tỉnh Quảng Trị, Việt Nam
          </Text>
          <Text>
            <PhoneOutlined /> Tel: 0886795538
          </Text>
          <Text>
            <MailOutlined /> Mail: zaza13108386@gmail.com
          </Text>
          <Space size={16}>
            <FacebookFilled style={{ color: '#222', fontSize: 18 }} />
            <InstagramFilled style={{ color: '#222', fontSize: 18 }} />
            <YoutubeFilled style={{ color: '#222', fontSize: 18 }} />
          </Space>
        </Space>
      </Col>
    </Row>
    <div
      style={{
        borderTop: '1px solid #eee',
        margin: '40px 0 0 0',
        padding: '16px 0',
        textAlign: 'center',
        color: '#888',
        fontSize: 14,
        position: 'relative'
      }}
    >
       © 2026 GenAI
      <div
        style={{
          position: 'absolute',
          right: 20,
          top: '50%',
          transform: 'translateY(-50%)'
        }}
      >
        <div
          onClick={scrollToTop}
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: '#222',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            transform: 'translateY(-50%)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#ff8c00'
            e.currentTarget.style.transform = 'translateY(calc(-50% - 2px))'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#222'
            e.currentTarget.style.transform = 'translateY(-50%)'
          }}
        >
          <ArrowUpOutlined style={{ color: '#fff', fontSize: 24 }} />
        </div>
      </div>
    </div>
  </div>
  )
}

export default Footer
