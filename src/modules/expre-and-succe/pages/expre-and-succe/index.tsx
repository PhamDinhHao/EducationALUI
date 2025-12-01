import React from "react";
import {
  Typography,
  Card,
  Row,
  Col,
} from "antd";
import { useNavigate } from "react-router-dom";
import {
  BookOutlined,
} from "@ant-design/icons";
import Sidebar from "@/shared/components/Sidebar";

const { Title } = Typography;

const ExpreAndSucce: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 px-6 py-8 flex justify-center items-center">
        <div className="mx-auto max-w-5xl">
          <BookOutlined className="text-orange-500 flex justify-center items-center" style={{ fontSize: 72 }} />
          
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
        </div>
      </div>
    </div>
  );
};

export default ExpreAndSucce;
