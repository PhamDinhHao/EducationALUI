import { ApiService } from '@/shared/services';

const BaseUrl = "recipients/trash";

export function getTrashList(params: { [key: string]: any }) {
  return ApiService.get(`${BaseUrl}`, params).then((resp) => resp);
}

export function restoreTrash(body: { [key: string]: any }) {
  return ApiService.post(`${BaseUrl}/restore`, body).then((resp) => resp);
}

export function removeTrash(body: { [key: string]: any }) {
  return ApiService.post(`${BaseUrl}/delete`, body).then((resp) => resp);
}

export function exportCSV(body: { [key: string]: any }) {
  return ApiService.post(`${BaseUrl}/export`, body).then((resp) => resp);
}


