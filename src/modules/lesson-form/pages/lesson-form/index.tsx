import React, { useMemo, useState } from 'react'
import { Button, Form, Input, Select, Typography, Spin, message } from 'antd'
import { BookOutlined } from '@ant-design/icons'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'
import { LessonResponse } from '../../../../shared/core/types'
import Sidebar from '@/shared/components/Sidebar'
import env from '@/shared/core/constants/env'

const { Title, Text } = Typography
const API_URL = `${env.VITE_HOST_API}/lessons/generate`

const subjectTopics: Record<string, Record<string, string[]>> = {
  ly: {
    '10': [
      'Làm quen với Vật lí',
      'Các quy tắc an toàn trong phòng thực hành Vật lí',
      'Thực hành tính sai số trong phép đo. Ghi kết quả đo',
      'Độ dịch chuyển và quãng đường đi được',
      'Tốc độ và vận tốc',
      'Thực hành: Đo tốc độ của vật chuyển động',
      'Đồ thị độ dịch chuyển – thời gian',
      'Chuyển động biến đổi. Gia tốc',
      'Chuyển động thẳng biến đổi đều',
      'Sự rơi tự do',
      'Thực hành: Đo gia tốc rơi tự do',
      'Chuyển động ném',
      'Tổng hợp và phân tích lực. Cân bằng lực',
      'Định luật 1 Newton',
      'Định luật 2 Newton',
      'Định luật 3 Newton',
      'Trọng lực và lực căng',
      'Lực ma sát',
      'Lực cản và lực nâng',
      'Một số ví dụ về cách giải các bài toán thuộc phần động lực học',
      'Moment lực. Cân bằng của vật rắn',
      'Thực hành: Tổng hợp lực',
      'Năng lượng. Công cơ học',
      'Công suất',
      'Động năng, thế năng',
      'Cơ năng và định luật bảo toàn cơ năng',
      'Hiệu suất',
      'Động lượng',
      'Định luật bảo toàn động lượng',
      'Thực hành: Xác định động lượng của vật trước và sau va chạm',
      'Động học của chuyển động tròn đều',
      'Lực hướng tâm và gia tốc hướng tâm',
      'Biến dạng của vật rắn',
      'Khối lượng riêng. Áp suất chất lỏng'
    ],
    '11': [
      'Dao động điều hoà',
      'Mô tả dao động điều hoà',
      'Vận tốc, gia tốc trong dao động điều hoà',
      'Bài tập về dao động điều hoà',
      'Động năng - Thế năng trong dao động điều hoà',
      'Dao động tắt dần. Dao động cưỡng bức. Cộng hưởng',
      'Bài tập về sự chuyển hoá năng lượng',
      'Mô tả sóng',
      'Sóng ngang, sóng dọc, truyền năng lượng',
      'Thực hành: Đo tần số sóng âm',
      'Sóng điện từ',
      'Giao thoa sóng',
      'Sóng dừng',
      'Bài tập về sóng',
      'Thực hành: Đo tốc độ truyền âm',
      'Lực tương tác giữa hai điện tích',
      'Khái niệm điện trường',
      'Điện trường đều',
      'Điện thế',
      'Tụ điện',
      'Cường độ dòng điện',
      'Điện trở – Định luật Ohm',
      'Nguồn điện',
      'Năng lượng và công suất điện',
      'Thực hành: Đo suất điện động và điện trở trong pin'
    ],
    '12': [
      'Cấu trúc của chất. Sự chuyển thể',
      'Nội năng. Định luật I nhiệt động lực học',
      'Nhiệt độ – thang nhiệt độ',
      'Nhiệt dung riêng',
      'Nhiệt nóng chảy riêng',
      'Nhiệt hoá hơi riêng',
      'Bài tập về vật lí nhiệt',
      'Mô hình động học phân tử khí',
      'Định luật Boyle',
      'Định luật Charles',
      'Phương trình khí lí tưởng',
      'Áp suất khí – mô hình phân tử',
      'Bài tập khí lí tưởng',
      'Từ trường',
      'Lực từ – cảm ứng từ',
      'Từ thông – cảm ứng điện từ',
      'Máy phát điện xoay chiều',
      'Ứng dụng cảm ứng điện từ',
      'Điện từ trường – sóng điện từ',
      'Bài tập về từ trường',
      'Cấu trúc hạt nhân',
      'Phản ứng hạt nhân – năng lượng liên kết',
      'Hiện tượng phóng xạ',
      'Công nghiệp hạt nhân',
      'Bài tập vật lí hạt nhân'
    ]
  },

  lichsu: {
    '10': [
      'Hiện thực lịch sử và nhận thức lịch sử',
      'Tri thức lịch sử và cuộc sống',
      'Sử học với các lĩnh vực khoa học',
      'Sử học với các ngành nghề hiện đại',
      'Khái niệm văn minh – văn minh phương Đông cổ – trung đại',
      'Văn minh phương Tây cổ – trung đại',
      'Các cuộc cách mạng công nghiệp cận đại',
      'Các cuộc cách mạng công nghiệp hiện đại',
      'Cơ sở hình thành văn minh Đông Nam Á cổ – trung đại',
      'Phát triển và thành tựu văn minh Đông Nam Á',
      'Một số nền văn minh cổ Việt Nam',
      'Văn minh Đại Việt',
      'Đời sống vật chất – tinh thần cộng đồng dân tộc',
      'Khối đại đoàn kết dân tộc'
    ],
    '11': [
      'Một số vấn đề chung về cách mạng tư sản',
      'Sự xác lập và phát triển của chủ nghĩa tư bản',
      'Liên bang Xô viết ra đời',
      'Sự phát triển chủ nghĩa xã hội sau Thế chiến II',
      'Xâm lược và cai trị của thực dân ở Đông Nam Á',
      'Hành trình giành độc lập Đông Nam Á',
      'Chiến tranh bảo vệ Tổ quốc trong lịch sử VN',
      'Khởi nghĩa và chiến tranh giải phóng (thế kỷ III TCN – XIX)',
      'Cải cách của Hồ Quý Ly và triều Hồ',
      'Cải cách của Lê Thánh Tông',
      'Cải cách của Minh Mạng',
      'Vị trí – tầm quan trọng của Biển Đông',
      'Việt Nam và Biển Đông'
    ],
    '12': [
      'Liên hợp quốc',
      'Trật tự thế giới trong Chiến tranh Lạnh',
      'Trật tự thế giới sau Chiến tranh Lạnh',
      'Sự ra đời và phát triển ASEAN',
      'Cộng đồng ASEAN',
      'Cách mạng Tháng Tám 1945',
      'Kháng chiến chống Pháp (1945–1954)',
      'Kháng chiến chống Mỹ (1954–1975)',
      'Bảo vệ Tổ quốc sau 1975 – bài học lịch sử',
      'Khái quát công cuộc Đổi mới từ 1986',
      'Thành tựu và bài học Đổi mới'
    ]
  }
}

const subjectLabel: Record<string, string> = {
  ly: 'Vật lý',
  lichsu: 'Lịch sử'
}

function normalizeLessonPayload(data: any): LessonResponse {
  if (data?.raw && typeof data.raw === 'string') {
    try {
      const cleaned = data.raw.replace(/```json|```/g, '').trim()
      return JSON.parse(cleaned)
    } catch {
      return data
    }
  }
  return data
}

const LessonForm: React.FC = () => {
  const [form] = Form.useForm()
  const [subject, setSubject] = useState('ly')

  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()

  // Nhận lessonType, promptText, file từ LessonBuilder
  const lessonType = location.state?.lessonType || 'Giáo án chuẩn (bám sát Bộ GD&ĐT)'
  const grade = Form.useWatch('grade', form)

  const topicOptions = useMemo(() => {
    if (!grade) return []
    return subjectTopics[subject][grade].map((t) => ({
      label: t,
      value: t
    }))
  }, [subject, grade])

  const onFinish = async (values: any) => {
    try {
      setLoading(true)

      const payload = {
        grade: values.grade,
        subject: values.subject,
        topic: values.topic,
        periods: Number(values.periods),
        lessonType
      }

      const res = await axios.post(API_URL, payload) // gửi JSON

      const data = res.data?.data ?? res.data
      const normalized: LessonResponse = normalizeLessonPayload(data)

      navigate('/ai/lesson-result', {
        state: { lesson: normalized, subjectLabel, lessonType }
      })
      message.success('Tạo giáo án thành công!')
    } catch (err: any) {
      console.error(err)
      message.error(err?.response?.data?.message || 'Lỗi khi tạo giáo án, vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex min-h-screen bg-gray-50'>
      <Sidebar />
      <div
        style={{
          width: '100%',
          minHeight: '100vh',
          background: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '3rem'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <BookOutlined style={{ fontSize: 36, color: '#E8612A' }} />
          <Title level={2} style={{ color: '#E8612A', marginTop: 8, marginBottom: 8 }}>
            Xây dựng {lessonType}
          </Title>
          <Text>GEN AI giúp bạn xây dựng giáo án theo chuẩn cấu trúc 5512</Text>
        </div>

        <div
          style={{
            border: '1px solid #E8612A',
            borderRadius: '20px',
            padding: '2rem',
            maxWidth: '1000px',
            width: '100%'
          }}
        >
          <Form
            layout='vertical'
            form={form}
            onFinish={onFinish}
            initialValues={{
              grade: '12',
              subject: 'ly',
              topic: subjectTopics['ly']['12'][0],
              periods: '1'
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '20px'
              }}
            >
              <Form.Item label={<strong>Chọn lớp</strong>} name='grade' rules={[{ required: true }]}>
                <Select
                  onChange={(value) => {
                    const firstTopic = subjectTopics[subject][value][0]
                    form.setFieldsValue({ topic: firstTopic })
                  }}
                >
                  <Select.Option value='10'>Lớp 10</Select.Option>
                  <Select.Option value='11'>Lớp 11</Select.Option>
                  <Select.Option value='12'>Lớp 12</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item label={<strong>Chọn môn</strong>} name='subject' rules={[{ required: true }]}>
                <Select
                  value={subject}
                  onChange={(value) => {
                    setSubject(value)
                    const currentGrade = form.getFieldValue('grade')
                    const firstTopic = subjectTopics[value][currentGrade][0]
                    form.setFieldsValue({ topic: firstTopic })
                  }}
                >
                  <Select.Option value='ly'>Vật lý</Select.Option>
                  <Select.Option value='lichsu'>Lịch sử</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item label={<strong>Bài học</strong>} name='topic' rules={[{ required: true }]}>
                <Select options={topicOptions} />
              </Form.Item>

              <Form.Item label={<strong>Số tiết</strong>} name='periods' rules={[{ required: true }]}>
                <Input placeholder='1' type='number' min={1} />
              </Form.Item>
            </div>

            <div style={{ textAlign: 'right', marginTop: 20 }}>
              <Button
                htmlType='submit'
                type='primary'
                disabled={loading}
                style={{
                  backgroundColor: '#E8612A',
                  borderColor: '#E8612A',
                  borderRadius: '999px',
                  padding: '0 30px',
                  height: '40px'
                }}
              >
                {loading ? <Spin size='small' /> : 'BẮT ĐẦU TẠO'}
              </Button>
            </div>
          </Form>
        </div>

        <Text style={{ display: 'block', textAlign: 'center', marginTop: 24, color: 'gray' }}>
          Khi đặt câu hỏi, bạn đồng ý với <a href='#'>Điều khoản</a> và <a href='#'>Chính sách quyền riêng tư</a>.
        </Text>
      </div>
    </div>
  )
}

export default LessonForm
