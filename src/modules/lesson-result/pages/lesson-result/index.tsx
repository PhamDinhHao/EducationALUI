import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";
import Sidebar from "@/shared/components/Sidebar";

type Activity = {
  step: string;
  description: string;
};

interface LessonResponse {
  id?: number;
  title: string;
  subject: string;
  grade: string;
  topic: string;
  periods: number;
  objectives: string[];
  activities: Activity[];
  assessment?: string;
}

const ensureLessonShape = (raw: any): LessonResponse => {
  const objectives: string[] = Array.isArray(raw?.objectives)
    ? raw.objectives.map((o: any) => String(o))
    : [];

  const activities: Activity[] = Array.isArray(raw?.activities)
    ? raw.activities.map((a: any) => {
        if (typeof a === "string") return { step: "", description: a };
        return {
          step: a?.step ? String(a.step) : "",
          description: a?.description ? String(a.description) : "",
        };
      })
    : [];

  return {
    id: raw?.id,
    title: String(raw?.title ?? ""),
    subject: String(raw?.subject ?? ""),
    grade: String(raw?.grade ?? ""),
    topic: String(raw?.topic ?? ""),
    periods: Number(raw?.periods) || 1,
    objectives,
    activities,
    assessment: raw?.assessment ? String(raw.assessment) : "",
  };
};

const LessonResult: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const lessonFromState = (location.state?.lesson as LessonResponse | undefined) ?? undefined;

  const [editableLesson, setEditableLesson] = useState<LessonResponse | null>(
    lessonFromState ? ensureLessonShape(lessonFromState) : null
  );

  useEffect(() => {
    if (lessonFromState) setEditableLesson(ensureLessonShape(lessonFromState));
  }, [lessonFromState]);

  if (!editableLesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white shadow rounded-xl p-6 max-w-lg text-center">
          <h1 className="text-xl font-bold text-orange-600 mb-2">Không có dữ liệu giáo án</h1>
          <p className="text-gray-600 mb-4">Vui lòng quay lại và tạo giáo án mới.</p>
          <button
            onClick={() => navigate("/ai/build-lesson")}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full"
          >
            Quay lại tạo giáo án
          </button>
        </div>
      </div>
    );
  }

  const handleChange = <K extends keyof LessonResponse>(key: K, value: LessonResponse[K]) => {
    setEditableLesson((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleObjectiveChange = (idx: number, value: string) => {
    const next = [...editableLesson.objectives];
    next[idx] = value;
    handleChange("objectives", next);
  };

  const addObjective = () => handleChange("objectives", [...editableLesson.objectives, ""]);
  const removeObjective = (idx: number) =>
    handleChange(
      "objectives",
      editableLesson.objectives.filter((_, i) => i !== idx)
    );

  const handleActivityChange = (idx: number, field: keyof Activity, value: string) => {
    const next = editableLesson.activities.map((a, i) =>
      i === idx ? { ...a, [field]: value } : a
    );
    handleChange("activities", next);
  };

  const addActivity = () =>
    handleChange("activities", [...editableLesson.activities, { step: "", description: "" }]);
  const removeActivity = (idx: number) =>
    handleChange(
      "activities",
      editableLesson.activities.filter((_, i) => i !== idx)
    );

  const exportToWord = async () => {
    const L = editableLesson;

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [new TextRun({ text: L.title || "Giáo án", bold: true, size: 32 })],
            }),
            new Paragraph({ text: "" }),
            new Paragraph({ text: `Môn: ${L.subject}` }),
            new Paragraph({ text: `Lớp: ${L.grade}` }),
            new Paragraph({ text: `Chủ đề: ${L.topic}` }),
            new Paragraph({ text: `Số tiết: ${L.periods}` }),
            new Paragraph({ text: "" }),
            new Paragraph({ children: [new TextRun({ text: "Mục tiêu", bold: true })] }),
            ...L.objectives.map((obj) => new Paragraph({ text: obj, bullet: { level: 0 } })),
            new Paragraph({ text: "" }),
            new Paragraph({ children: [new TextRun({ text: "Hoạt động", bold: true })] }),
            ...L.activities.flatMap((act) => {
              const items: Paragraph[] = [];
              if (act.step) {
                items.push(new Paragraph({ children: [new TextRun({ text: act.step, bold: true })] }));
              }
              if (act.description) {
                items.push(new Paragraph({ text: act.description, bullet: { level: 1 } }));
              }
              return items;
            }),
            new Paragraph({ text: "" }),
            ...(L.assessment
              ? [
                  new Paragraph({ children: [new TextRun({ text: "Đánh giá", bold: true })] }),
                  new Paragraph({ text: L.assessment }),
                ]
              : []),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${L.title || "GiaoAn"}.docx`);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="w-full p-6 pb-48">
        <div className="max-w-[1100px] mx-auto">
    <div className="min-h-screen p-6 flex flex-col items-center">
      <div className="w-full max-w-5xl bg-white p-6 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-orange-600 text-center mb-8">
          📘 Xem & Chỉnh sửa Giáo án
        </h1>

        {/* Thông tin cơ bản */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {["title", "subject", "grade", "topic"].map((field, idx) => (
            <input
              key={idx}
              type="text"
              value={editableLesson[field as keyof LessonResponse] as string}
              onChange={(e) => handleChange(field as keyof LessonResponse, e.target.value)}
              placeholder={["Tiêu đề", "Môn học", "Lớp", "Chủ đề"][idx]}
              className="p-3 border rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
            />
          ))}
          <input
            type="number"
            value={editableLesson.periods}
            onChange={(e) => handleChange("periods", Number(e.target.value))}
            placeholder="Số tiết"
            className="p-3 border rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
          />
        </div>

        {/* Mục tiêu */}
        <div className="mb-8 bg-gray-50 p-4 rounded-xl border">
          <h2 className="font-semibold text-xl mb-3">🎯 Mục tiêu</h2>
          <ul className="space-y-3">
            {editableLesson.objectives.map((obj, idx) => (
              <li key={idx} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={obj}
                  onChange={(e) => handleObjectiveChange(idx, e.target.value)}
                  className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
                />
                <button
                  onClick={() => removeObjective(idx)}
                  className="text-gray-400 hover:text-red-500 transition p-1"
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={addObjective}
            className="mt-3 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
          >
            + Thêm mục tiêu
          </button>
        </div>

        {/* Hoạt động */}
        <div className="mb-8 bg-gray-50 p-4 rounded-xl border">
          <h2 className="font-semibold text-xl mb-3">📝 Hoạt động</h2>
          <ul className="space-y-3">
            {editableLesson.activities.map((act, idx) => (
              <li key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                <input
                  type="text"
                  placeholder="Tên hoạt động"
                  value={act.step}
                  onChange={(e) => handleActivityChange(idx, "step", e.target.value)}
                  className="p-2 border rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
                />
                <input
                  type="text"
                  placeholder="Mô tả"
                  value={act.description}
                  onChange={(e) => handleActivityChange(idx, "description", e.target.value)}
                  className="p-2 border rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
                />
                <button
                  onClick={() => removeActivity(idx)}
                  className="text-gray-400 hover:text-red-500 transition p-1"
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={addActivity}
            className="mt-3 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
          >
            + Thêm hoạt động
          </button>
        </div>

        {/* Đánh giá */}
        <div className="mb-8 bg-gray-50 p-4 rounded-xl border">
          <h2 className="font-semibold text-xl mb-3">✅ Đánh giá</h2>
          <textarea
            rows={4}
            value={editableLesson.assessment}
            onChange={(e) => handleChange("assessment", e.target.value)}
            placeholder="Mô tả cách đánh giá (kiểm tra, bài tập, dự án...)"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
          />
        </div>

        {/* Action */}
        <div className="flex justify-center gap-4">
          <button
            onClick={exportToWord}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg shadow"
          >
            Xuất Word
          </button>
          <button
            onClick={() => navigate("/ai/build-lesson")}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg shadow"
          >
            Quay lại tạo giáo án
          </button>
        </div>
      </div>
    </div>
    </div>
    </div>
    </div>
  );
};

export default LessonResult;
