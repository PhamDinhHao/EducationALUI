import { ApiService } from '@/shared/services'

const BaseUrl = 'recipient-filters'

export function getRecipientFilter(params: { [key: string]: any }) {
  return ApiService.get(`${BaseUrl}`, params).then((resp) => resp)
}

export function getRecipientFilterDetail(id: string) {
  return ApiService.get(`${BaseUrl}/${id}`).then((resp) => resp)
}

export function createRecipientFilter(body: { [key: string]: any }) {
  return ApiService.post(`${BaseUrl}`, body).then((resp) => resp)
}

export function updateRecipientFilter(id: number | string, body: { [key: string]: any }) {
  return ApiService.put(`${BaseUrl}/${id}`, body).then((resp) => resp)
}

export function getRecipientFilterPreview(body: { [key: string]: any }) {
  return ApiService.post(`${BaseUrl}/preview`, body).then((resp) => resp)
}

export function exportRecipientFilter(body: { [key: string]: any }) {
  return ApiService.post(`${BaseUrl}/export`, body).then((resp) => resp)
}

export function deleteRecipientFilter(id: string) {
  return ApiService.delete(`${BaseUrl}/${id}`).then((resp) => resp)
}

