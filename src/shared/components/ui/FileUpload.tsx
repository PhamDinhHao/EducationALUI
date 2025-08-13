import { Upload, Button } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

import type { UploadProps } from 'antd'


type FileUploadProps = UploadProps & {}

const FileUpload: React.FC<FileUploadProps> = (props) => {
  return (
    <Upload {...props} className='flex items-center gap-2'>
      {/* Click to Upload */}
      <Button icon={<UploadOutlined />}>ファイルを選択</Button>
    </Upload>
  )
}

export default FileUpload
