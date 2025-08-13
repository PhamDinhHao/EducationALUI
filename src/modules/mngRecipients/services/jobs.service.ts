import { ApiService } from '@/shared/services';

const BaseUrl = "recipients/jobs";

export function getJobs(params: { [key: string]: any }) {
  return ApiService.get(`${BaseUrl}`, params).then((resp) => resp);
}
