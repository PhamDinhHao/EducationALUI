import { useState } from "react";
import { Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useBoundStore } from "@/shared/stores/index";

const levels = ["Nhận biết", "Thông hiểu", "Vận dụng", "Vận dụng cao"];
const types = ["Nhiều phương án lựa chọn", "Trắc nghiệm đúng sai", "Trả lời ngắn"];

interface Matrix {
  [type: string]: { [level: string]: number };
}

// ✅ Hàm khởi tạo matrix mặc định
const initMatrix: Matrix = types.reduce((acc, type) => {
  acc[type] = levels.reduce((obj, level) => {
    obj[level] = 2; // mặc định 2 câu mỗi level
    return obj;
  }, {} as { [level: string]: number });
  return acc;
}, {} as Matrix);

const BuildStructure = () => {
  const [matrix, setMatrix] = useState<Matrix>(initMatrix);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const setExam = useBoundStore((state) => state.setExam);

  const handleChange = (type: string, level: string, value: number) => {
    setMatrix((prev) => ({
      ...prev,
      [type]: { ...prev[type], [level]: value },
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) return alert("Hãy chọn file PDF hoặc Word!");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("matrix", JSON.stringify(matrix));

      const res = await axios.post("http://localhost:5001/api/v1/gemini/generate", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setExam(res.data);
      navigate("/ai/exam-preview");
    } catch (err) {
      console.error(err);
      alert("Lỗi khi tạo đề!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 m-6 flex flex-col items-center">
      <div className="w-full max-w-5xl bg-white p-12 rounded-xl shadow overflow-y-auto">
        <h1 className="text-2xl font-bold text-orange-600 text-center mb-2">
          🎓 Xây dựng đề
        </h1>
        <p className="text-center text-gray-600 mb-6">
          GEN AI giúp bạn xây dựng đề theo chuẩn cấu trúc 5512
        </p>

        {/* Upload file */}
        <label
          htmlFor="fileUpload"
          className="border-2 border-dashed border-orange-400 rounded-xl p-16 flex flex-col items-center justify-center cursor-pointer hover:bg-orange-50 transition mb-6"
        >
          <Upload className="w-12 h-12 text-gray-500 mb-2" />
          <p className="text-gray-700 font-medium">
            Click để up file tài liệu của bạn lên đây
          </p>
          <input
            id="fileUpload"
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
        {file && (
          <p className="text-center text-green-600 font-semibold mb-6">📂 {file.name}</p>
        )}

        {/* Ma trận câu hỏi */}
        {types.map((type, i) => (
          <div key={i} className="mb-6 border-b pb-4">
            <h2 className="text-lg font-semibold text-orange-500 mb-2">{type}</h2>
            <div className="grid grid-cols-4 gap-4">
              {levels.map((level) => (
                <div key={level} className="flex flex-col items-center">
                  <span className="text-sm text-gray-600">{level}</span>
                  <input
                    type="number"
                    min={0}
                    value={matrix[type][level]} // ✅ dùng value thay vì defaultValue
                    className="w-16 border rounded text-center mt-1"
                    onChange={(e) => handleChange(type, level, Number(e.target.value))}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Nút duy nhất */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full shadow-md transition"
          >
            {loading ? "Đang tạo..." : "Tạo đề"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuildStructure;
