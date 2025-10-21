import React, { useMemo, useState } from "react";
import { Button, Form, Input, Select, Typography, Spin, message } from "antd";
import { BookOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { LessonResponse } from "../../../../shared/core/types";
import Sidebar from "@/shared/components/Sidebar";

const { Title, Text } = Typography;
const API_URL = "http://localhost:5000/api/v1/lessons/generate";

const subjectTopics: Record<string, string[]> = {
  toan: ["Hàm số", "Hình học", "Tổ hợp xác suất", "Giải tích"],
  ly: ["Cơ học", "Điện học", "Quang học", "Nhiệt học"],
  hoa: ["Hóa vô cơ", "Hóa hữu cơ", "Hóa phân tích"],
  van: ["Thơ ca", "Truyện ngắn", "Văn nghị luận"],
};

const subjectLabel: Record<string, string> = {
  toan: "Toán",
  ly: "Vật lý",
  hoa: "Hóa học",
  van: "Ngữ văn",
};

function normalizeLessonPayload(data: any): LessonResponse {
  if (data?.raw && typeof data.raw === "string") {
    try {
      const cleaned = data.raw.replace(/```json|```/g, "").trim();
      return JSON.parse(cleaned);
    } catch {
      return data;
    }
  }
  return data;
}

const LessonForm: React.FC = () => {
  const [form] = Form.useForm();
  const [subject, setSubject] = useState("toan");
  const [topic, setTopic] = useState(subjectTopics["toan"][0]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Nhận lessonType, promptText, file từ LessonBuilder
  const lessonType = location.state?.lessonType || "Giáo án chuẩn (bám sát Bộ GD&ĐT)";

  const topicOptions = useMemo(
    () => subjectTopics[subject].map((t) => ({ label: t, value: t })),
    [subject]
  );

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
  
      const payload = {
        grade: values.grade,
        subject: values.subject,
        topic: values.topic,
        periods: Number(values.periods),
        lessonType,
      };
  
      const res = await axios.post(API_URL, payload); // gửi JSON
  
      const data = res.data?.data ?? res.data;
      const normalized: LessonResponse = normalizeLessonPayload(data);
  
      navigate("/ai/lesson-result", {
        state: { lesson: normalized, subjectLabel, lessonType },
      });
      message.success("Tạo giáo án thành công!");
    } catch (err: any) {
      console.error(err);
      message.error(
        err?.response?.data?.message || "Lỗi khi tạo giáo án, vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
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
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <BookOutlined style={{ fontSize: 36, color: "#E8612A" }} />
        <Title level={2} style={{ color: "#E8612A", marginTop: 8, marginBottom: 8 }}>
          Xây dựng {lessonType}
        </Title>
        <Text>GEN AI giúp bạn xây dựng giáo án theo chuẩn cấu trúc 5512</Text>
      </div>

      <div
        style={{
          border: "1px solid #E8612A",
          borderRadius: "20px",
          padding: "2rem",
          maxWidth: "1000px",
          width: "100%",
        }}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          initialValues={{
            grade: "12",
            subject: "toan",
            topic: subjectTopics["toan"][0],
            periods: "1",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "20px",
            }}
          >
            <Form.Item label={<strong>Chọn lớp</strong>} name="grade" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="10">Lớp 10</Select.Option>
                <Select.Option value="11">Lớp 11</Select.Option>
                <Select.Option value="12">Lớp 12</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label={<strong>Chọn môn</strong>} name="subject" rules={[{ required: true }]}>
              <Select
                value={subject}
                onChange={(value) => {
                  setSubject(value);
                  const firstTopic = subjectTopics[value][0];
                  setTopic(firstTopic);
                  form.setFieldsValue({ topic: firstTopic });
                }}
              >
                <Select.Option value="toan">Toán</Select.Option>
                <Select.Option value="ly">Vật lý</Select.Option>
                <Select.Option value="hoa">Hóa học</Select.Option>
                <Select.Option value="van">Ngữ văn</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label={<strong>Chủ đề</strong>} name="topic" rules={[{ required: true }]}>
              <Select options={topicOptions} value={topic} onChange={(val) => setTopic(val)} />
            </Form.Item>

            <Form.Item label={<strong>Số tiết</strong>} name="periods" rules={[{ required: true }]}>
              <Input placeholder="1" type="number" min={1} />
            </Form.Item>
          </div>

          <div style={{ textAlign: "right", marginTop: 20 }}>
            <Button
              htmlType="submit"
              type="primary"
              disabled={loading}
              style={{
                backgroundColor: "#E8612A",
                borderColor: "#E8612A",
                borderRadius: "999px",
                padding: "0 30px",
                height: "40px",
              }}
            >
              {loading ? <Spin size="small" /> : "BẮT ĐẦU TẠO"}
            </Button>
          </div>
        </Form>
      </div>

      <Text style={{ display: "block", textAlign: "center", marginTop: 24, color: "gray" }}>
        Khi đặt câu hỏi, bạn đồng ý với <a href="#">Điều khoản</a> và <a href="#">Chính sách quyền riêng tư</a>.
      </Text>
    </div>
    </div>
  );
};

export default LessonForm;
