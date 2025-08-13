import { SignInSchemaType } from '@/modules/auth/core/config/form/sign-in-form';
import { SignUpSchemaType } from '@/modules/auth/core/config/form/sign-up-form';
import { ApiService } from '@/shared/services';

const BaseUrl = "auth";

export function signUp(params: SignUpSchemaType) {
  return ApiService.post(`${BaseUrl}/register`, params, { withCredentials: true }).then((resp) => resp);
}

export function signIn(params: SignInSchemaType) {
  return ApiService.post(`${BaseUrl}/login`, params, { withCredentials: true }).then((resp) => resp);
}
