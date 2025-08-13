import { ApiService } from "@/shared/services";

const BaseUrl = "email-settings";

export function getEmailSettings(params: { [key: string]: any }) {
  return ApiService.get(`${BaseUrl}`, params).then((resp) => resp);
}