import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Typography, Button, Divider, Input, Space } from "antd";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

const { Title } = Typography;
const { TextArea } = Input;

// Chuyển Markdown thành text dễ đọc
const formatMarkdown = (text: string) => {
  if (!text) return "";
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")  // loại bỏ bold
    .replace(/^\* (.*)$/gm, "- $1")   // chuyển danh sách * thành -
    .replace(/^\s*\*{4,}/gm, "")      // loại bỏ dấu * dư thừa
    .replace(/\\n/g, "\n")            // chuyển \n thành xuống dòng
    .trim();
};

const PlanResultEditable: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;

  const [content, setContent] = useState<string>(formatMarkdown(data?.result));

  if (!data || !data.result) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <Title level={3}>Không có dữ liệu kế hoạch cá nhân</Title>
        <Button type="primary" onClick={() => navigate(-1)}>
          Quay lại
        </Button>
      </div>
    );
  }

  const exportWord = async () => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              text: "KẾ HOẠCH CÁ NHÂN",
              heading: "Heading1",
              alignment: "center",
            }),
            new Paragraph({ text: "" }),
            ...content.split("\n").map(
              (line) =>
                new Paragraph({
                  children: [new TextRun(line)],
                })
            ),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "KeHoachCaNhan.docx");
  };

  return (
    <div style={{ padding: 40, background: "#f9f9f9", minHeight: "100vh" }}>
      <div
        style={{
          maxWidth: 800,
          margin: "0 auto",
          background: "#fff",
          padding: 30,
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <img
            src="https://img.icons8.com/ios-filled/50/000000/open-book.png"
            alt="Logo"
            style={{ verticalAlign: "middle", marginRight: 10 }}
          />
          <Title level={2} style={{ color: "#ff6600", display: "inline" }}>
            KẾ HOẠCH CÁ NHÂN
          </Title>
        </div>

        <Divider />

        <TextArea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          autoSize={{ minRows: 20, maxRows: 40 }}
          style={{ fontSize: 16, lineHeight: 1.6, marginBottom: 20 }}
        />

        <Divider />

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Space>
            <Button type="primary" onClick={() => navigate(-1)}>
              Quay lại
            </Button>
            <Button type="default" onClick={exportWord}>
              Xuất Word
            </Button>
          </Space>
        </div>
      </div>
    </div>
  );
};

export default PlanResultEditable;
