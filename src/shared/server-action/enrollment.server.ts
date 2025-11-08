import { getMyEnrollments, checkEnrollment } from "@/shared/services/enrollment.service";

export const fetchMyEnrollments = async () => {
    try {
        const res = await getMyEnrollments();
        return res.data?.data || res.data || [];
    } catch (err) {
        return [];
    }
}

export const fetchEnrollmentStatus = async (courseId: number) => {
    try {
        const res = await checkEnrollment(courseId);
        return res.data?.data || res.data || { isEnrolled: false, enrollment: null };
    } catch (err: any) {
        return { isEnrolled: false, enrollment: null };
    }
}

