import { ApiService } from '@/shared/services';

const BaseUrl = "distribution-histories";

export function getDistributionHistoryList(params: { [key: string]: any }) {
  return ApiService.get(`${BaseUrl}`, params).then((resp) => resp);
}

export function deleteDistributionHistory(id: string) {
  return ApiService.delete(`${BaseUrl}/${id}`).then((resp) => resp);
}

export function exportDistributionHistory(id: string, status: string) {
  return ApiService.post(`${BaseUrl}/${id}/export/${status}`, {}).then((resp) => resp);
}

export function exportDistributionHistoryTracking(id: string, status: string) {
  return ApiService.post(`${BaseUrl}/${id}/export-tracking/${status}`, {}).then((resp) => resp);
}
