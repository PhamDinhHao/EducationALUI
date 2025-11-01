import { getTopCategories, getCourseTypeById } from "@/shared/services/courseTypes.service";

export const fetchTopCategories = async (limit: number = 8) => {
    try {
        const res = await getTopCategories(limit);
        return res.data?.data || res.data || [];
    } catch (err) {
        return [];
    }
}

export const fetchCourseTypeById = async (id: number | string) => {
    try {
        const res = await getCourseTypeById(id);
        return res.data?.data || res.data || null;
    } catch (err) {
        return null;
    }
}
