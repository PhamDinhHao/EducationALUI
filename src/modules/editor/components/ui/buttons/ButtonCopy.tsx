import { Button } from 'antd'
import { CopyOutlined } from '@ant-design/icons'
import { copyTextToClipboard } from '@editor/lib/utils'

const ButtonCopy: React.FC<{ content: string }> = ({ content }) => {
  return (
    <Button className='rounded-md border p-2' onClick={() => copyTextToClipboard(content)}>
      <CopyOutlined />
    </Button>
  )
}

export default ButtonCopy
