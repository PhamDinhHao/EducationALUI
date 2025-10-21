import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Typography, Button, Divider, Input, Space } from "antd";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import Sidebar from "@/shared/components/Sidebar";

const { Title } = Typography;
const { TextArea } = Input;

// Hàm format Markdown thành text thuần
const formatMarkdown = (text: string) => {
  if (!text) return "";
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")  // loại bỏ bold
    .replace(/^\* (.*)$/gm, "- $1")   // danh sách * -> -
    .replace(/\\n/g, "\n")
    .trim();
};

const InitiativeResultEditable: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;

  // Lấy đúng key 'result' từ API trả về
  const rawText =
    typeof data?.initiative?.result === "string" ? data.initiative.result : "";

  const [content, setContent] = useState<string>(formatMarkdown(rawText));

  if (!rawText) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <Title level={3}>Không có dữ liệu sáng kiến</Title>
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
              text: "SÁNG KIẾN KINH NGHIỆM",
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
    saveAs(blob, "SangKienKinhNghiem.docx");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="w-full p-6 pb-48">
        <div className="max-w-[1100px] mx-auto">
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
          <Title level={2} style={{ color: "#ff6600", display: "inline" }}>
            SÁNG KIẾN KINH NGHIỆM
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
            <Button type="primary" onClick={() => navigate("/ai/expre-and-succe")}>
              Quay lại
            </Button>
            <Button type="default" onClick={exportWord}>
              Xuất Word
            </Button>
          </Space>
        </div>
      </div>
    </div>
    </div>
    </div>
    </div>
  );
};

export default InitiativeResultEditable;
