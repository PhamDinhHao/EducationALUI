import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

const Loading: React.FC = () => {
  return (
    <div className='fixed bottom-0 left-0 right-0 top-0 z-[9999] flex flex-col items-center justify-center bg-black/20'>
      <Spin
        indicator={
          <LoadingOutlined
            spin
            style={{
              fontSize: 48,
              color: '#1890ff'
            }}
          />
        }
      />
    </div>
  )
}

export default Loading
