import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBoundStore } from "@/shared/stores/index";
import { Question } from "@/shared/core/types/common.type";

import jsPDF from "jspdf";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

const EXAM_STORAGE_KEY = "exam_data";

const ExamPreview = () => {
  const navigate = useNavigate();
  const storeExam = useBoundStore((state) => state.exam);

  const [exam, setExam] = useState<Question[]>([]);

  // Load dữ liệu từ localStorage hoặc store
  useEffect(() => {
    const data = localStorage.getItem(EXAM_STORAGE_KEY);
    if (data) {
      try {
        let parsed = JSON.parse(data);
        if (parsed && typeof parsed === "object" && parsed.raw) {
          let raw = parsed.raw.replace(/```json|```/g, "").trim();
          parsed = JSON.parse(raw);
        }
        if (Array.isArray(parsed)) {
          setExam(parsed);
          return;
        }
      } catch (err) {
        console.error("Lỗi parse localStorage:", err);
      }
    }
    if (Array.isArray(storeExam) && storeExam.length > 0) {
      setExam(storeExam);
    }
  }, [storeExam]);

  // Lưu lại khi sửa
  const saveExam = () => {
    localStorage.setItem(EXAM_STORAGE_KEY, JSON.stringify(exam));
    alert("Đã lưu đề thi vào localStorage");
  };

  // Chỉnh sửa câu hỏi / đáp án
  const handleEdit = (idx: number, key: keyof Question, value: string) => {
    setExam((prev) => {
      const newExam = [...prev];
      newExam[idx] = { ...newExam[idx], [key]: value };
      return newExam;
    });
  };

  // Chỉnh sửa option
  const handleEditOption = (qIdx: number, optIdx: number, value: string) => {
    setExam((prev) => {
      const newExam = [...prev];
      const options = [...newExam[qIdx].options];
      options[optIdx] = value;
      newExam[qIdx] = { ...newExam[qIdx], options };
      return newExam;
    });
  };

  // Xuất PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    exam.forEach((q, idx) => {
      doc.text(`${idx + 1}. ${q.question}`, 10, 10 + idx * 25);
      if (q.options.length) {
        q.options.forEach((opt, i) =>
          doc.text(`  - ${opt}`, 15, 15 + idx * 25 + i * 5)
        );
      }
      doc.text(`Answer: ${q.answer}`, 10, 20 + idx * 25 + (q.options.length * 5));
    });
    doc.save("exam.pdf");
  };

  // Xuất Word
  const exportWord = async () => {
    const doc = new Document({
      sections: [
        {
          children: exam
            .map((q, idx) => [
              new Paragraph({
                children: [
                  new TextRun({ text: `${idx + 1}. ${q.question}`, bold: true }),
                ],
              }),
              ...q.options.map(
                (opt) => new Paragraph({ children: [new TextRun(`- ${opt}`)] })
              ),
              new Paragraph({
                children: [new TextRun({ text: `Answer: ${q.answer}`, color: "008000" })],
              }),
              new Paragraph({ children: [new TextRun("")] }),
            ])
            .flat(),
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "exam.docx");
  };

  if (!Array.isArray(exam) || exam.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
        <div className="w-full max-w-5xl bg-white p-6 rounded-xl shadow">
          <h1 className="text-2xl font-bold text-orange-600 text-center mb-4">
            Không có đề thi
          </h1>
          <p className="text-center text-gray-600 mb-6">
            Không tìm thấy dữ liệu đề thi. Vui lòng thử lại.
          </p>
          <button
            onClick={() => navigate("/ai/build-structure")}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full"
          >
            Quay lại xây dựng đề
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <div className="w-full max-w-5xl bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold text-orange-600 text-center mb-4">
          📄 Đề thi được tạo
        </h1>
        <div className="flex gap-4 justify-center mb-4">
          <button
            onClick={saveExam}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-full"
          >
            Lưu chỉnh sửa
          </button>
          <button
            onClick={exportPDF}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full"
          >
            Xuất PDF
          </button>
          <button
            onClick={exportWord}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full"
          >
            Xuất Word
          </button>
        </div>
        <ul className="space-y-6">
          {exam.map((q, idx) => (
            <li key={idx} className="p-4 bg-gray-100 rounded shadow">
              <div className="flex justify-between mb-2 text-sm text-gray-500">
                <span>Loại: {q.type}</span>
                <span>Mức độ: {q.level}</span>
              </div>

              <input
                type="text"
                value={q.question}
                onChange={(e) => handleEdit(idx, "question", e.target.value)}
                className="w-full mb-2 p-1 border rounded"
              />

              {Array.isArray(q.options) && q.options.length > 0 && (
                <ul className="ml-4 list-disc mb-2">
                  {q.options.map((opt, i) => (
                    <li key={i}>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => handleEditOption(idx, i, e.target.value)}
                        className="w-full p-1 border rounded"
                      />
                    </li>
                  ))}
                </ul>
              )}

              <input
                type="text"
                value={q.answer}
                onChange={(e) => handleEdit(idx, "answer", e.target.value)}
                className="w-full p-1 border rounded text-green-600"
              />
            </li>
          ))}
        </ul>
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => navigate("/ai/build-structure")}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full"
          >
            Quay lại xây dựng đề
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamPreview;
