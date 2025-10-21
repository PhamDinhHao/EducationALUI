import React, { useState } from "react";
import { Button, Form, Input, Typography, Spin, message, Card, Row, Col } from "antd";
import { BookOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LessonResponse } from "../../../../shared/core/types";
import Sidebar from "@/shared/components/Sidebar";
import env from "@/shared/core/constants/env";

const { Title, Text } = Typography;
const { TextArea } = Input;

const API_URL = `${env.VITE_HOST_API}/lessons/generate`;

// 4 prompt mẫu
const promptTemplates = [
  {
    label: "Giáo án chuẩn (bám sát Bộ GD&ĐT)",
    value:
      "Môn: Toán\nBài: Hàm số\nThời lượng: 1 tiết\nLớp: 12\nChủ đề: Giáo án chuẩn (bám sát Bộ GD&ĐT)",
  },
  {
    label: "Giáo án phương pháp dạy học tích cực",
    value:
      "Môn: Toán\nBài: Hàm số\nThời lượng: 2 tiết\nLớp: 12\nChủ đề: Giáo án phương pháp dạy học tích cực",
  },
  {
    label: "Giáo án tích hợp liên môn",
    value:
      "Môn: Toán - Vật lý\nBài: Hàm số\nThời lượng: 1 tiết\nLớp: 12\nChủ đề: Giáo án tích hợp liên môn",
  },
  {
    label: "Giáo án STEAM",
    value:
      "Môn: Toán\nBài: Hàm số bậc nhất\nThời lượng: 1 tiết\nLớp: 12\nChủ đề: Giáo án STEAM",
  },
];

const LessonPrompt: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [lessonPlan, setLessonPlan] = useState<LessonResponse | null>(null);
  const [prompt, setPrompt] = useState(promptTemplates[0].value);
  const [selectedTemplate, setSelectedTemplate] = useState(promptTemplates[0].label);

  const navigate = useNavigate();

  // Hàm parse prompt thành object
  const parsePrompt = (text: string) => {
    const lines = text.split("\n");
    const data: any = {};

    lines.forEach((line) => {
      const [key, value] = line.split(":").map((s) => s.trim());
      if (!key || !value) return;
      if (key.toLowerCase().includes("môn")) data.subject = value;
      if (key.toLowerCase().includes("bài")) data.topic = value;
      if (key.toLowerCase().includes("thời lượng"))
        data.periods = parseInt(value) || 1;
      if (key.toLowerCase().includes("lớp")) data.grade = value;
      if (key.toLowerCase().includes("chủ đề")) data.lessonType = value;
    });

    return data;
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const parsedData = parsePrompt(prompt);
  
      if (!parsedData.subject || !parsedData.topic || !parsedData.grade) {
        message.error("Prompt chưa đầy đủ thông tin!");
        setLoading(false);
        return;
      }
  
      // Gọi API
      const response = await axios.post(API_URL, parsedData);
  
      // Unwrap: backend có thể trả về { data: {...} } hoặc {...}
      const data = response.data?.data ?? response.data;
  
      // Lưu state local (không bắt buộc)
      setLessonPlan(data);
  
      message.success("Tạo giáo án thành công!");
  
      // Navigate sang LessonResult với đúng key lesson
      navigate("/ai/lesson-result", {
        state: { lesson: data },
      });
    } catch (error) {
      console.error(error);
      message.error("Có lỗi xảy ra khi tạo giáo án!");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="w-full p-[3rem]">
        <div className="max-w-[1100px] mx-auto">
      <Card className="w-full max-w-3xl shadow-lg rounded-2xl p-6 mx-auto">
        <div className="text-center mb-6">
          <BookOutlined style={{ fontSize: 32, color: "#E8612A" }} />
          <Title level={2} style={{ color: "#E8612A" }}>
            Xây dựng giáo án
          </Title>
          <Text type="secondary">
            GEN AI giúp bạn xây dựng giáo án theo chuẩn cấu trúc 5512
          </Text>
        </div>

        {/* 4 lựa chọn prompt */}
        <div className="mb-6">
          <Text strong>Bạn có thể chọn các prompt sau đây để tạo giáo án thích hợp</Text>
          <Row gutter={[16, 16]} justify="center" className="mt-3">
            {promptTemplates.map((item, index) => (
              <Col xs={24} sm={12} key={index}>
                <div
                  onClick={() => {
                    setPrompt(item.value);
                    setSelectedTemplate(item.label);
                  }}
                  style={{
                    textAlign: "center",
                    padding: "12px 16px",
                    border: "2px solid #E8612A",
                    borderRadius: "999px",
                    cursor: "pointer",
                    fontWeight: 500,
                    backgroundColor:
                      selectedTemplate === item.label ? "#fff5f0" : "white",
                  }}
                >
                  {item.label}
                </div>
              </Col>
            ))}
          </Row>
        </div>

        <Form layout="vertical">
          <Form.Item label="Prompt">
            <TextArea
              rows={6}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              block
              onClick={handleSubmit}
              disabled={loading}
              style={{
                background: "#E8612A",
                borderColor: "#E8612A",
                borderRadius: "999px",
                height: 40,
              }}
            >
              {loading ? <Spin /> : "Gửi"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
    </div>
    </div>
  );
};

export default LessonPrompt;
