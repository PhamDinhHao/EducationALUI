import { CheckOutlined } from "@ant-design/icons";
import { Course } from "../../types/Course";

type Props = {
  course: Course;
};

export default function CourseInfo({ course }: Props) {
  // Lấy phần introductions từ course, nếu không có thì mảng rỗng
  const introductions = course.introductions ?? [];

  return (
    <>
      <h1 style={{ fontSize: 28, fontWeight: "bold" }}>{course.title}</h1>
      <p style={{ marginTop: 8, fontSize: 16, color: "#555" }}>
        {course.description}
      </p>

      <div style={{ marginTop: 24 }}>
        <h3>Bạn sẽ học được gì?</h3>
        {introductions.length > 0 ? (
          <ul
            style={{
              paddingLeft: 20,
              marginTop: 8,
              columnCount: 2,
              columnGap: "20px",
              listStyle: "none", // loại bỏ bullet mặc định
            }}
          >
            {introductions.map((item, index) => (
              <li
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <CheckOutlined style={{ color: "#fc8200e2", marginRight: 8 }} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>Chưa có phần giới thiệu khóa học.</p>
        )}
      </div>
    </>
  );
}
