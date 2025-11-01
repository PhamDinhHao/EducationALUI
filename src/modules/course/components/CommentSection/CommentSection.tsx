import React, { useEffect, useState } from 'react'
import { Avatar, Button, Empty, Form, Input, List, message, Spin, Typography } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { useBoundStore } from '@/shared/stores'
import env from '@/shared/core/constants/env'
import { Comment as AntdComment } from '@ant-design/compatible'
const { TextArea } = Input
const { Title } = Typography

export interface Comment {
  id: number
  content: string
  author: string
  lessonId: number
  userId?: number | null
  parentId?: number | null
  createdAt: string
  updatedAt: string
  replies?: Comment[]
}

interface CommentSectionProps {
  lessonId: number
}

const CommentSection: React.FC<CommentSectionProps> = ({ lessonId }) => {
  const user = useBoundStore((state) => state.user)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [form] = Form.useForm()
  const [replyForms, setReplyForms] = useState<Record<number, string>>({})

  useEffect(() => {
    fetchComments()
  }, [lessonId])

  const fetchComments = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${env.VITE_HOST_API}/comment/lessons/${lessonId}/comments`)
      if (res.ok) {
        const data = await res.json()
        setComments(data || [])
      } else {
        message.error('Không tải được bình luận')
      }
    } catch (error) {
      message.error('Lỗi khi tải bình luận')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (values: { content: string }) => {
    if (!values.content?.trim()) {
      message.warning('Vui lòng nhập nội dung bình luận')
      return
    }

    try {
      setSubmitting(true)
      const res = await fetch(`${env.VITE_HOST_API}/comment/lessons/${lessonId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: user?.name || 'Người ẩn danh',
          content: values.content,
          userId: user?.id || undefined,
          parentId: null
        })
      })

      if (res.ok) {
        const newComment = await res.json()
        setComments((prev) => [newComment, ...prev])
        form.resetFields()
        message.success('Đã thêm bình luận')
      } else {
        const data = await res.json()
        message.error(data?.message || 'Không thể gửi bình luận')
      }
    } catch (error) {
      message.error('Lỗi khi gửi bình luận')
    } finally {
      setSubmitting(false)
    }
  }

  const handleReply = async (parentId: number, content: string) => {
    if (!content?.trim()) {
      message.warning('Vui lòng nhập nội dung phản hồi')
      return
    }

    try {
      const res = await fetch(`${env.VITE_HOST_API}/comment/lessons/${lessonId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: user?.name || 'Người dùng',
          content: content,
          parentId: parentId
        })
      })

      if (res.ok) {
        const newReply = await res.json()
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === parentId
              ? { ...comment, replies: [...(comment.replies || []), newReply] }
              : comment
          )
        )
        setReplyForms((prev) => ({ ...prev, [parentId]: '' }))
        setReplyingTo(null)
        message.success('Đã thêm phản hồi')
      } else {
        const data = await res.json()
        message.error(data?.message || 'Không thể gửi phản hồi')
      }
    } catch (error) {
      message.error('Lỗi khi gửi phản hồi')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Vừa xong'
    if (minutes < 60) return `${minutes} phút trước`
    if (hours < 24) return `${hours} giờ trước`
    if (days < 7) return `${days} ngày trước`
    return date.toLocaleDateString('vi-VN')
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 24 }}>
        <Spin />
      </div>
    )
  }

  return (
    <div style={{ marginTop: 24 }}>
      <Title level={4} style={{ marginBottom: 16 }}>
        Bình luận ({comments.length})
      </Title>
      <Form form={form} onFinish={handleSubmit} style={{ marginBottom: 24 }}>
        <Form.Item name="content" rules={[{ required: true, message: 'Vui lòng nhập bình luận' }]}>
          <TextArea
            rows={4}
            placeholder={user ? 'Viết bình luận của bạn...' : 'Vui lòng đăng nhập để bình luận'}
            disabled={!user}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={submitting} disabled={!user}>
            Gửi bình luận
          </Button>
        </Form.Item>
      </Form>

      {comments.length === 0 ? (
        <Empty description="Chưa có bình luận nào" />
      ) : (
        <List
          dataSource={comments}
          renderItem={(comment) => (
            <AntdComment
              key={comment.id}
              author={<span>{comment.author}</span>}
              avatar={<Avatar icon={<UserOutlined />} />}
              content={<p style={{ whiteSpace: 'pre-wrap' }}>{comment.content}</p>}
              datetime={<span>{formatDate(comment.createdAt)}</span>}
              actions={[
                <span
                  key="reply"
                  onClick={() => {
                    setReplyingTo(replyingTo === comment.id ? null : comment.id)
                    if (!replyForms[comment.id]) {
                      setReplyForms((prev) => ({ ...prev, [comment.id]: '' }))
                    }
                  }}
                  style={{ cursor: 'pointer', color: '#1890ff' }}
                >
                  {replyingTo === comment.id ? 'Hủy' : 'Phản hồi'}
                </span>
              ]}
            >
              {replyingTo === comment.id && (
                <div style={{ marginTop: 12, paddingLeft: 44 }}>
                  <TextArea
                    rows={2}
                    placeholder="Viết phản hồi..."
                    value={replyForms[comment.id] || ''}
                    onChange={(e) => {
                      setReplyForms((prev) => ({ ...prev, [comment.id]: e.target.value }))
                    }}
                    style={{ marginBottom: 8 }}
                  />
                  <Button
                    size="small"
                    type="primary"
                    onClick={() => {
                      const content = replyForms[comment.id]?.trim()
                      if (content) {
                        handleReply(comment.id, content)
                      }
                    }}
                  >
                    Gửi phản hồi
                  </Button>
                </div>
              )}

              {comment.replies && comment.replies.length > 0 && (
                <List
                  dataSource={comment.replies}
                  renderItem={(reply) => (
                    <AntdComment
                      key={reply.id}
                      author={<span>{reply.author}</span>}
                      avatar={<Avatar icon={<UserOutlined />} />}
                      content={<p style={{ whiteSpace: 'pre-wrap' }}>{reply.content}</p>}
                      datetime={<span>{formatDate(reply.createdAt)}</span>}
                    />
                  )}
                  style={{ marginTop: 8, paddingLeft: 44 }}
                />
              )}
            </AntdComment>
          )}
        />
      )}
    </div>
  )
}

export default CommentSection

