import { useRef, useState, useEffect } from 'react'
import { Card, Typography, Select, Input, Button, Spin, Tooltip, message } from 'antd'
import { SendOutlined, BulbOutlined, BranchesOutlined } from '@ant-design/icons'
import jsMind from 'jsmind'

import 'jsmind/style/jsmind.css'
import Sidebar from '@/shared/components/Sidebar'
import { GeminiService } from '@/modules/ai/pages/ai/Service/gemini.service'



const { Title, Text } = Typography

const GRADES = Array.from({ length: 12 }, (_, i) => ({ label: `${i + 1}`, value: `${i + 1}` }))

const SUBJECTS = [
  { label: 'Toán', value: 'math' },
  { label: 'Vật lý', value: 'physics' },
  { label: 'Hóa học', value: 'chemistry' },
  { label: 'Sinh học', value: 'biology' },
  { label: 'Địa lý', value: 'geography' },
  { label: 'Lịch sử', value: 'history' }
]

const MINDMAP_TYPES = [
  {
    key: 'standard',
    title: 'Mindmap Tiêu chuẩn',
    description: 'Mindmap cơ bản với cấu trúc đơn giản',
    icon: <BulbOutlined style={{ fontSize: 32, color: '#f59e0b' }} />,
    color: '#f59e0b'
  },
  {
    key: 'gdpt2018',
    title: 'Mindmap chương trình GDPT 2018',
    description: 'Mindmap theo chuẩn chương trình giáo dục phổ thông 2018',
    icon: <BranchesOutlined style={{ fontSize: 32, color: '#f97316' }} />,
    color: '#f97316'
  }
]

// 🔹 Hàm convert Gemini JSON -> jsMind JSON
function convertToJsMind(json: any, idPrefix = "node"): any {
  let nodeIdCounter = 0;

  function walk(node: any, depth = 0): any {
    const id = `${idPrefix}-${nodeIdCounter++}`;
  
    // 🎨 Màu theo cấp độ
    const colors = ["#2563eb", "#16a34a", "#f97316", "#9333ea", "#dc2626"];
    const bgColor = colors[depth % colors.length];
  
    return {
      id,
      topic: node.topic || node.name || "",
      "background-color": bgColor,   // 🔹 jsMind dùng key này
      "foreground-color": "#ffffff", // 🔹 text màu trắng
      children: node.children ? node.children.map((c: any) => walk(c, depth + 1)) : []
    };
  }

  return {
    meta: { name: "ai-mindmap", author: "gemini", version: "1.0" },
    format: "node_tree",
    data: walk(json, 0)
  };
}

const MindmapPage = () => {
  const [selectedType, setSelectedType] = useState<string>('standard');
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showMindmap, setShowMindmap] = useState(false);
  const [mindmapData, setMindmapData] = useState<any>(null);
  const [grade, setGrade] = useState('12');
  const [subject, setSubject] = useState('math');
  const [lesson, setLesson] = useState('');

  // ✅ Ẩn mindmap khi chuyển sang loại khác
  const handleTypeChange = (newType: string) => {
    setSelectedType(newType);
    // Ẩn mindmap cũ khi chuyển loại
    setShowMindmap(false);
    if (jmRef.current) {
      jmRef.current.remove();
      jmRef.current = null;
    }
  };

  const jmRef = useRef<any>(null);
  const inputRef = useRef<any>(null);

  // ✅ useEffect để khởi tạo jsMind khi container xuất hiện
  useEffect(() => {
    if (showMindmap && mindmapData && !jmRef.current) {
      // Đợi DOM update hoàn tất
      const timer = setTimeout(() => {
        try {
          const options = {
            container: "jsmind_container",
            theme: null,
            editable: false,
          };
          jmRef.current = new jsMind(options);
          
          // Hiển thị mindmap
          jmRef.current.show(mindmapData);
        } catch (error) {
          console.error("Error initializing jsMind:", error);
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [showMindmap, mindmapData]);

  const handleCreateMindmap = async () => {
    try {
      setLoading(true);

      let prompt = '';
      if (selectedType === 'standard') {
        prompt = `Hãy tạo mindmap JSON cho chủ đề: ${inputValue}. 
         Chỉ trả về JSON hợp lệ, KHÔNG kèm giải thích, KHÔNG bọc trong markdown.`;
      } else if (selectedType === 'gdpt2018') {
        prompt = `Hãy tạo mindmap JSON cho chương trình GDPT 2018 - Lớp ${grade}, Môn ${SUBJECTS.find(s => s.value === subject)?.label}, Bài học: ${lesson}. 
         Chỉ trả về JSON hợp lệ, KHÔNG kèm giải thích, KHÔNG bọc trong markdown.`;
      }

      const response = await GeminiService.generateText(prompt);

      let rawText = response;

      // ✅ làm sạch dữ liệu trả về từ Gemini
      rawText = rawText
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      // ✅ tách ra phần JSON hợp lệ
      const firstBrace = rawText.indexOf("{");
      const lastBrace = rawText.lastIndexOf("}");
      if (firstBrace === -1 || lastBrace === -1) throw new Error("Không tìm thấy JSON hợp lệ");

      const jsonString = rawText.substring(firstBrace, lastBrace + 1);
      const json = JSON.parse(jsonString);

      // ✅ convert về jsMind format
      const mindmapData = convertToJsMind(json);

      // ✅ Lưu data và hiển thị container
      setMindmapData(mindmapData);
      setShowMindmap(true);
      
      // ✅ Clear input tương ứng với loại mindmap
      if (selectedType === 'standard') {
        setInputValue('');
        message.success('Mindmap Tiêu chuẩn đã được tạo thành công!');
      } else if (selectedType === 'gdpt2018') {
        setLesson('');
        message.success('Mindmap GDPT 2018 đã được tạo thành công!');
      }

      setLoading(false);
    } catch (error) {
      console.error("Error creating mindmap:", error);
      message.error('Có lỗi xảy ra khi tạo mindmap. Vui lòng thử lại.');
      setLoading(false);
    }
  }



  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-[200px] w-full p-6 pb-48">
        <div className="max-w-[1100px] mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Title level={1} className="!text-orange-500 !mb-0">Mindmap</Title>
            </div>
            <Text className="text-lg text-gray-700">GEN AI giúp bạn xây dựng sơ đồ tư duy và có cái nhìn tổng quát</Text>
          </div>

          {/* Mindmap Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
            {MINDMAP_TYPES.map((type) => (
              <Card
                key={type.key}
                hoverable
                onClick={() => handleTypeChange(type.key)}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedType === type.key ? 'ring-2 ring-orange-500 shadow-lg' : 'hover:shadow-md'
                }`}
                bodyStyle={{ padding: '20px', textAlign: 'center' }}
              >
                <div className="mb-3">{type.icon}</div>
                <Title level={4} className="!mb-2">{type.title}</Title>
                <Text type="secondary" className="text-sm">{type.description}</Text>
              </Card>
            ))}
          </div>

          {/* Form GDPT 2018 - hiển thị ngay dưới select mindmap */}
          {selectedType === 'gdpt2018' && (
            <Card className="mt-2">
              <div className="p-6">
                <div className="text-center mb-4">
                  <Title level={4} className="!text-blue-600 !mb-2">Mindmap chương trình GDPT 2018</Title>
                  <Text className="text-gray-600 text-sm">
                    - Người dùng có thể tích chọn các phần "Lớp", "môn", "bài học".
                  </Text>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <div className="text-sm font-semibold mb-2 text-gray-700">Lớp:</div>
                    <Select
                      className="w-full"
                      value={grade}
                      options={GRADES}
                      onChange={setGrade}
                      size="large"
                    />
                  </div>
                  
                  <div>
                    <div className="text-sm font-semibold mb-2 text-gray-700">Môn:</div>
                    <Select
                      className="w-full"
                      value={subject}
                      options={SUBJECTS}
                      onChange={setSubject}
                      size="large"
                    />
                  </div>
                  
                  <div>
                    <div className="text-sm font-semibold mb-2 text-gray-700">Bài học:</div>
                    <Input
                      size="large"
                      value={lesson}
                      onChange={(e) => setLesson(e.target.value)}
                      placeholder="Nhập tên bài học..."
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="primary"
                    size="large"
                    icon={loading ? <Spin /> : <SendOutlined />}
                    onClick={handleCreateMindmap}
                    disabled={!lesson.trim() || loading}
                    className="!bg-orange-500 !border-orange-500 hover:!bg-orange-600 hover:border-orange-600 !h-12 !px-8 !text-base !font-semibold"
                  >
                    {loading ? 'Đang tạo...' : 'BẮT ĐẦU TẠO'}
                  </Button>
                </div>
              </div>
            </Card>
            )}

          {/* Container để render mindmap - hiển thị cho cả hai loại */}
          {showMindmap && (
            <Card className="mt-2">
              <div id="jsmind_container" style={{ width: '100%', height: '600px', background: '#fdfdfd' }} />
          </Card>
          )}

          {/* Input Box ở dưới cùng - chỉ hiển thị cho Mindmap Tiêu chuẩn */}
          {selectedType === 'standard' && (
            <div className="fixed bottom-0 left-[200px] right-0 z-50">
              <div className="max-w-[1100px] mx-auto">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
                  <div className="flex items-center gap-3">
                    <Input.TextArea
                      ref={inputRef}
                      size="large"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Nhập chủ đề mindmap mới..."
                      autoSize={{ minRows: 1, maxRows: 4 }}
                      className="flex-1 resize-none border-0 rounded-none p-0 shadow-none text-base leading-6 focus:outline-none focus:ring-0 focus:border-0"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleCreateMindmap();
                        }
                      }}
                    />
                    <div className="flex gap-2 flex-shrink-0">
                      <Tooltip title='Tạo mindmap mới'>
                        <Button
                          type='primary'
                          shape='circle'
                          size='large'
                          icon={loading ? <Spin size="small" /> : <SendOutlined />}
                          onClick={handleCreateMindmap}
                          disabled={!inputValue.trim() || loading}
                          className="w-10 h-10 bg-orange-500 border-orange-500 hover:bg-orange-600 hover:border-orange-600"
                        />
                      </Tooltip>
                    </div>
                  </div>
                </div>

                <div className="text-center my-2">
                  <Text type='secondary' className="text-xs">
                    Khi đặt câu hỏi, bạn đồng ý với <strong>Điều khoản</strong> và <strong>Chính sách quyền riêng tư</strong>.
                  </Text>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MindmapPage
