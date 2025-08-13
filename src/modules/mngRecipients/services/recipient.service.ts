import { ApiService } from '@/shared/services';

const BaseUrl = "recipients";

export function getRecipientsList(params: { [key: string]: any }) {
  return ApiService.get(`${BaseUrl}`, params).then((resp) => resp);
}

export function createRecipient(body: { [key: string]: any }) {
  return ApiService.post(`${BaseUrl}`, body).then((resp) => resp);
}

export function updateRecipient(id: number, body: { [key: string]: any }) {
  return ApiService.put(`${BaseUrl}/${id}`, body).then((resp) => resp);
}

export function bulkAddGroup(body: { [key: string]: any }) {
  return ApiService.post(`${BaseUrl}/bulk-add-group`, body).then((resp) => resp);
}

export function bulkRemoveGroup(body: { [key: string]: any }) {
  return ApiService.post(`${BaseUrl}/bulk-remove-group`, body).then((resp) => resp);
}

export function bulkDeleteRecipient(body: { [key: string]: any }) {
  return ApiService.post(`${BaseUrl}/bulk-delete`, body).then((resp) => resp);
}

export function exportRecipient(recipientId: string) {
  return ApiService.post(`${BaseUrl}/export`, { recipientId }).then((resp) => resp);
}

export function importRecipient(body: { [key: string]: any }) {
  return ApiService.post(`${BaseUrl}/import`, body, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then((resp) => resp);
}

export function importDeleteRecipient(body: { [key: string]: any }) {
  return ApiService.post(`${BaseUrl}/import-bulk-delete`, body, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then((resp) => resp);
}
