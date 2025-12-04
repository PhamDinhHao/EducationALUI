import React, { useState } from "react";
import { Download, ArrowLeft, Plus, Trash2, Edit3 } from "lucide-react";

// Types
interface LessonData {
  title: string;
  school: string;
  department: string;
  teacher: string;
  subject: string;
  grade: string;
  periods: number;
  knowledge: string[];
  generalCompetencies: string[];
  subjectCompetencies: string[];
  digitalCompetencies: string[];
  qualities: string[];
  teacherEquipment: string[];
  studentEquipment: string[];
  activity1: {
    objectives: string[];
    content: string[];
    products: string[];
    steps: {
      step1: string[];
      step2: string[];
      step3: string[];
      step4: string[];
      expectedProducts: string[];
    };
  };
  activity2: {
    subActivities: Array<{
      title: string;
      objectives: string[];
      content: string[];
      products: string[];
      steps: {
        step1: string[];
        step2: string[];
        step3: string[];
        step4: string[];
        expectedProducts: string[];
      };
    }>;
  };
  activity3: {
    objectives: string[];
    content: string[];
    products: string[];
    steps: string[];
  };
  activity4: {
    objectives: string[];
    content: string[];
    products: string[];
    steps: string[];
  };
  worksheet: {
    tasks: string[];
    groupAssignments: string[];
  };
  quiz: {
    questions: Array<{
      question: string;
      options: string[];
      answer: string;
    }>;
  };
}

const LessonResultEnhanced: React.FC = () => {
  const [lesson, setLesson] = useState<LessonData>({
    title: "CẤU TRÚC CỦA CHẤT",
    school: "THPT ABC",
    department: "Vật lý - Kỹ thuật",
    teacher: "Nguyễn Văn A",
    subject: "Vật lý",
    grade: "12",
    periods: 2,
    knowledge: [
      "Mô tả được các mô hình nguyên tử Rutherford-Bohr và các tiên đề Bohr.",
      "Nêu được khái niệm về lượng tử năng lượng.",
      "Giải thích được sự hình thành quang phổ vạch của nguyên tử Hidro."
    ],
    generalCompetencies: [
      "Tự chủ và tự học: Chủ động tìm kiếm thông tin, đọc tài liệu.",
      "Giao tiếp và hợp tác: Thảo luận, chia sẻ ý tưởng, làm việc nhóm hiệu quả."
    ],
    subjectCompetencies: [
      "Nhận thức Vật lý: Mô tả, giải thích các khái niệm về cấu trúc nguyên tử.",
      "Vận dụng kiến thức: Giải các bài tập về cấu trúc chất."
    ],
    digitalCompetencies: [
      "Sử dụng công cụ số để tìm kiếm, xử lý thông tin.",
      "Giao tiếp và hợp tác trên môi trường số."
    ],
    qualities: [
      "Yêu nước: Tự hào về thành tựu khoa học Việt Nam.",
      "Chăm chỉ: Tự giác, tích cực trong học tập."
    ],
    teacherEquipment: [
      "Giáo án, sách giáo khoa Vật lý 12",
      "Máy chiếu, bảng, phấn",
      "Video minh họa về mô hình nguyên tử"
    ],
    studentEquipment: [
      "Sách giáo khoa Vật lý 12",
      "Vở ghi, bút",
      "Chuẩn bị bài trước khi đến lớp"
    ],
    activity1: {
      objectives: ["Tạo hứng thú cho học sinh", "Ôn lại kiến thức cũ"],
      content: ["Đặt câu hỏi về cấu tạo chất", "Chiếu video về lịch sử mô hình nguyên tử"],
      products: ["Câu trả lời của học sinh", "Ý kiến thảo luận"],
      steps: {
        step1: [
          "GV đặt câu hỏi: 'Theo các em, chất được cấu tạo từ những hạt nào?'",
          "GV chiếu video về lịch sử phát triển mô hình nguyên tử"
        ],
        step2: [
          "HS suy nghĩ, trả lời câu hỏi",
          "HS xem video và ghi chép thông tin quan trọng"
        ],
        step3: [
          "GV gọi một vài HS trả lời câu hỏi",
          "GV tổ chức thảo luận về các mô hình nguyên tử"
        ],
        step4: [
          "GV tổng hợp ý kiến của HS",
          "GV dẫn dắt vào bài mới"
        ],
        expectedProducts: [
          "Câu trả lời của HS về cấu tạo chất",
          "Ghi chép về các mô hình nguyên tử"
        ]
      }
    },
    activity2: {
      subActivities: [
        {
          title: "Mô hình nguyên tử Rutherford-Bohr",
          objectives: ["Trình bày được mô hình Rutherford-Bohr", "Phát biểu được các tiên đề Bohr"],
          content: ["Thí nghiệm tán xạ alpha", "Các tiên đề Bohr"],
          products: ["Ghi chép về mô hình và tiên đề", "Câu trả lời của HS"],
          steps: {
            step1: [
              "GV trình bày thí nghiệm tán xạ alpha của Rutherford",
              "GV giới thiệu mô hình nguyên tử Rutherford-Bohr"
            ],
            step2: [
              "HS lắng nghe, ghi chép về mô hình nguyên tử",
              "HS đặt câu hỏi nếu chưa rõ"
            ],
            step3: [
              "GV gọi HS trình bày lại mô hình",
              "GV đặt câu hỏi kiểm tra mức độ hiểu bài"
            ],
            step4: [
              "GV tổng hợp kiến thức về mô hình Rutherford-Bohr",
              "GV nhấn mạnh vai trò của các tiên đề Bohr"
            ],
            expectedProducts: [
              "Ghi chép về thí nghiệm Rutherford",
              "Câu trả lời về các tiên đề Bohr"
            ]
          }
        }
      ]
    },
    activity3: {
      objectives: ["Củng cố kiến thức về cấu trúc nguyên tử", "Rèn luyện kỹ năng giải bài tập"],
      content: ["Bài tập trắc nghiệm và tự luận"],
      products: ["Bài làm của học sinh"],
      steps: [
        "Bước 1: GV phát phiếu bài tập, chia nhóm, hướng dẫn",
        "Bước 2: HS làm việc cá nhân và nhóm",
        "Bước 3: Đại diện nhóm trình bày, HS nhận xét",
        "Bước 4: GV nhận xét, sửa lỗi, chốt kiến thức"
      ]
    },
    activity4: {
      objectives: ["Vận dụng kiến thức vào thực tế"],
      content: ["Tìm hiểu ứng dụng đồng vị phóng xạ", "Thảo luận về năng lượng hạt nhân"],
      products: ["Bài thuyết trình về ứng dụng"],
      steps: [
        "GV giao nhiệm vụ tìm hiểu về nhà",
        "HS thu thập thông tin, chuẩn bị bài thuyết trình",
        "GV tổ chức buổi thuyết trình trên lớp",
        "GV nhận xét, đánh giá kết quả"
      ]
    },
    worksheet: {
      tasks: [
        "Bài 1: Trình bày các tiên đề Bohr",
        "Bài 2: Giải thích sự hình thành quang phổ vạch",
        "Bài 3: Tính số khối và số hiệu nguyên tử"
      ],
      groupAssignments: [
        "Nhóm 1: Bài 1",
        "Nhóm 2: Bài 2",
        "Nhóm 3: Bài 3"
      ]
    },
    quiz: {
      questions: [
        {
          question: "Hạt nhân nguyên tử được cấu tạo từ:",
          options: ["A. Proton và electron", "B. Neutron và electron", "C. Proton và neutron", "D. Proton, neutron và electron"],
          answer: "C"
        },
        {
          question: "Năng lượng liên kết của hạt nhân là:",
          options: ["A. Năng lượng tỏa ra khi các nucleon liên kết", "B. Năng lượng cần thiết để phá vỡ hạt nhân", "C. Năng lượng liên kết electron", "D. Tổng động năng nucleon"],
          answer: "B"
        }
      ]
    }
  });

  const [editMode, setEditMode] = useState<string | null>(null);

  const updateField = (path: string, value: any) => {
    const keys = path.split('.');
    setLesson(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      let current = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  const addItem = (path: string, defaultValue: any) => {
    const keys = path.split('.');
    setLesson(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      let current = updated;
      for (const key of keys) {
        current = current[key];
      }
      current.push(defaultValue);
      return updated;
    });
  };

  const removeItem = (path: string, index: number) => {
    const keys = path.split('.');
    setLesson(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      let current = updated;
      for (const key of keys) {
        current = current[key];
      }
      current.splice(index, 1);
      return updated;
    });
  };

  const exportToWord = () => {
    // Tạo nội dung Word với định dạng đầy đủ
    let content = `
KẾ HOẠCH BÀI DẠY

Trường: ${lesson.school}
Tổ: ${lesson.department}
Giáo viên: ${lesson.teacher}

TÊN BÀI DẠY: ${lesson.title}
Môn: ${lesson.subject}; Lớp: ${lesson.grade}
Thời lượng: ${lesson.periods} tiết

I. Mục tiêu

1. Kiến thức:
${lesson.knowledge.map(k => `   • ${k}`).join('\n')}

2. Năng lực:

2.1. Năng lực chung:
${lesson.generalCompetencies.map(c => `   • ${c}`).join('\n')}

2.2. Năng lực Vật lý:
${lesson.subjectCompetencies.map(c => `   • ${c}`).join('\n')}

2.3. Năng lực số (theo Thông tư 02/2025/TT-BGDĐT):
${lesson.digitalCompetencies.map(c => `   • ${c}`).join('\n')}

3. Phẩm chất:
${lesson.qualities.map(q => `   • ${q}`).join('\n')}

II. Thiết bị dạy học và học liệu

Giáo viên:
${lesson.teacherEquipment.map(e => `   • ${e}`).join('\n')}

Học sinh:
${lesson.studentEquipment.map(e => `   • ${e}`).join('\n')}

III. Tiến trình dạy học

Hoạt động 1: Khởi động

a) Mục tiêu:
${lesson.activity1.objectives.map(o => `   • ${o}`).join('\n')}

b) Nội dung:
${lesson.activity1.content.map(c => `   • ${c}`).join('\n')}

c) Sản phẩm:
${lesson.activity1.products.map(p => `   • ${p}`).join('\n')}

Tổ chức thực hiện:

Bước 1. Giáo viên giao nhiệm vụ
${lesson.activity1.steps.step1.map(s => `- ${s}`).join('\n')}

Bước 2. Học sinh thực hiện nhiệm vụ
${lesson.activity1.steps.step2.map(s => `- ${s}`).join('\n')}

Bước 3. Giáo viên tổ chức báo cáo và thảo luận
${lesson.activity1.steps.step3.map(s => `- ${s}`).join('\n')}

Bước 4. Kết luận
${lesson.activity1.steps.step4.map(s => `- ${s}`).join('\n')}

Dự kiến sản phẩm:
${lesson.activity1.steps.expectedProducts.map(p => `- ${p}`).join('\n')}

PHIẾU HỌC TẬP

${lesson.worksheet.tasks.map(t => `${t}`).join('\n\n')}

Phân công nhiệm vụ:
${lesson.worksheet.groupAssignments.map(g => `• ${g}`).join('\n')}

CÂU HỎI TRẮC NGHIỆM

${lesson.quiz.questions.map((q, i) => `
Câu ${i + 1}: ${q.question}
${q.options.join('\n')}
`).join('\n')}

Đáp án: ${lesson.quiz.questions.map((q, i) => `${i + 1}.${q.answer}`).join(', ')}
`;

    // Tạo blob và download
    const blob = new Blob([content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${lesson.title}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-6 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <h2 className="text-xl font-bold text-orange-600 mb-4 flex items-center gap-2">
        <Edit3 size={20} />
        {title}
      </h2>
      {children}
    </div>
  );

  const EditableList = ({ items, path, placeholder }: { items: string[]; path: string; placeholder: string }) => (
    <div className="space-y-2">
      {items.map((item, idx) => (
        <div key={idx} className="flex gap-2">
          <input
            type="text"
            value={item}
            onChange={(e) => {
              const newItems = [...items];
              newItems[idx] = e.target.value;
              updateField(path, newItems);
            }}
            className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
            placeholder={placeholder}
          />
          <button
            onClick={() => removeItem(path, idx)}
            className="text-red-500 hover:text-red-700 p-2"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}
      <button
        onClick={() => addItem(path, "")}
        className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
      >
        <Plus size={18} />
        Thêm mục
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-center text-orange-600 mb-6">
            📘 KẾ HOẠCH BÀI DẠY
          </h1>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              value={lesson.school}
              onChange={(e) => updateField('school', e.target.value)}
              placeholder="Trường"
              className="p-2 border rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
            />
            <input
              type="text"
              value={lesson.department}
              onChange={(e) => updateField('department', e.target.value)}
              placeholder="Tổ"
              className="p-2 border rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
            />
            <input
              type="text"
              value={lesson.teacher}
              onChange={(e) => updateField('teacher', e.target.value)}
              placeholder="Giáo viên"
              className="p-2 border rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
            />
            <input
              type="text"
              value={lesson.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Tên bài dạy"
              className="p-2 border rounded-lg focus:ring-2 focus:ring-orange-400 outline-none font-semibold"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <input
              type="text"
              value={lesson.subject}
              onChange={(e) => updateField('subject', e.target.value)}
              placeholder="Môn"
              className="p-2 border rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
            />
            <input
              type="text"
              value={lesson.grade}
              onChange={(e) => updateField('grade', e.target.value)}
              placeholder="Lớp"
              className="p-2 border rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
            />
            <input
              type="number"
              value={lesson.periods}
              onChange={(e) => updateField('periods', Number(e.target.value))}
              placeholder="Số tiết"
              className="p-2 border rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
            />
          </div>
        </div>

        {/* I. Mục tiêu */}
        <Section title="I. Mục tiêu">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">1. Kiến thức:</h3>
              <EditableList items={lesson.knowledge} path="knowledge" placeholder="Nhập kiến thức..." />
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">2.1. Năng lực chung:</h3>
              <EditableList items={lesson.generalCompetencies} path="generalCompetencies" placeholder="Nhập năng lực chung..." />
            </div>

            <div>
              <h3 className="font-semibold mb-2">2.2. Năng lực môn học:</h3>
              <EditableList items={lesson.subjectCompetencies} path="subjectCompetencies" placeholder="Nhập năng lực môn học..." />
            </div>

            <div>
              <h3 className="font-semibold mb-2">2.3. Năng lực số:</h3>
              <EditableList items={lesson.digitalCompetencies} path="digitalCompetencies" placeholder="Nhập năng lực số..." />
            </div>

            <div>
              <h3 className="font-semibold mb-2">3. Phẩm chất:</h3>
              <EditableList items={lesson.qualities} path="qualities" placeholder="Nhập phẩm chất..." />
            </div>
          </div>
        </Section>

        {/* II. Thiết bị */}
        <Section title="II. Thiết bị dạy học và học liệu">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Giáo viên:</h3>
              <EditableList items={lesson.teacherEquipment} path="teacherEquipment" placeholder="Thiết bị GV..." />
            </div>
            <div>
              <h3 className="font-semibold mb-2">Học sinh:</h3>
              <EditableList items={lesson.studentEquipment} path="studentEquipment" placeholder="Thiết bị HS..." />
            </div>
          </div>
        </Section>

        {/* III. Tiến trình */}
        <Section title="III. Tiến trình dạy học">
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-3">Hoạt động 1: Khởi động</h3>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-sm mb-1">a) Mục tiêu:</p>
                  <EditableList items={lesson.activity1.objectives} path="activity1.objectives" placeholder="Mục tiêu..." />
                </div>
                <div>
                  <p className="font-semibold text-sm mb-1">b) Nội dung:</p>
                  <EditableList items={lesson.activity1.content} path="activity1.content" placeholder="Nội dung..." />
                </div>
                <div>
                  <p className="font-semibold text-sm mb-1">c) Sản phẩm:</p>
                  <EditableList items={lesson.activity1.products} path="activity1.products" placeholder="Sản phẩm..." />
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-3">Hoạt động 3: Luyện tập</h3>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-sm mb-1">Mục tiêu:</p>
                  <EditableList items={lesson.activity3.objectives} path="activity3.objectives" placeholder="Mục tiêu..." />
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-3">Hoạt động 4: Vận dụng</h3>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-sm mb-1">Mục tiêu:</p>
                  <EditableList items={lesson.activity4.objectives} path="activity4.objectives" placeholder="Mục tiêu..." />
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Phiếu học tập */}
        <Section title="PHIẾU HỌC TẬP">
          <EditableList items={lesson.worksheet.tasks} path="worksheet.tasks" placeholder="Bài tập..." />
          <div className="mt-4">
            <p className="font-semibold mb-2">Phân công nhóm:</p>
            <EditableList items={lesson.worksheet.groupAssignments} path="worksheet.groupAssignments" placeholder="Phân công..." />
          </div>
        </Section>

        {/* Câu hỏi trắc nghiệm */}
        <Section title="CÂU HỎI TRẮC NGHIỆM">
          {lesson.quiz.questions.map((q, idx) => (
            <div key={idx} className="mb-4 p-4 bg-gray-50 rounded-lg">
              <input
                type="text"
                value={q.question}
                onChange={(e) => {
                  const newQuestions = [...lesson.quiz.questions];
                  newQuestions[idx].question = e.target.value;
                  updateField('quiz.questions', newQuestions);
                }}
                className="w-full p-2 border rounded-lg mb-2"
                placeholder="Câu hỏi..."
              />
              {q.options.map((opt, optIdx) => (
                <input
                  key={optIdx}
                  type="text"
                  value={opt}
                  onChange={(e) => {
                    const newQuestions = [...lesson.quiz.questions];
                    newQuestions[idx].options[optIdx] = e.target.value;
                    updateField('quiz.questions', newQuestions);
                  }}
                  className="w-full p-2 border rounded-lg mb-1"
                  placeholder={`Đáp án ${String.fromCharCode(65 + optIdx)}`}
                />
              ))}
              <input
                type="text"
                value={q.answer}
                onChange={(e) => {
                  const newQuestions = [...lesson.quiz.questions];
                  newQuestions[idx].answer = e.target.value;
                  updateField('quiz.questions', newQuestions);
                }}
                className="w-24 p-2 border rounded-lg mt-2"
                placeholder="Đáp án đúng"
              />
            </div>
          ))}
        </Section>

        {/* Actions */}
        <div className="flex justify-center gap-4 mt-8 sticky bottom-6">
          <button
            onClick={exportToWord}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg shadow-lg font-semibold transition"
          >
            <Download size={20} />
            Tải xuống Word
          </button>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg shadow-lg font-semibold transition"
          >
            <ArrowLeft size={20} />
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonResultEnhanced;