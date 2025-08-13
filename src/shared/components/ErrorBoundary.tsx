import { Button, Result } from 'antd'
import { Link } from 'react-router-dom'

const ErrorBoundary: React.FC = () => {

  return (
    <Result
      extra={
        <Button type='primary'>
          <Link to='/'>Back Home</Link>
        </Button>
      }
      status='500'
      subTitle='Sorry, something went wrong.'
      title='500'
    />
  )
}

export default ErrorBoundary
