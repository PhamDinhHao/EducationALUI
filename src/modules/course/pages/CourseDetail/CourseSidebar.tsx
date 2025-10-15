    import { Card, Button } from "antd";
    import { Course } from "@/modules/course/types/Course.ts";

    type Props = {
    course: Course;
    };

    export default function CourseSidebar({ course }: Props) {
    return (
        <Card>
        {course?.img && (
            <img
            src={course.img}
            alt={course.title}
            style={{
                width: "100%",
                borderRadius: 8,
                marginBottom: 16,
                objectFit: "cover",
            }}
            />
        )}
        <h2 style={{ color: "red", margin: "16px 0" }}>Miễn phí</h2>
        <Button type="primary" size="large" block>
            Tham gia
        </Button>
        </Card>
    );
    }
