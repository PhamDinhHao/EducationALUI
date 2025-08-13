import { ApiService } from '@/shared/services';

const BaseUrl = "assets";

export function getAssetsList(params?: { [key: string]: any }) {

  return ApiService.get(`${BaseUrl}`, params).then((resp) => resp);
}
export function getAssetDetail(id: string) {
  return ApiService.get(`${BaseUrl}/${id}`).then((resp) => resp);
}
export function createAsset(data: { [key: string]: any }) {
  return ApiService.post(`${BaseUrl}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then((resp) => resp);
}
export function updateAsset(id: string, data: FormData) {
  return ApiService.put(`${BaseUrl}/${id}`, data).then((resp) => resp);
}
export function deleteAsset(id: string) {
  return ApiService.delete(`${BaseUrl}/${id}`).then((resp) => resp);
}
