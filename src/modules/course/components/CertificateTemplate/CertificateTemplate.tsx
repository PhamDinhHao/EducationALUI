import React from 'react'
import { Certificate } from '@/modules/course/services/certificate.service'
import { useBoundStore } from '@/shared/stores'

interface CertificateTemplateProps {
  certificate: Certificate
  user?: {
    name?: string | null
    email?: string
  }
}

export const CertificateTemplate: React.FC<CertificateTemplateProps> = ({ certificate, user }) => {
  const currentUser = useBoundStore((state) => state.user)
  const userName = user?.name || currentUser?.name || currentUser?.email || 'Người học'
  const courseTitle = certificate.course?.title || 'Khóa học'
  const teacher = certificate.course?.teacher || 'Giảng viên'
  const issuedDate = new Date(certificate.issuedAt).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div
      id="certificate-template"
      style={{
        width: '1200px',
        height: '800px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '60px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        fontFamily: '"Times New Roman", serif',
        color: '#fff'
      }}
    >
      {/* Decorative border */}
      <div
        style={{
          position: 'absolute',
          top: '40px',
          left: '40px',
          right: '40px',
          bottom: '40px',
          border: '8px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '20px',
          pointerEvents: 'none'
        }}
      />

      {/* Inner border */}
      <div
        style={{
          position: 'absolute',
          top: '60px',
          left: '60px',
          right: '60px',
          bottom: '60px',
          border: '4px solid rgba(255, 255, 255, 0.5)',
          borderRadius: '15px',
          pointerEvents: 'none'
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          width: '100%'
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <h1
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              margin: 0,
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
              letterSpacing: '2px'
            }}
          >
            CHỨNG CHỈ
          </h1>
          <div
            style={{
              fontSize: '24px',
              marginTop: '10px',
              opacity: 0.9,
              fontWeight: 'normal'
            }}
          >
            Certificate of Completion
          </div>
        </div>

        {/* Main content */}
        <div style={{ marginBottom: '50px', padding: '0 80px' }}>
          <p
            style={{
              fontSize: '28px',
              lineHeight: '1.8',
              margin: '20px 0',
              fontWeight: 'normal'
            }}
          >
            Hệ thống xác nhận rằng
          </p>
          <div
            style={{
              fontSize: '42px',
              fontWeight: 'bold',
              margin: '30px 0',
              textDecoration: 'underline',
              textDecorationThickness: '3px',
              textUnderlineOffset: '10px',
              minHeight: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {userName}
          </div>
          <p
            style={{
              fontSize: '28px',
              lineHeight: '1.8',
              margin: '20px 0',
              fontWeight: 'normal'
            }}
          >
            đã hoàn thành thành công khóa học
          </p>
          <div
            style={{
              fontSize: '36px',
              fontWeight: 'bold',
              margin: '30px 0',
              color: '#FFD700',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
              minHeight: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {courseTitle}
          </div>
          <p
            style={{
              fontSize: '24px',
              lineHeight: '1.8',
              margin: '20px 0',
              fontWeight: 'normal',
              opacity: 0.9
            }}
          >
            Giảng viên: {teacher}
          </p>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            width: '100%',
            marginTop: '60px',
            padding: '0 80px'
          }}
        >
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div
              style={{
                borderTop: '3px solid rgba(255, 255, 255, 0.7)',
                width: '200px',
                margin: '0 auto 10px',
                paddingTop: '10px'
              }}
            />
            <div style={{ fontSize: '18px', opacity: 0.9 }}>Ngày cấp</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '5px' }}>
              {issuedDate}
            </div>
          </div>

          <div style={{ textAlign: 'center', flex: 1 }}>
            <div
              style={{
                borderTop: '3px solid rgba(255, 255, 255, 0.7)',
                width: '200px',
                margin: '0 auto 10px',
                paddingTop: '10px'
              }}
            />
            <div style={{ fontSize: '18px', opacity: 0.9 }}>Số chứng chỉ</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '5px', wordBreak: 'break-word' }}>
              {certificate.certificateNumber}
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div
          style={{
            position: 'absolute',
            top: '100px',
            left: '100px',
            fontSize: '120px',
            opacity: 0.1,
            transform: 'rotate(-15deg)',
            pointerEvents: 'none'
          }}
        >
          ✨
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '100px',
            right: '100px',
            fontSize: '120px',
            opacity: 0.1,
            transform: 'rotate(15deg)',
            pointerEvents: 'none'
          }}
        >
          🏆
        </div>
      </div>
    </div>
  )
}

