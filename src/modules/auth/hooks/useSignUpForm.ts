import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import _ from 'lodash'
import { SignUpSchema, SignUpSchemaType } from '@/modules/auth/core/config/form/sign-up-form'
import useHandleForm from '@/shared/hooks/useHandleForm'
import { AxiosResponse } from 'axios'
import { signUp } from '@/modules/auth/services/auth.service'
import { PagePath } from '@/shared/core/enum/page.enum'

const useSignUpForm = () => {
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpSchemaType>({ 
    resolver: zodResolver(SignUpSchema),
    mode: 'all',
  })

  const onSubmit = async (value: SignUpSchemaType): Promise<AxiosResponse<any, any>> => {
    return await signUp(value)
  }

  const { onSubmitForm } = useHandleForm({
    onSubmit,
    setError,
    isValidForm: true,
    pathNavigate: PagePath.LOGIN,
  })

  const submitHandler = handleSubmit(onSubmitForm)

  return { register, submitHandler, errors }
}

export default useSignUpForm
