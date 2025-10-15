// src/modules/Course/pages/LessonPlayerPage/LessonVideo.tsx
import { Button } from "antd";
import { MessageOutlined } from "@ant-design/icons";


interface LessonVideoProps {
  title: string;
  src?: string;
  duration: string;
  commentVisible: boolean;
  toggleComment: () => void;
  updatedAt?: string; // <-- thêm dòng này

}

export default function LessonVideo({
  title,
  src,
  duration,
  commentVisible,
  updatedAt,   // <-- lấy prop
  toggleComment,
}: LessonVideoProps) {
  const getYouTubeEmbed = (url?: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url?.match(regExp);
    return match && match[2] ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  const embedUrl = getYouTubeEmbed(src);

  const getUpdatedAt = (dateStr?: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const month = date.toLocaleString("vi-VN", { month: "long" });
    const year = date.getFullYear();
    return `Cập nhật ${month} năm ${year}`;
  };
  return (
    <div style={{ flex: 3, width: "100%" }}>
      {embedUrl ? (
        <iframe
          width="100%"
          height="500"
          src={embedUrl}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ borderRadius: 8 }}
        />
      ) : (
        <p>Video chưa có sẵn hoặc không phải YouTube.</p>
      )}

        <div style={{ textAlign: "right", marginTop: 8 }}>
            <Button
                type="primary" // hoặc "default" nếu muốn màu nhẹ
                icon={<MessageOutlined />} // icon hiển thị bên trái
                onClick={toggleComment}
               style={{ color: "#e08404ff" , backgroundColor : "#fff", fontWeight: 500, }} // đổi màu chữ

            >
                {commentVisible ?  "Ẩn hỏi đáp" : "Hiện hỏi đáp"}
            </Button>
        </div>

        <h2 style={{ marginTop: 16, fontWeight: 'bold' , fontSize : '30px'}}>{title}</h2>
      <p style={{ color: "#888" }}> {getUpdatedAt(updatedAt)} • {duration}</p>
    </div>
  );
}
