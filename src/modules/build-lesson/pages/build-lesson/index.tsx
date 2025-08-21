import React from "react";
import { Button, Input, Typography, Upload } from "antd";
import { UploadOutlined, PictureOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom"; // 👈 Thêm cái này

const { Title, Text } = Typography;
const { TextArea } = Input;

const prompts = [
  "Giáo án chuẩn (bám sát Bộ GD&ĐT)",
  "Giáo án phương pháp dạy học tích cực",
  "Giáo án tích hợp liên môn",
  "Giáo án STEAM",
];

const LessonBuilder: React.FC = () => {
  const navigate = useNavigate(); // 👈 Hook điều hướng

  const handlePromptClick = (p: string) => {
    navigate("/ai/lesson-form", { state: { prompt: p } }); // 👈 Chuyển sang page mới
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "3rem",
      }}
    >
      {/* Tiêu đề */}
      <Title level={2} style={{ textAlign: "center", color: "#E8612A" }}>
        Xây dựng giáo án
      </Title>
      <Text style={{ display: "block", textAlign: "center", marginBottom: 24 }}>
        GEN AI giúp bạn xây dựng giáo án theo chuẩn cấu trúc 5512
      </Text>

      {/* Gợi ý prompt */}
      <Text strong>
        Bạn có thể chọn các prompt sau đây để tạo giáo án thích hợp
      </Text>
      <div
        style={{
          width: "100%",
          maxWidth: "1000px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "16px",
          margin: "20px 0",
        }}
      >
        {prompts.map((p, idx) => (
          <Button
            key={idx}
            type="default"
            style={{
              border: "1px solid #E8612A",
              color: "#E8612A",
              borderRadius: "999px",
              height: "auto",
              padding: "10px 20px",
              whiteSpace: "normal",
            }}
            onClick={() => handlePromptClick(p)} // 👈 Thêm sự kiện click
          >
            {p}
          </Button>
        ))}
      </div>

      {/* Ô nhập prompt */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "1000px",
        }}
      >
        <TextArea
          rows={6}
          placeholder="Nhập yêu cầu xây dựng giáo án của bạn..."
          style={{
            borderColor: "#E8612A",
            borderRadius: "12px",
            paddingRight: "90px",
          }}
        />
        <div style={{ position: "absolute", bottom: 10, right: 10 }}>
          <Upload>
            <Button
              type="text"
              icon={<PictureOutlined style={{ fontSize: 20, color: "#E8612A" }} />}
            />
          </Upload>
          <Button
            type="text"
            icon={<UploadOutlined style={{ fontSize: 20, color: "#E8612A" }} />}
          />
        </div>
      </div>

      {/* Footer */}
      <Text
        style={{
          display: "block",
          textAlign: "center",
          marginTop: 24,
          color: "gray",
        }}
      >
        Khi đặt câu hỏi, bạn đồng ý với{" "}
        <a href="#">Điều khoản</a> và <a href="#">Chính sách quyền riêng tư</a>.
      </Text>
    </div>
  );
};

export default LessonBuilder;
