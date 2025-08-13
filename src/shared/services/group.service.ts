import { TGroup } from "@/shared/core/config/form/group-form";
import { ApiService } from "@/shared/services";

const BaseUrl = "groups";

export function getGroups(params: { [key: string]: any }) {
  return ApiService.get(`${BaseUrl}`, params).then((resp) => resp);
}

export function createGroup(body: TGroup) {
  return ApiService.post(`${BaseUrl}`, body).then((resp) => resp);
}