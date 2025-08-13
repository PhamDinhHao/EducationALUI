import { ApiService } from '@/shared/services'

const BaseUrl = 'email-test'

export function sendMailTest(body: { [key: string]: any }) {
  return ApiService.post(`${BaseUrl}/send`, body).then((resp) => resp)
}
