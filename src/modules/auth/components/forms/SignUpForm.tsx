import { Link } from 'react-router-dom'
import _ from 'lodash'
import FormField from '@shared/components/ui/FormField'
import useSignUpForm from '@auth/hooks/useSignUpForm'
import { PagePath } from '@/shared/core/enum/page.enum'

const SignUpForm = () => {
  const { register, submitHandler, errors } = useSignUpForm()

  return (
    <form
      className='flex w-full max-w-[540px] flex-col gap-6 rounded-2xl bg-white p-8 shadow-[0_0_15px_rgba(0,0,0,0.2)]'
      onSubmit={submitHandler}
    >
      <h1 className='mb-2 text-center text-2xl font-bold'>Đăng ký</h1>
      <FormField
        error={errors.name}
        label='Họ và tên'
        name='name'
        placeholder='Nhập họ và tên của bạn'
        register={register}
      />
      <FormField
        error={errors.email}
        label='Email'
        name='email'
        placeholder='Nhập email của bạn'
        register={register}
        type='email'
      />
      <FormField
        error={errors.password}
        label='Mật khẩu'
        name='password'
        placeholder='Nhập mật khẩu của bạn'
        register={register}
        type='password'
      />
      <FormField
        error={errors.confirmPassword}
        label='Xác nhận mật khẩu'
        name='confirmPassword'
        placeholder='Nhập lại mật khẩu của bạn'
        register={register}
        type='password'
      />
      <button
        className='mt-4 rounded-xl bg-blue-600 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50'
        type='submit'
      >
        Đăng ký
      </button>

      <div className='mt-2 text-center text-sm text-gray-600'>
        Bạn đã có tài khoản?{' '}
        <Link to={PagePath.LOGIN} className='text-blue-600 hover:underline'>
          Đăng nhập
        </Link>
      </div>
    </form>
  )
}

export default SignUpForm
