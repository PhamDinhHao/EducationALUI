import { ApiService } from "@/shared/services";

const BaseUrl = "enrollments";

export function getMyEnrollments() {
    return ApiService.get(`${BaseUrl}/me`).then((resp) => resp);
}

export function checkEnrollment(courseId: number) {
    return ApiService.get(`${BaseUrl}/check/${courseId}`).then((resp) => resp);
}

export function enroll(courseId: number) {
    return ApiService.post(`${BaseUrl}`, { courseId }).then((resp) => resp);
}

export function unenroll(courseId: number) {
    return ApiService.delete(`${BaseUrl}`, { courseId }).then((resp) => resp);
}

