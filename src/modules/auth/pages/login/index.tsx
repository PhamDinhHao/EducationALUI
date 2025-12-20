import { Skeleton } from 'antd'
import { Suspense } from 'react'
import { SignInForm } from '@/modules/auth/components'

const SignInPage = () => {
  return (
    <div className='flex h-full flex-col items-center justify-center gap-2'>
      <div className='flex w-96 flex-col gap-8 rounded-2xl border border-gray-200 bg-white p-8'>
        <div className='flex flex-col items-center gap-2'>
          <h1 className='text-2xl font-bold'>Đăng nhập</h1>
          <p className='text-gray-500'>Chào mừng bạn quay trở lại!</p>
        </div>
        <Suspense fallback={<Skeleton active />}>
          <SignInForm />
        </Suspense>
      </div>
    </div>
  )
}

export default SignInPage
