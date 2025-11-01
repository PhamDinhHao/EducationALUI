import { getTopCategories } from "@/shared/services/courseTypes.service";

export const fetchTopCategories = async (limit: number = 8) => {
    try {
        const res = await getTopCategories(limit);
        return res.data?.data || res.data || [];
    } catch (err) {
        return [];
    }
}
