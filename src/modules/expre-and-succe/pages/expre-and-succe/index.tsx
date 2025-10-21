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
import Sidebar from "@/shared/components/Sidebar";
import env from "@/shared/core/constants/env";

const { Title } = Typography;
const { TextArea } = Input;

const API_URL = `${env.VITE_HOST_API}/exercise/chat`;

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
    } catch {
      message.error("Có lỗi khi gửi câu hỏi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 px-6 py-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <Title level={2} className="!text-orange-500">
              Kế hoạch cá nhân & Sáng kiến kinh nghiệm
            </Title>
            <p className="text-gray-600">
              Chọn nội dung bạn muốn tạo cùng Trợ lý AI
            </p>
          </div>

          {/* Lựa chọn nội dung */}
          <Row gutter={24} justify="center" className="mb-10">
            <Col>
              <Card
                hoverable
                className="transition-all hover:shadow-lg border-orange-400 rounded-xl text-center p-6"
                onClick={() => navigate("/ai/succession-plan")}
              >
                <img
                  src="https://img.icons8.com/ios/50/ffa500/note.png"
                  alt="Personal Plan"
                  className="mx-auto mb-3"
                />
                <Title level={4}>Kế hoạch cá nhân</Title>
              </Card>
            </Col>
            <Col>
              <Card
                hoverable
                className="transition-all hover:shadow-lg border-sky-400 rounded-xl text-center p-6"
                onClick={() => navigate("/ai/experience-initiative")}
              >
                <img
                  src="https://img.icons8.com/ios/50/00bfff/document.png"
                  alt="Experience Initiative"
                  className="mx-auto mb-3"
                />
                <Title level={4}>Sáng kiến kinh nghiệm</Title>
              </Card>
            </Col>
          </Row>

          {/* Hộp chat */}
          <div className="bg-white shadow-md rounded-2xl p-5 h-[50vh] flex flex-col">
            {/* Header */}
            <div className="border-b pb-3 mb-3 flex items-center gap-2">
              <Avatar icon={<RobotOutlined />} style={{ background: "#00bfff" }} />
              <span className="font-semibold text-gray-700">Trợ lý AI</span>
            </div>

            {/* Lịch sử chat */}
            <div className="flex-1 overflow-y-auto space-y-3 px-1">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-2xl shadow-sm ${
                      msg.role === "user"
                        ? "bg-orange-100 text-gray-800"
                        : "bg-sky-100 text-gray-700"
                    }`}
                  >
                    {msg.imageUrl && (
                      <Image
                        src={msg.imageUrl}
                        width={200}
                        className="rounded-lg mb-2"
                      />
                    )}
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-center text-gray-500 text-sm gap-2">
                  <Spin size="small" /> Đang trả lời...
                </div>
              )}
            </div>

            {/* Input */}
            <div className="mt-3 flex items-center gap-2">
              {imagePreview && (
                <div className="relative">
                  <Image
                    src={imagePreview}
                    width={60}
                    height={60}
                    className="rounded-lg object-cover"
                  />
                  <Button
                    type="text"
                    size="small"
                    className="!absolute !top-[-6px] !right-[-6px] !text-red-500"
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
                loading={loading}
                onClick={handleSend}
                className="!bg-orange-500 !border-none rounded-full px-4"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpreAndSucce;
