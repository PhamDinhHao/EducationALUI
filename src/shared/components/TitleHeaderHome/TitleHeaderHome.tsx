import { Button } from 'antd'

type TTitleHeaderHome = {
  heading: string
  description: string
  buttonLabel: string
  isButtonHeading?: boolean
  center?: boolean
  onAction?: () => void
}

const TitleHeaderHome = (props: TTitleHeaderHome) => {
  const { isButtonHeading = true, center = false, heading, description, buttonLabel, onAction } = props

  if (center) {
    return (
      <div className='mb-8 text-center'>
        <h1 className='mb-2 text-3xl md:text-5xl font-bold' style={{ color: '#ff8c00' }}>
          {heading}
        </h1>
        <p className='text-base md:text-xl mb-6'>
          {description}
        </p>
        {isButtonHeading && (
          <Button shape='round' size='large' onClick={onAction} style={{ marginTop: '8px' }}>
            {buttonLabel}
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className='mb-4 flex items-center justify-between'>
      <div className='flex flex-col justify-start'>
        <h1 className='mb-1 text-xl font-bold text-gray-800'>{heading}</h1>
        <p className='text-sm text-gray-500'>{description}</p>
      </div>
      {isButtonHeading && <Button  shape='round' size='small' onClick={onAction}>
        {buttonLabel}
      </Button>}

    </div>
  )
}

export default TitleHeaderHome
