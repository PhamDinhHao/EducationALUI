import { ApiService } from '@/shared/services';

const BaseUrl = "templates";

export function getTemplatesList(params: { [key: string]: any }) {
  return ApiService.get(`${BaseUrl}`, params).then((resp) => resp);
}

export function getTemplate(id: string) {
  return ApiService.get(`${BaseUrl}/${id}`).then((resp) => resp);
}

export function createTemplate(body: any) {
  return ApiService.post(`${BaseUrl}`, body).then((resp) => resp);
}

export function updateTemplate(id: string, body: any) {
  return ApiService.put(`${BaseUrl}/${id}`, body).then((resp) => resp);
}

export function deleteTemplate(ids: string) {
  return ApiService.delete(`${BaseUrl}/${ids}`).then((resp) => resp);
}

