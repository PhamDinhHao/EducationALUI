import { Typography, Card, Row, Col, Input } from "antd";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const ExpreAndSucce = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 40, textAlign: "center", background: "#f9f9f9" }}>
      <div style={{ marginBottom: 20 }}>
        <Title level={2} style={{ color: "#ff6600", display: "inline" }}>
          Kế hoạch cá nhân & Sáng kiến kinh nghiệm
        </Title>
      </div>

      <p style={{ marginBottom: 30 }}>Chọn nội dung mà bạn muốn tạo</p>

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

      <div style={{ textAlign: "center" }}>
        <Input
          placeholder="Nhập dữ liệu, bấm đổi ývới Điều khoản và Chính sách quyền riêng tư."
          style={{ width: "100%", maxWidth: 500, borderRadius: 25, padding: "5px 15px" }}
          suffix={
            <img
              src="https://img.icons8.com/ios-filled/20/000000/image.png"
              alt="Attach"
              style={{ cursor: "pointer" }}
            />
          }
        />
      </div>
    </div>
  );
};

export default ExpreAndSucce;