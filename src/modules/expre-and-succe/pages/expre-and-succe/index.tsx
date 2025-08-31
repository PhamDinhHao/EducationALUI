import React, { useState } from "react";
import {
  Typography,
  Card,
  Row,
  Col,
  Input,
  Button,
  List,
  Avatar,
  Spin,
  Upload,
  Image,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";
import {
  SendOutlined,
  UserOutlined,
  RobotOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Title } = Typography;
const { TextArea } = Input;

const API_URL = "http://localhost:5001/api/v1/exercise/chat";

interface ChatMessage {
  role: "user" | "ai";
  content: string;
  imageUrl?: string;
}

const ExpreAndSucce: React.FC = () => {
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
    <div style={{ padding: 40, background: "#f9f9f9", minHeight: "100vh" }}>
      <div style={{ marginBottom: 20, textAlign: "center" }}>
        <Title level={2} style={{ color: "#ff6600", display: "inline" }}>
          Kế hoạch cá nhân & Sáng kiến kinh nghiệm
        </Title>
      </div>

      <p style={{ marginBottom: 30, textAlign: "center" }}>
        Chọn nội dung mà bạn muốn tạo
      </p>

      <Row gutter={24} justify="center" style={{ marginBottom: 30 }}>
        <Col>
          <Card
            hoverable
            style={{
              width: 250,
              borderRadius: 12,
              border: "1px solid #ff6600",
              textAlign: "center",
              padding: 20,
            }}
            onClick={() => navigate("/ai/succession-plan")}
          >
            <img
              src="https://img.icons8.com/ios/50/ffa500/note.png"
              alt="Personal Plan"
              style={{ marginBottom: 10 }}
            />
            <Title level={4}>Kế hoạch cá nhân</Title>
          </Card>
        </Col>
        <Col>
          <Card
            hoverable
            style={{
              width: 250,
              borderRadius: 12,
              border: "1px solid #ff6600",
              textAlign: "center",
              padding: 20,
            }}
            onClick={() => navigate("/ai/experience-initiative")}
          >
            <img
              src="https://img.icons8.com/ios/50/00bfff/document.png"
              alt="Experience Initiative"
              style={{ marginBottom: 10 }}
            />
            <Title level={4}>Sáng kiến kinh nghiệm</Title>
          </Card>
        </Col>
      </Row>

      {/* Chat Box */}
      <div
        style={{
          maxWidth: 800,
          margin: "0 auto",
          background: "#fff",
          borderRadius: 12,
          padding: 20,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          height: "70vh",
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
    </div>
  );
};

export default ExpreAndSucce;
