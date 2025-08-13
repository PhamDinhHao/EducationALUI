import { ApiService } from '@/shared/services';

const BaseUrl = "reservations";

export function getReservationList(params: { [key: string]: any }) {
  return ApiService.get(`${BaseUrl}`, params).then((resp) => resp);
}

export function getReservation(id: string) {
  return ApiService.get(`${BaseUrl}/${id}`).then((resp) => resp);
}

export function createReservation(body: any) {
  return ApiService.upload(`${BaseUrl}`, body).then((resp) => resp);
}

export function updateReservation(id: string, body: any) {
  return ApiService.upload(`${BaseUrl}/${id}`, body, {
    _method: "PUT",
  }).then((resp) => resp);
}

export function deleteReservation(id: string) {
  return ApiService.delete(`${BaseUrl}/${id}`).then((resp) => resp);
}
