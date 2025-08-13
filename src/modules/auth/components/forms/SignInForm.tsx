import FormField from '@shared/components/ui/FormField'
import useSignInForm from '@auth/hooks/useSignInForm'
import { Link } from 'react-router-dom'
import { PagePath } from '@/shared/core/enum/page.enum'

const SignInForm = () => {
  const { errors, register, handleSubmit, onSubmit } = useSignInForm()

  return (
    <div className='flex w-full flex-col gap-6'>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
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
        <button className='mt-2 w-full rounded-xl bg-[#3366FF] py-3 text-white hover:bg-blue-600' type='submit'>
          Sign In
        </button>
      </form>

      <div className='text-center text-sm'>
        <Link className='text-gray-500 hover:text-gray-700' to={PagePath.REGISTER}>
          Already have an account? Sign In
        </Link>
      </div>
    </div>
  )
}

export default SignInForm
