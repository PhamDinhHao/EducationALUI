import { getCourseDetail, getTopEnrolledCourses, getCoursesByCategoryId, queryCourses } from "@/shared/services/courses.service";


export const fetchTopEnrolledCourses = async (limit: number = 8) => {
    try {
        const res = await getTopEnrolledCourses(limit);
        return res.data;
    } catch (err) {
        return null;
    }
}

export const fetchCourseDetail = async (id: number | string) => {
    try {

        const res = await getCourseDetail(id);
        return res.data;
    } catch (err) {
        return null;
    }
}

export const fetchCoursesByCategoryId = async (categoryId: number | string) => {
    try {
        const res = await getCoursesByCategoryId(categoryId);
        return res.data?.data || res.data || [];
    } catch (err) {
        return [];
    }
}

export const fetchQueryCourses = async (params: { page?: number; limit?: number; sortBy?: string; sortType?: 'asc' | 'desc'; search?: string; courseTypeId?: number }) => {
    try {
        const res = await queryCourses(params);
        return res.data?.data || res.data || { data: [], pagination: null };
    } catch (err) {
        return { data: [], pagination: null };
    }
}
