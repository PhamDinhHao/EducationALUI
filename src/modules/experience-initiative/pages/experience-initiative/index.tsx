import React, { useState } from "react";
import { Form, Input, Button, Typography, Spin, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "@/shared/components/Sidebar";

const { Title } = Typography;
const API_URL = "http://localhost:5001/api/v1/plan/initiatives";

const Initiative: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const res = await axios.post(API_URL, values);
      const data = res.data?.data ?? res.data;

      // Điều hướng sang trang kết quả, bạn tự tạo InitiativeResult để render
      navigate("/ai/initiative-result", { state: { initiative: data } });

      message.success("Tạo sáng kiến kinh nghiệm thành công!");
    } catch (err: any) {
      console.error(err);
      message.error(err?.response?.data?.message || "Lỗi khi tạo sáng kiến.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex min-h-screen bg-gray-50'>
      <Sidebar />
      <div className=' w-full p-6 pb-48'>
        <div className='mx-auto max-w-[1100px]'></div>
    <div style={{ padding: 40, background: "#f9f9f9", minHeight: "100vh" }}>
      <div style={{ marginBottom: 20, textAlign: "center" }}>
        <Title level={2} style={{ color: "#ff6600", display: "inline" }}>
          Sáng kiến kinh nghiệm
        </Title>
      </div>

      <div
        style={{
          maxWidth: 600,
          margin: "0 auto",
          background: "#fff",
          padding: 30,
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            label="Môn:"
            name="subject"
            rules={[{ required: true, message: "Vui lòng nhập môn!" }]}
          >
            <Input placeholder="Ví dụ: Toán" style={{ borderRadius: 8 }} />
          </Form.Item>

          <Form.Item label="Tên trường:" name="school">
            <Input placeholder="Ví dụ: THPT" style={{ borderRadius: 8 }} />
          </Form.Item>

          <Form.Item label="Chức vụ:" name="position">
            <Input placeholder="Ví dụ: Giáo viên" style={{ borderRadius: 8 }} />
          </Form.Item>

          <Form.Item label="Họ và tên:" name="fullname">
            <Input placeholder="Ví dụ: Nguyễn Văn A" style={{ borderRadius: 8 }} />
          </Form.Item>

          <Form.Item label="Lĩnh vực áp dụng sáng kiến:" name="field">
            <Input placeholder="Ví dụ: Giáo dục" style={{ borderRadius: 8 }} />
          </Form.Item>

          <Form.Item label="Tên đề tài:" name="title">
            <Input placeholder="Ví dụ: Ứng dụng AI..." style={{ borderRadius: 8 }} />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              disabled={loading}
              style={{
                width: "100%",
                background: "#ff6600",
                borderColor: "#ff6600",
                borderRadius: 20,
                padding: "5px 20px",
              }}
            >
              {loading ? <Spin size="small" /> : "Bắt đầu tạo"}
            </Button>
          </Form.Item>
        </Form>
      </div>
      <p style={{ textAlign: "center", color: "#666", marginTop: 10 }}>
        Khi đã tạo hồ sơ, bạn đồng ý với Điều khoản và Chính sách quyền riêng tư.
      </p>
    </div>
    </div>
    </div>
  );
};

export default Initiative;
