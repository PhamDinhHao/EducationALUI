import React, { useState } from "react";
import { Button, Typography, Input } from "antd";
import { useNavigate } from "react-router-dom";
import {
  BookOutlined,
  CodeOutlined,
  SettingOutlined,
  UploadOutlined,
  SendOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const LessonBuilder: React.FC = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = () => {
    if (!searchValue.trim()) return;
    console.log("Tìm kiếm:", searchValue);
    // navigate(`/ai/search?query=${searchValue}`);
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

      {/* Các lựa chọn */}
      <div
        style={{
          width: "100%",
          maxWidth: "800px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          margin: "20px 0",
        }}
      >
        <Button
          type="default"
          icon={<BookOutlined />}
          style={{
            border: "1px solid #E8612A",
            color: "#E8612A",
            borderRadius: "999px",
            height: "auto",
            padding: "20px",
            whiteSpace: "normal",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
          onClick={() => navigate("/ai/lesson-form")}
        >
          Soạn giáo án
        </Button>

        

        <Button
          type="default"
          icon={<CodeOutlined />}
          style={{
            border: "1px solid #E8612A",
            color: "#E8612A",
            borderRadius: "999px",
            height: "auto",
            padding: "20px",
            whiteSpace: "normal",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
          onClick={() => navigate("/ai/prompt-lesson")}
        >
          Prompt giáo án
        </Button>

        <Button
          type="default"
          icon={<SettingOutlined />}
          style={{
            border: "1px solid #E8612A",
            color: "#E8612A",
            borderRadius: "999px",
            height: "auto",
            padding: "20px",
            whiteSpace: "normal",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
          onClick={() => navigate("/ai/stem-lesson")}
        >
          Bài học STEM
        </Button>
      </div>
    {/* Thanh search y chang ảnh */}
      <div style={{ width: "100%", maxWidth: "700px", marginBottom: "2rem" }}>
        <Input
          placeholder="Đặt câu hỏi..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onPressEnter={handleSearch}
          style={{
            border: "2px solid #E8612A",
            borderRadius: "999px",
            padding: "12px 16px",
            fontSize: 16,
          }}
          suffix={
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <UploadOutlined style={{ fontSize: 20, color: "gray", cursor: "pointer" }} />
              <SendOutlined
                style={{ fontSize: 22, color: "#E8612A", cursor: "pointer" }}
                onClick={handleSearch}
              />
            </div>
          }
        />
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
        Khi đặt câu hỏi, bạn đồng ý với <a href="#">Điều khoản</a> và{" "}
        <a href="#">Chính sách quyền riêng tư</a>.
      </Text>
    </div>
  );
};

export default LessonBuilder;
