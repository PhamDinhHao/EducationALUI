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
      <h1 className='mb-2 text-center text-2xl font-bold'>Sign Up</h1>
      <FormField
        error={errors.name}
        label='Full Name'
        name='name'
        placeholder='Enter your full name'
        register={register}
      />
      <FormField
        error={errors.email}
        label='Email'
        name='email'
        placeholder='Enter your email'
        register={register}
        type='email'
      />
      <FormField
        error={errors.password}
        label='Password'
        name='password'
        placeholder='Enter your password'
        register={register}
        type='password'
      />
      <FormField
        error={errors.confirmPassword}
        label='Confirm Password'
        name='confirmPassword'
        placeholder='Enter your password again'
        register={register}
        type='password'
      />
      <button
        className='mt-4 rounded-xl bg-blue-600 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50'
        type='submit'
      >
        Sign Up
      </button>

      <div className='mt-2 text-center text-sm text-gray-600'>
        Already have an account?
        <Link to={PagePath.LOGIN} className='text-blue-600 hover:underline'>
          Sign In
        </Link>
      </div>
    </form>
  )
}

export default SignUpForm
