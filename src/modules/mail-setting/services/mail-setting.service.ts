import { ApiService } from '@/shared/services'

const BaseUrl = 'email-settings'

export function getMailSettingList(params: { [key: string]: any }) {
  return ApiService.get(`${BaseUrl}`, params).then((resp) => resp)
}

export function createMailSetting(body: { [key: string]: any }) {
  return ApiService.post(`${BaseUrl}`, body).then((resp) => resp)
}

export function updateMailSetting(id: number | string, body: { [key: string]: any }) {
  return ApiService.put(`${BaseUrl}/${id}`, body).then((resp) => resp)
}

export function deleteMailSetting(id: string) {
  return ApiService.delete(`${BaseUrl}/${id}`).then((resp) => resp)
}
