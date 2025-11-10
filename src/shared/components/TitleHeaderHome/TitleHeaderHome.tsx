import { Button } from 'antd'

type TTitleHeaderHome = {
  heading: string
  description: string
  buttonLabel: string
  isButtonHeading?: boolean
  onAction?: () => void
}

const TitleHeaderHome = (props: TTitleHeaderHome) => {
  const { isButtonHeading = true, heading, description, buttonLabel, onAction } = props

  return (
    <div className='m-4 flex items-center justify-between'>
      <div className='flex flex-col justify-start'>
        <h1 className='mb-2 text-2xl font-bold text-gray-800'>{heading}</h1>
        <p className='text-gray-500'>{description}</p>
      </div>
      {isButtonHeading && <Button shape='round' onClick={onAction}>
        {buttonLabel}
      </Button>}

    </div>
  )
}

export default TitleHeaderHome
