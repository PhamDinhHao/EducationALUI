import { getMyEnrollments, checkEnrollment } from "@/shared/services/enrollment.service";

export const fetchMyEnrollments = async () => {
    try {
        const res = await getMyEnrollments();
        const data = res.data?.data || res.data || [];
        if (Array.isArray(data)) {
            return data.map((enrollment: any) => ({
                ...enrollment,
                course: {
                    ...enrollment.course,
                    enrollCount: enrollment.course?.enrollCount ?? enrollment.course?.enroll_count ?? 0,
                    students: enrollment.course?.enrollCount ?? enrollment.course?.enroll_count ?? enrollment.course?.students ?? 0,
                }
            }));
        }
        return data;
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

