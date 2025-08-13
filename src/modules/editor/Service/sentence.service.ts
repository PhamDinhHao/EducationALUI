import { TNewSentence } from '@/modules/editor/schemas';
import { ApiService } from '@/shared/services';

const BaseUrl = "sentences";

export function getSentencesList(params?: { [key: string]: any }) {

  return ApiService.get(`${BaseUrl}`, params).then((resp) => resp);
}
export function getSentenceDetail(id: string) {
  return ApiService.get(`${BaseUrl}/${id}`).then((resp) => resp);
}
export function createSentence(data: TNewSentence) {
  return ApiService.post(`${BaseUrl}`, data).then((resp) => resp);
}
export function updateSentence(id: string, data: TNewSentence) {
  return ApiService.put(`${BaseUrl}/${id}`, data).then((resp) => resp);
}
export function deleteSentence(id: string) {
  return ApiService.delete(`${BaseUrl}/${id}`).then((resp) => resp);
}
