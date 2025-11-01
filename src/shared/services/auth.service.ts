import { ApiService } from "@/shared/services";

const BaseUrl = "auth";

export function getProfile() {
  return ApiService.get(`${BaseUrl}/me`).then((resp) => resp);
}
export function updateProfile(body: { [key: string]: any }) {
  return ApiService.put(`${BaseUrl}/me`, body).then((resp) => resp);
}
export function changePassword(body: { oldPassword: string; newPassword: string }) {
  return ApiService.put(`${BaseUrl}/change-password`, body).then((resp) => resp);
}
export function logout() {
  return ApiService.post(`${BaseUrl}/logout`, {}).then((resp) => resp);
}
export function refreshToken() {
  return ApiService.post(`${BaseUrl}/refresh-tokens`, {}).then((resp) => resp);
}
