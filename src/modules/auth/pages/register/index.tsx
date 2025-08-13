import { SignUpForm } from '@/modules/auth/components'
import { Skeleton } from 'antd'
import { Suspense } from 'react'

const SignUpPage = () => {
  return (
    <div className='flex h-screen flex-col items-center justify-center gap-2'>
      <Suspense fallback={<Skeleton active className='w-[540px]' />}>
        <SignUpForm />
      </Suspense>
    </div>
  )
}

export default SignUpPage