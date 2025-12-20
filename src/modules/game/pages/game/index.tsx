import React from 'react'
import { Card, Button, Typography, Row, Col } from 'antd'
import Teacher from '@/assets/images/depot/teacher.png'

const { Title, Text } = Typography

const GAMES = [
    {
        title: 'Sử việt hào hùng',
        description: 'Cầu nối giữa lịch sử và giới trẻ.',
        image: Teacher,
        url: 'https://vskh.vercel.app/',
        promptUrl: 'https://docs.google.com/document/d/1LNMyxfGj_05H1xVh2P9Lv9K4X6l-B4Hp/edit?usp=sharing&ouid=115722935294650717316&rtpof=true&sd=true'
    },
    {
        title: 'Vòng quay may mắn',
        description: 'Trò chơi giáo dục tương tác, sử dụng quay vòng ngẫu nhiên để lựa chọn câu hỏi, nhiệm vụ.',
        image: Teacher,
        url: 'https://vq-eta.vercel.app/',
        promptUrl: 'https://docs.google.com/document/d/1GlM8x_C8inpS7qFXthmmIuZyiG7doC0W/edit?usp=sharing&ouid=115722935294650717316&rtpof=true&sd=true'
    },
    {
        title: 'Trồng cây',
        description: 'Mô phỏng quá trình trồng, giúp học sinh trải nghiệm thông qua học tập.',
        image: Teacher,
        url: 'https://brain-farming.vercel.app/',
        promptUrl: 'https://docs.google.com/document/d/1BYP-Ubgkienu6ukC74iZ16RPIp8waF0L/edit?usp=sharing&ouid=115722935294650717316&rtpof=true&sd=true'
    },
    {
        title: 'Bắt kiến thức',
        description: 'Thực hiện các thao tác để thu thập kiến thức, qua đó củng cố bài học.',
        image: Teacher,
        url: 'https://bat-kien-thuc.vercel.app/',
        promptUrl: 'https://docs.google.com/document/d/1yPb_JFjrUI9umWlBMHJCXOYHR79BgO_s/edit?usp=sharing&ouid=115722935294650717316&rtpof=true&sd=true'
    }
]

const GamePage: React.FC = () => {
    return (
        <div className='w-full p-8 min-h-screen bg-gray-50'>
            <Title level={2} className='mb-8 text-orange-500'>Trò chơi giáo dục</Title>

            <Row gutter={[24, 24]}>
                {GAMES.map((game, index) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={index}>
                        <Card
                            hoverable
                            cover={
                                <div className='relative h-48 w-full bg-orange-100 p-2'>
                                    <div className='flex h-full w-full items-center justify-center rounded-lg bg-white shadow-sm overflow-hidden'>
                                        <img alt={game.title} src={game.image} className='h-full w-full object-cover opacity-80' />
                                        <div className='absolute inset-0 flex items-center justify-center bg-black/10 transition-opacity hover:bg-black/0'>
                                            <div className='rounded bg-green-500/80 px-4 py-1 text-white text-xs font-bold'>
                                                Vui học lớp 1
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                            className='h-full overflow-hidden rounded-2xl border-none shadow-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-2'
                            bodyStyle={{ padding: '20px' }}
                        >
                            <Title level={4} className='mb-2'>{game.title}</Title>
                            <Text className='mb-6 block text-gray-500' style={{ height: '60px', overflow: 'hidden' }}>
                                {game.description}
                            </Text>
                            <div className='mt-4 flex gap-2'>
                                <Button
                                    className='flex-1 rounded-lg border-orange-200 text-orange-500 hover:border-blue-500 hover:text-blue-600'
                                    size='large'
                                    onClick={() => window.open(game.url, '_blank')}
                                >
                                    Chơi ngay
                                </Button>
                                <Button
                                    className='flex-1 rounded-lg border-blue-200 text-blue-500 hover:border-orange-500 hover:text-orange-600'
                                    size='large'
                                    onClick={() => window.open(game.promptUrl, '_blank')}
                                >
                                    Prompt mẫu
                                </Button>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    )
}

export default GamePage
