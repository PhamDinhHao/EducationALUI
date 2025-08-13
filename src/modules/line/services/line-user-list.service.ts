import { ApiService } from '@/shared/services'

const BaseUrl = 'line-users'

export function getFollowerList(params?: { [key: string]: any }) {
  return ApiService.get(`${BaseUrl}`, params).then((resp) => resp)
}
