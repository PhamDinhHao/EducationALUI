import { useState, useRef, useEffect, useMemo } from 'react'
import { Upload, Button, Input, Select, message, Card, Form } from 'antd'
import { PlusOutlined, SaveOutlined } from '@ant-design/icons'
import type { UploadProps, UploadFile } from 'antd'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useNavigate, useParams } from 'react-router-dom'
import { getBlogDetail, getBlogTags, updateBlog } from '@/modules/blog/services/blogService.service'

const BlogUpdate = () => {
  const { id } = useParams()
  const [form] = Form.useForm()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [tags, setTags] = useState<any[]>([])
  const [selectedTags, setSelectedTags] = useState<number[]>([])
  const quillRef = useRef<any>(null)
  const navigate = useNavigate()

  // --- Fetch Tags ---
  const fetchTags = async () => {
    try {
      const response = await getBlogTags()
      setTags(response.data || [])
    } catch (error) {
      console.error('Error fetching tags:', error)
    }
  }

  // --- Fetch Blog ---
  const fetchBlog = async () => {
    try {
      const response = await getBlogDetail(id as string)
      const blog = response.data

      // Đổ dữ liệu vào form
      form.setFieldsValue({
        title: blog.title,
        tags: blog.tags?.map((t: any) => t.id) || []
      })
      setSelectedTags(blog.tags?.map((t: any) => t.id) || [])
      setContent(blog.content || '')

      if (blog.image) {
        setFileList([
          {
            uid: '-1',
            name: 'cover.jpg',
            status: 'done',
            url: blog.image
          }
        ])
      }
    } catch (error) {
      console.error('Error fetching blog:', error)
      message.error('Không tải được dữ liệu bài viết!')
    }
  }

  // --- useEffect load data ---
  useEffect(() => {
    fetchTags()
    if (id) fetchBlog()
  }, [id])

  // --- Quill modules ---
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ font: [] }],
          [{ size: ['small', false, 'large', 'huge'] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ color: [] }, { background: [] }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ align: [] }],
          ['link', 'image', 'video'],
          ['clean']
        ]
      }
    }),
    []
  )

  const formats = [
    'header', 'font', 'size', 'bold', 'italic', 'underline', 'strike',
    'color', 'background', 'list', 'bullet', 'align', 'link', 'image', 'video'
  ]

  // --- Upload Props ---
  const uploadProps: UploadProps = {
    onRemove: () => {
      setFileList([])
    },
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/')
      if (!isImage) {
        message.error('Chỉ được upload file ảnh!')
        return false
      }
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isLt5M) {
        message.error('Ảnh phải nhỏ hơn 5MB!')
        return false
      }

      const preview = URL.createObjectURL(file)
      const uploadFile: UploadFile = {
        uid: file.uid,
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

  // --- Handle Submit ---
  const handleSubmit = async (values: any) => {
    if (!content.trim()) {
      message.error('Vui lòng nhập nội dung bài viết!')
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('title', values.title)
      formData.append('content', content)
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append('image', fileList[0].originFileObj as any)
      }
      if (selectedTags.length > 0) {
        formData.append('tags', selectedTags.join(','))
      }

      const response = await updateBlog(id as string, formData)

      if (response.status === 200) {
        message.success('Cập nhật bài viết thành công!')
        setTimeout(() => navigate('/blog'), 1200)
      } else {
        throw new Error('Update failed')
      }
    } catch (error) {
      console.error('Error updating blog:', error)
      message.error('Có lỗi xảy ra khi cập nhật!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-10 mb-16'>
      <div className='mx-auto max-w-5xl'>
        <div className='animate-fadeInUp mb-10 text-center'>
          <h1 className='gradient-text mb-4 text-5xl font-extrabold'>Cập nhật bài viết</h1>
          <p className='text-lg text-gray-600'>Chỉnh sửa nội dung bài viết của bạn</p>
        </div>

        <Card className='animate-fadeInUp shadow-2xl' style={{ borderRadius: '24px' }}>
          <Form form={form} layout='vertical' onFinish={handleSubmit}>
            {/* Title */}
            <Form.Item
              label={<span className='text-lg font-semibold text-gray-700'>Tiêu đề</span>}
              name='title'
              rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
            >
              <Input size='large' placeholder='Nhập tiêu đề...' className='rounded-xl' />
            </Form.Item>

            {/* Tags */}
            <Form.Item
              label={<span className='text-lg font-semibold text-gray-700'>Tags</span>}
              name='tags'
            >
              <Select
                mode='multiple'
                size='large'
                placeholder='Chọn tags...'
                value={selectedTags}
                onChange={setSelectedTags}
                options={tags.map((tag) => ({ label: tag.name, value: tag.id }))}
                className='rounded-xl'
              />
            </Form.Item>

            {/* Cover Image */}
            <Form.Item
              label={<span className='text-lg font-semibold text-gray-700'>Ảnh cover</span>}
            >
              <Upload {...uploadProps}>
                {fileList.length === 0 && (
                  <div className='flex flex-col items-center justify-center p-4'>
                    <PlusOutlined className='mb-2 text-3xl text-gray-400' />
                    <div className='text-gray-500'>Upload ảnh</div>
                  </div>
                )}
              </Upload>
            </Form.Item>

            {/* Content */}
            <Form.Item
              label={<span className='text-lg font-semibold text-gray-700'>Nội dung</span>}
            >
              <div className='quill-editor'>
                <ReactQuill
                  ref={quillRef}
                  theme='snow'
                  value={content}
                  onChange={setContent}
                  modules={modules}
                  formats={formats}
                  placeholder='Bắt đầu chỉnh sửa nội dung...'
                />
              </div>
            </Form.Item>

            {/* Submit */}
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
                  Lưu thay đổi
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
  )
}

export default BlogUpdate
