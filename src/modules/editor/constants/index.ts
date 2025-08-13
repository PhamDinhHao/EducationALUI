import toast from 'react-hot-toast'

import type { UploadProps } from 'antd'
import image1 from '/image/pixta_98399746.png'
import image2 from '/image/pixta_79459727.png'
import { uniqueId } from 'lodash'
const fileAccept = ['.xls', '.xlsx', '.doc', '.docx', '.pdf', '.jpg', '.jpeg', '.png', '.gif'] as const
const maxFileSize = 2 // 2mb

const uploadProps: UploadProps = {
  name: 'file',
  accept: fileAccept.join(','),
  listType: 'text',
  maxCount: 1,
  showUploadList: {
    showDownloadIcon: true,
    showRemoveIcon: true,
  },
  customRequest: ({ onSuccess }) => {
    onSuccess?.('ok')
  },
  onChange(info) {
    if (info.file.status === 'done') {
      toast.success(`${info.file.name} file uploaded successfully`)
    } else if (info.file.status === 'error') {
      toast.error(`${info.file.name} file upload failed.`)
    }
  },
  beforeUpload: (file) => {
    const isLt2M = file.size / 1024 / 1024 < maxFileSize
    if (!isLt2M) {
      toast.error('File must smaller than 2MB!')
      return false
    }
    return true
  }
}
const defaultAssets = [
  {
    id: uniqueId(),
    name: 'Image 1',
    src: image1
  },
  {
    id: uniqueId(),
    name: 'Image 2',
    src: image2
  }
]
export { fileAccept, maxFileSize, uploadProps, defaultAssets }
