import { useState, useRef, useMemo } from 'react'
import { Upload, Button, Input, Select, message, Card, Form, Modal } from 'antd'
import { PlusOutlined, SaveOutlined, TagsOutlined } from '@ant-design/icons'
import type { UploadProps, UploadFile } from 'antd'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { createBlog, createBlogTag, getBlogTags } from '@/modules/blog/services/blogService.service'

const AddBlog = () => {
  const [form] = Form.useForm()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [tags, setTags] = useState<any[]>([])
  const [selectedTags, setSelectedTags] = useState<{ label: string; value: number }[]>([])
  const quillRef = useRef<any>(null)
  const navigate = useNavigate()
  const { state } = useLocation()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newTagName, setNewTagName] = useState('')
  // Fetch tags khi component mount
  console.log(state)
  const [addingTag, setAddingTag] = useState(false)
  const fetchTags = async () => {
    try {
      const response = await getBlogTags()
      const data = response.data || []
      setTags(data || [])
    } catch (error) {
      console.error('Error fetching tags:', error)
    }
  }
  useState(() => {
    fetchTags()
  })
  // Cấu hình Quill modules
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ font: [] }],
          [{ size: ['small', false, 'large', 'huge'] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ color: [] }, { background: [] }],
          [{ script: 'sub' }, { script: 'super' }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ indent: '-1' }, { indent: '+1' }],
          [{ direction: 'rtl' }],
          [{ align: [] }],
          ['blockquote', 'code-block'],
          ['link', 'image', 'video'],
          ['clean']
        ]
      },
      clipboard: {
        matchVisual: false
      }
    }),
    []
  )

  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'color',
    'background',
    'script',
    'list',
    'bullet',
    'indent',
    'direction',
    'align',
    'blockquote',
    'code-block',
    'link',
    'image',
    'video'
  ]

  // Xử lý upload ảnh cover
  const uploadProps: UploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file)
      const newFileList = fileList.slice()
      newFileList.splice(index, 1)
      setFileList(newFileList)
    },
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/')
      if (!isImage) {
        message.error('Bạn chỉ có thể upload file ảnh!')
        return false
      }
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isLt5M) {
        message.error('Ảnh phải nhỏ hơn 5MB!')
        return false
      }

      const preview = URL.createObjectURL(file)
      const uploadFile: UploadFile = {
        uid: file.uid || String(Date.now()),
        name: file.name,
        status: 'done',
        url: preview,
        originFileObj: file
      }

      setFileList([uploadFile])
      return false
    },
    fileList,
    listType: 'picture-card',
    maxCount: 1
  }
  const handleAddTag = async () => {
    if (!newTagName.trim()) {
      message.error('Vui lòng nhập tên tag!')
      return
    }

    // Kiểm tra tag đã tồn tại
    const existingTag = tags.find((tag) => tag.name.toLowerCase() === newTagName.trim().toLowerCase())
    if (existingTag) {
      message.warning('Tag này đã tồn tại!')
      return
    }

    setAddingTag(true)
    try {
      // TODO: Gọi API tạo tag mới
      const response = await createBlogTag({ name: newTagName.trim() })
      console.log(response)
      // Mock: Giả lập thêm tag mới

      setTags([...tags, { label: response.data.name, value: response.data.id }])
      message.success('Thêm tag thành công!')
      setNewTagName('')
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error creating tag:', error)
      message.error('Có lỗi xảy ra khi thêm tag!')
    } finally {
      setAddingTag(false)
    }
  }

  // Xử lý submit form
  const handleSubmit = async (values: any) => {
    if (!content.trim()) {
      message.error('Vui lòng nhập nội dung bài viết!')
      return
    }

    if (fileList.length === 0) {
      message.error('Vui lòng upload ảnh cover!')
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('title', values.title)
      formData.append('content', content)
      formData.append('image', fileList[0].originFileObj as any)
      if (selectedTags.length > 0) {
        formData.append('tags', selectedTags.join(','))
      }
      formData.append('type', state?.type === 'contests' ? 'CONTESTS' : 'BLOG')
      const response = await createBlog(formData)

      if (response.status !== 201) {
        throw new Error('Network response was not ok')
      }

      message.success('Tạo bài viết thành công!')
      form.resetFields()
      setContent('')
      setFileList([])
      setSelectedTags([])

      // Chuyển về trang blog sau 1.5s
      setTimeout(() => {
        navigate('/blog')
      }, 1500)
    } catch (error) {
      console.error('Error creating blog:', error)
      message.error('Có lỗi xảy ra khi tạo bài viết!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        .quill-editor {
          background: white;
          border-radius: 12px;
          overflow: hidden;
        }
        
        .quill-editor .ql-container {
          min-height: 400px;
          font-size: 16px;
          border-bottom-left-radius: 12px;
          border-bottom-right-radius: 12px;
        }
        
        .quill-editor .ql-toolbar {
          border-top-left-radius: 12px;
          border-top-right-radius: 12px;
          background: #f8f9fa;
        }
        
        .quill-editor .ql-editor {
          min-height: 400px;
        }
        
        .quill-editor .ql-editor.ql-blank::before {
          font-style: normal;
          color: #adb5bd;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      <div className='mb-16 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-10'>
        <div className='mx-auto max-w-5xl'>
          {/* Header */}
          <div className='animate-fadeInUp mb-10 text-center'>
            <h1 className='gradient-text mb-4 text-5xl font-extrabold'>Create New Blog Post</h1>
            <p className='text-lg text-gray-600'>Share your thoughts and stories with the world</p>
          </div>

          {/* Form */}
          <Card className='animate-fadeInUp shadow-2xl' style={{ animationDelay: '0.2s', borderRadius: '24px' }}>
            <Form form={form} layout='vertical' onFinish={handleSubmit}>
              {/* Title */}
              <Form.Item
                label={<span className='text-lg font-semibold text-gray-700'>Tiêu đề bài viết</span>}
                name='title'
                rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
              >
                <Input
                  size='large'
                  placeholder='Nhập tiêu đề hấp dẫn...'
                  className='rounded-xl'
                  style={{ fontSize: '16px' }}
                />
              </Form.Item>

              {/* Tags */}
              <Form.Item label={<span className='text-lg font-semibold text-gray-700'>Tags</span>} name='tags'>
                <Select
                  mode='multiple'
                  size='large'
                  placeholder='Chọn tags...'
                  className='rounded-xl'
                  value={selectedTags}
                  onChange={(selected) => {
                    const labels = tags.filter((tag) => selected.includes(tag.id)).map((item: any) => item.name)
                    console.log(labels)
                    setSelectedTags(labels)
                  }}
                  options={tags.map((tag) => ({
                    label: tag.name,
                    value: tag.id
                  }))}
                />
              </Form.Item>
              <Button
                type='dashed'
                icon={<TagsOutlined />}
                onClick={() => setIsModalOpen(true)}
                className='add-tag-btn'
                size='large'
                style={{
                  width: '100%',
                  height: '48px',
                  borderRadius: '12px',
                  fontWeight: '500'
                }}
              >
                Tạo tag mới
              </Button>

              {/* Cover Image */}
              <Form.Item label={<span className='text-lg font-semibold text-gray-700'>Ảnh cover</span>} required>
                <Upload {...uploadProps}>
                  {fileList.length === 0 && (
                    <div className='flex flex-col items-center justify-center p-4'>
                      <PlusOutlined className='mb-2 text-3xl text-gray-400' />
                      <div className='text-gray-500'>Upload ảnh</div>
                    </div>
                  )}
                </Upload>
                <p className='mt-2 text-sm text-gray-500'>Kích thước đề xuất: 1200x630px, tối đa 5MB</p>
              </Form.Item>

              {/* Content Editor */}
              <Form.Item label={<span className='text-lg font-semibold text-gray-700'>Nội dung</span>} required>
                <div className='quill-editor'>
                  <ReactQuill
                    ref={quillRef}
                    theme='snow'
                    value={content}
                    onChange={setContent}
                    modules={modules}
                    formats={formats}
                    placeholder='Bắt đầu viết nội dung của bạn...'
                  />
                </div>
              </Form.Item>

              {/* Submit Buttons */}
              <Form.Item className='mb-0 mt-8'>
                <div className='flex gap-4'>
                  <Button
                    type='primary'
                    size='large'
                    htmlType='submit'
                    loading={loading}
                    icon={<SaveOutlined />}
                    className='h-12 flex-1 text-base font-semibold'
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      borderRadius: '12px'
                    }}
                  >
                    Đăng bài viết
                  </Button>
                  <Button
                    size='large'
                    onClick={() => navigate('/blog')}
                    className='h-12 text-base font-semibold'
                    style={{ borderRadius: '12px' }}
                  >
                    Hủy
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TagsOutlined />
            <span>Tạo Tag Mới</span>
          </div>
        }
        open={isModalOpen}
        onOk={handleAddTag}
        onCancel={() => {
          setIsModalOpen(false)
          setNewTagName('')
        }}
        confirmLoading={addingTag}
        okText='Tạo Tag'
        cancelText='Hủy'
        okButtonProps={{
          style: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '8px',
            height: '40px',
            fontWeight: '500'
          }
        }}
        cancelButtonProps={{
          style: {
            borderRadius: '8px',
            height: '40px'
          }
        }}
      >
        <div style={{ padding: '20px 0' }}>
          <Input
            size='large'
            placeholder='Nhập tên tag...'
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            onPressEnter={handleAddTag}
            prefix={<TagsOutlined style={{ color: '#667eea' }} />}
            style={{
              borderRadius: '12px',
              fontSize: '16px'
            }}
          />
          <p style={{ marginTop: '12px', fontSize: '14px', color: '#666' }}>
            Tag sẽ được thêm vào danh sách và có thể sử dụng ngay
          </p>
        </div>
      </Modal>
    </>
  )
}

export default AddBlog
