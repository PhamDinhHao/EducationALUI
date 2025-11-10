import { ApiService } from "@/shared/services";

const BaseUrl = "course-types";

export function getTopCategories(limit: number = 8) {
    return ApiService.get(`${BaseUrl}/top`, { limit }).then((resp) => resp);
}

export function getCourseTypes() {
    return ApiService.get(`${BaseUrl}`).then((resp) => resp);
}

export function getCourseTypeById(id: number | string) {
    return ApiService.get(`${BaseUrl}/${id}`).then((resp) => resp);
}
