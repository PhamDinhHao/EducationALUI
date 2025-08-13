import { ApiService } from "@/shared/services";

const BaseUrl = "recipient-filters";

export function getRecipientFilter(params: { [key: string]: any }) {
  return ApiService.get(`${BaseUrl}`, params).then((resp) => resp);
}
