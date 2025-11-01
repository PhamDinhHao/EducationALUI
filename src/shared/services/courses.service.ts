import { ApiService } from "@/shared/services";

const BaseUrl = "courses";

export function getTopEnrolledCourses(limit: number = 8) {
    return ApiService.get(`${BaseUrl}/top-enrolled`, { limit }).then((resp) => resp);
}


export function getCourseDetail(id: number | string) {
    return ApiService.get(`${BaseUrl}/${id}`).then((resp) => resp);
}

export function getCoursesByCategoryId(categoryId: number | string) {
    return ApiService.get(`${BaseUrl}/category/${categoryId}`).then((resp) => resp);
}