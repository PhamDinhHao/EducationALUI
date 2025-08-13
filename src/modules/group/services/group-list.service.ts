import { ApiService } from '@/shared/services'

const BaseUrl = 'groups'

export function getGroupList(params?: { [key: string]: any }) {
  return ApiService.get(`${BaseUrl}`, params).then((resp) => resp)
}
export function getGroupDetail(id: string) {
  return ApiService.get(`${BaseUrl}/${id}`).then((resp) => resp)
}
export function deleteGroup(id: string) {
  return ApiService.delete(`${BaseUrl}/${id}`).then((resp) => resp)
}
export function createGroup(body: { [key: string]: any }) {
  return ApiService.post(`${BaseUrl}`, body).then((resp) => resp)
}
export function updateGroup(id: number, body: { [key: string]: any }) {
  return ApiService.put(`${BaseUrl}/${id}`, body).then((resp) => resp)
}
