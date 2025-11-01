import { getMyEnrollments } from "@/shared/services/enrollment.service";

export const fetchMyEnrollments = async () => {
    try {
        const res = await getMyEnrollments();
        return res.data?.data || res.data || [];
    } catch (err) {
        return [];
    }
}

