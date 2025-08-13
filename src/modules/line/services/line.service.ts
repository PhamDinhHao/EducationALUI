import { ApiService } from '@/shared/services'

const BaseUrl = 'send-line'

export function sendLine(body: { [key: string]: any }) {
  return ApiService.upload(`${BaseUrl}`, body).then((resp) => resp)
}

