import { useNavigate } from 'react-router-dom'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SignInSchema, SignInSchemaType } from '@/modules/auth/core/config/form/sign-in-form'
import { signIn } from '@/modules/auth/services/auth.service'
import { useBoundStore } from '@/shared/stores'
const useSignInForm = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignInSchemaType>({ resolver: zodResolver(SignInSchema) })

  const onSubmit: SubmitHandler<SignInSchemaType> = async (values: SignInSchemaType) => {
    try {
      const res = await signIn(values);
      if (res?.data?.data) {
        const { user } = res.data.data;
        
        useBoundStore.getState().userLogin(user);
        navigate("/home", { replace: true });
      }
    } catch (err) {
      useBoundStore.getState().resetProfile();
    }
  };

  return { register, onSubmit, handleSubmit, errors }
}

export default useSignInForm
