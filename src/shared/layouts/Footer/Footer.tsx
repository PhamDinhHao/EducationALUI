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
            <img src='https://i.imgur.com/8Km9tLL.png' alt='EduPress' style={{ height: 32 }} />
            <Title level={4} style={{ margin: 0, color: '#222', fontWeight: 700 }}>
              EduPress
            </Title>
          </Space>
          <Text style={{ color: '#555', fontSize: 14 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua.
          </Text>
        </Space>
      </Col>
      <Col xs={24} md={6}>
        <Title level={5} style={{ marginBottom: 16, color: '#222', fontWeight: 700 }}>
          GET HELP
        </Title>
        <Space direction='vertical' size={8}>
          <Link>Contact Us</Link>
          <Link>Latest Articles</Link>
          <Link>FAQ</Link>
        </Space>
      </Col>
      <Col xs={24} md={6}>
        <Title level={5} style={{ marginBottom: 16, color: '#222', fontWeight: 700 }}>
          PROGRAMS
        </Title>
        <Space direction='vertical' size={8}>
          <Link>Art &amp; Design</Link>
          <Link style={{ color: '#ff6600', fontWeight: 500 }}>Business</Link>
          <Link>IT &amp; Software</Link>
          <Link>Languages</Link>
          <Link>Programming</Link>
        </Space>
      </Col>
      <Col xs={24} md={6}>
        <Title level={5} style={{ marginBottom: 16, color: '#222', fontWeight: 700 }}>
          CONTACT US
        </Title>
        <Space direction='vertical' size={8}>
          <Text>
            <EnvironmentOutlined /> Address: 2321 New Design Str, Lorem Ipsum10 Hudson Yards, USA
          </Text>
          <Text>
            <PhoneOutlined /> Tel: + (123) 2500-567-8988
          </Text>
          <Text>
            <MailOutlined /> Mail: supportlms@gmail.com
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
      Copyright © 2024 LearnPress LMS | Powered by ThimPress
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
