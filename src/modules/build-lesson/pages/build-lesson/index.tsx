import React, { useState } from "react";
import {
  Typography,
  Button,
  Input,
  List,
  Avatar,
  Spin,
  Upload,
  Image,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";
import {
  BookOutlined,
  CodeOutlined,
  SettingOutlined,
  SendOutlined,
  UserOutlined,
  RobotOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import axios from "axios";
import Sidebar from "@/shared/components/Sidebar";
import env from "@/shared/core/constants/env";

const { Title, Text } = Typography;
const { TextArea } = Input;

const API_URL = `${env.VITE_HOST_API}/exercise/chat`;

interface ChatMessage {
  role: "user" | "ai";
  content: string;
  imageUrl?: string;
}

const LessonBuilder: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Upload ảnh
  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      message.error("Chỉ được upload file ảnh!");
      return false;
    }
    if (file.size / 1024 / 1024 >= 20) {
      message.error("File ảnh phải nhỏ hơn 20MB!");
      return false;
    }
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
    return false;
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    setImagePreview("");
  };

  // Gửi tin nhắn
  const handleSend = async () => {
    if (!inputValue.trim() && !selectedImage) return;

    const newUserMessage: ChatMessage = {
      role: "user",
      content: inputValue,
      imageUrl: imagePreview || undefined,
    };
    setMessages((prev) => [...prev, newUserMessage]);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("prompt", newUserMessage.content);
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const res = await axios.post(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const aiResponse: ChatMessage = {
        role: "ai",
        content: res.data?.answer || "AI không trả lời được.",
      };
      setMessages((prev) => [...prev, aiResponse]);

      setInputValue("");
      setSelectedImage(null);
      setImagePreview("");
    } catch (err) {
      message.error("Có lỗi khi gửi câu hỏi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex min-h-screen bg-gray-50'>
      <Sidebar />
      <div className=' w-full'>
        <div className='mx-auto max-w-[1100px]'></div>
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
            fontWeight: "bold",
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
            fontWeight: "bold",
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
            fontWeight: "bold",
          }}
          onClick={() => navigate("/ai/stem-lesson")}
        >
          Bài học STEM
        </Button>
      </div>

      {/* Chat Box */}
      <div
        style={{
          width: "100%",
          maxWidth: 800,
          margin: "0 auto",
          background: "#f9f9f9",
          borderRadius: 12,
          padding: 20,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          height: "60vh",
        }}
      >
        {/* Lịch sử chat */}
        <div style={{ flex: 1, overflowY: "auto", marginBottom: 12 }}>
          <List
            dataSource={messages}
            renderItem={(msg, index) => (
              <List.Item
                key={index}
                style={{
                  justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <List.Item.Meta
                  avatar={
                    msg.role === "user" ? (
                      <Avatar
                        icon={<UserOutlined />}
                        style={{ background: "#ff6600" }}
                      />
                    ) : (
                      <Avatar
                        icon={<RobotOutlined />}
                        style={{ background: "#00bfff" }}
                      />
                    )
                  }
                  description={
                    <div
                      style={{
                        background:
                          msg.role === "user" ? "#ffe7d1" : "#e6f7ff",
                        padding: "8px 12px",
                        borderRadius: 12,
                        maxWidth: 500,
                        textAlign: "left",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {msg.imageUrl && (
                        <Image
                          src={msg.imageUrl}
                          width={200}
                          className="rounded-lg mb-2"
                        />
                      )}
                      {msg.content}
                    </div>
                  }
                />
              </List.Item>
            )}
          />
          {loading && (
            <div style={{ textAlign: "left", marginLeft: 40 }}>
              <Spin size="small" /> Đang trả lời...
            </div>
          )}
        </div>

        {/* Input chat */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {imagePreview && (
            <div style={{ position: "relative" }}>
              <Image
                src={imagePreview}
                width={60}
                height={60}
                style={{
                  borderRadius: 8,
                  objectFit: "cover",
                  marginRight: 8,
                }}
              />
              <Button
                type="text"
                size="small"
                style={{ position: "absolute", top: -8, right: -8, color: "red" }}
                onClick={removeSelectedImage}
              >
                ✕
              </Button>
            </div>
          )}

          <TextArea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            autoSize={{ minRows: 1, maxRows: 4 }}
            placeholder="Nhập tin nhắn..."
            disabled={loading}
            onPressEnter={(e) => {
              if (!e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />

          <Upload
            showUploadList={false}
            beforeUpload={handleImageUpload}
            accept="image/*"
          >
            <Button icon={<PictureOutlined />} />
          </Upload>

          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            loading={loading}
            style={{ background: "#ff6600", borderRadius: 25 }}
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
        Khi đặt câu hỏi, bạn đồng ý với <a href="#">Điều khoản</a> và{" "}
        <a href="#">Chính sách quyền riêng tư</a>.
      </Text>
    </div>
    </div>
    </div>
  );
};

export default LessonBuilder;
