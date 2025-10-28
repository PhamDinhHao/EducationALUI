import { List, Button, Typography } from "antd";
import { PlayCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Lesson } from "@/modules/course/types/Course.ts";

const { Text } = Typography;

type Props = {
  lessons: Lesson[];
};

// Hàm chuyển "12 PHÚT", "15 phút", "mm:ss" thành giây
function parseDurationToSeconds(duration: string | number) {
  if (typeof duration === "number") return duration; // nếu đã là số giây
  // thử dạng mm:ss
  if (duration.includes(":")) {
    const parts = duration.split(":").map(Number);
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    return parts[0];
  }
  // thử dạng "12 PHÚT" hoặc "15 phút"
  const match = duration.match(/(\d+)/);
  return match ? parseInt(match[1], 10) * 60 : 0;
}

// Hàm tính tổng thời lượng
function getTotalDuration(lessons: Lesson[]) {
  const totalSeconds = lessons.reduce(
    (sum, lesson) => sum + parseDurationToSeconds(lesson.duration),
    0
  );

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  } else {
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }
}

export default function LessonList({ lessons }: Props) {
  const navigate = useNavigate();

  return (
    <div style={{ marginTop: 32 }}>
      <h3 style={{ marginBottom: 8 }}>Nội dung khóa học</h3>
      <Text type="secondary" style={{ display: "block", marginBottom: 16 }}>
        <Text strong>{lessons.length}</Text> bài học • Thời lượng{" "}
        <Text strong>{getTotalDuration(lessons)}</Text>
      </Text>

      <List
        itemLayout="horizontal"
        dataSource={lessons}
            style={{
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
        renderItem={(lesson, index) => (
          <List.Item
            style={{
              padding: "16px 20px",
              alignItems: "center",
              marginBottom: 8, // khoảng cách giữa các item
              borderRadius: 8,
              backgroundColor: "#fff",
            }}
            actions={[
              <Text key="duration" type="secondary">
                {lesson.duration}
              </Text>,
              <Button
                key="start"
                type="primary"
                icon={<PlayCircleOutlined />}
                onClick={() => navigate(`/lesson/${lesson.id}`)}
              >
                Bắt đầu học
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={
                <Text strong style={{ fontSize: 16 }}>
                  {`${index + 1}. ${lesson.title}`}
                </Text>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
}
