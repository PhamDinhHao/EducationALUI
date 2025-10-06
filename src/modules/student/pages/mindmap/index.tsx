import { useRef, useState, useEffect } from 'react'
import { Card, Typography, Select, Input, Button, Spin, Tooltip, message, Space, Dropdown, Upload, Image } from 'antd'
import { SendOutlined, BulbOutlined, BranchesOutlined, ZoomInOutlined, ZoomOutOutlined, PlusOutlined, MinusOutlined, DownloadOutlined, FullscreenOutlined, FileImageOutlined, FilePdfOutlined, PictureOutlined, FileTextOutlined, FileWordOutlined, FileExcelOutlined } from '@ant-design/icons'
import jsMind from 'jsmind'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

import 'jsmind/style/jsmind.css'
import Sidebar from '@/shared/components/Sidebar'
import { GeminiService } from '@/modules/ai/pages/ai/Service/gemini.service'
import { FileParser, FileParseResult } from './utils/fileParser'



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

// 🔹 Hàm validate và sửa JSON với debug chi tiết
function validateAndFixJSON(jsonString: string): any {
  console.log("🔍 Debugging JSON validation...");
  console.log("📏 JSON length:", jsonString.length);
  console.log("🔍 First 200 chars:", jsonString.substring(0, 200));
  console.log("🔍 Last 200 chars:", jsonString.substring(Math.max(0, jsonString.length - 200)));
  
  try {
    // Thử parse JSON gốc
    const result = JSON.parse(jsonString);
    console.log("✅ JSON parsed successfully on first try");
    return result;
  } catch (error) {
    console.log("🔧 JSON không hợp lệ, đang thử sửa...");
    console.log("❌ Original error:", error);
    
    // Sửa các lỗi JSON phổ biến
    let fixedJson = jsonString
      // Xóa dấu phẩy thừa trước ] hoặc }
      .replace(/,(\s*[}\]])/g, '$1')
      // Xóa dấu phẩy thừa sau { hoặc [
      .replace(/([{\[,])\s*,/g, '$1')
      // Xóa dấu phẩy trước }
      .replace(/,\s*}/g, '}')
      // Xóa dấu phẩy trước ]
      .replace(/,\s*]/g, ']')
      // Sửa lỗi quotes không đóng
      .replace(/"([^"]*)"([^",}\]]*)"([^"]*)"/g, '"$1$2$3"')
      // Sửa lỗi escape characters
      .replace(/\\"/g, '"')
      .replace(/\\n/g, '\\n')
      .replace(/\\t/g, '\\t')
      // Sửa lỗi property name không có dấu hai chấm
      .replace(/"([^"]+)"\s*([^":,}\]]+)/g, '"$1": "$2"')
      // Sửa lỗi thiếu dấu hai chấm sau property name
      .replace(/"([^"]+)"\s*([^":,}\]]+)/g, '"$1": "$2"');
    
    console.log("🔧 Fixed JSON first 200 chars:", fixedJson.substring(0, 200));
    
    try {
      const result = JSON.parse(fixedJson);
      console.log("✅ Fixed JSON parsed successfully");
      return result;
    } catch (secondError) {
      console.error("❌ Still cannot parse JSON after first fix:", secondError);
      
      // Thử sửa thêm các lỗi khác
      let secondFixedJson = fixedJson
        // Sửa lỗi thiếu dấu phẩy giữa các object
        .replace(/}\s*{/g, '},{')
        // Sửa lỗi thiếu dấu phẩy giữa các array element
        .replace(/]\s*\[/g, '],[')
        // Sửa lỗi property name không có quotes
        .replace(/([^"])\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":')
        // Sửa lỗi value không có quotes khi cần thiết
        .replace(/:\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*([,}\]])/g, ': "$1"$2');
      
      console.log("🔧 Second fix attempt...");
      
      try {
        const result = JSON.parse(secondFixedJson);
        console.log("✅ Second fix successful");
        return result;
      } catch (thirdError) {
        console.error("❌ All fixes failed:", thirdError);
        
        // Nếu vẫn không được, thử tạo JSON hợp lệ từ dữ liệu có sẵn
        try {
          const fallbackJson = createFallbackJSON(jsonString);
          console.log("🆘 Using fallback JSON");
          return fallbackJson;
        } catch (fallbackError) {
          console.error("❌ Even fallback failed:", fallbackError);
          throw new Error(`Không thể parse JSON từ AI response. Lỗi gốc: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    }
  }
}

// 🔹 Hàm tạo JSON fallback khi không thể sửa được
function createFallbackJSON(jsonString: string): any {
  console.log("🆘 Creating fallback JSON...");
  
  // Tìm topic chính
  const topicMatch = jsonString.match(/"topic"\s*:\s*"([^"]+)"/);
  const mainTopic = topicMatch ? topicMatch[1] : "Mindmap từ AI";
  
  // Tìm tất cả các topic trong JSON
  const allTopicMatches = jsonString.match(/"topic"\s*:\s*"([^"]+)"/g);
  const allTopics = allTopicMatches ? allTopicMatches.map(match => {
    const topic = match.match(/"topic"\s*:\s*"([^"]+)"/);
    return topic ? topic[1] : "Nội dung";
  }) : [];
  
  // Loại bỏ topic chính khỏi danh sách children
  const childrenTopics = allTopics.slice(1);
  
  // Tạo cấu trúc mindmap đơn giản
  const children = childrenTopics.slice(0, 15).map(topic => ({ topic }));
  
  console.log(`🆘 Fallback: Main topic "${mainTopic}" with ${children.length} children`);
  console.log(`📊 Fallback stats: JSON length ${jsonString.length}, extracted ${allTopics.length} topics`);
  
  return {
    topic: mainTopic,
    children: children
  };
}

// 🔹 Hàm convert Gemini JSON -> jsMind JSON
function convertToJsMind(json: any, idPrefix = "node"): any {
  let nodeIdCounter = 0;

  function walk(node: any, depth = 0): any {
    const id = `${idPrefix}-${nodeIdCounter++}`;
  
    // 🎨 Màu theo cấp độ
    const colors = ["#2563eb", "#16a34a", "#f97316", "#9333ea", "#dc2626"];
    const bgColor = colors[depth % colors.length];
  
    // Lấy topic từ nhiều field khác nhau
    const topic = node.topic || node.title || node.name || "";
    
    // Xử lý children từ nhiều schema khác nhau
    let childNodes = [];
    if (node.children) {
      childNodes = node.children;
    } else if (node.branches) {
      childNodes = node.branches;
    } else if (node.subBranches) {
      childNodes = node.subBranches;
    } else if (node.subtopics) {
      // Xử lý subtopics dạng array string
      childNodes = node.subtopics.map((item: string) => ({ topic: item }));
    }
  
    return {
      id,
      topic,
      "background-color": bgColor,   // 🔹 jsMind dùng key này
      "foreground-color": "#ffffff", // 🔹 text màu trắng
      children: childNodes.map((c: any) => walk(c, depth + 1))
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
  
  // File upload states  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>('');
  const [fileType, setFileType] = useState<'image' | 'document'>('image');
  const [parsedFileContent, setParsedFileContent] = useState<string>('');
  const [isParsingFile, setIsParsingFile] = useState<boolean>(false);

  // ✅ Ẩn mindmap khi chuyển sang loại khác
  const handleTypeChange = (newType: string) => {
    setSelectedType(newType);
    // Ẩn mindmap cũ khi chuyển loại
    setShowMindmap(false);
    // jsMind instance không có remove(); chỉ cần clear container và reset ref
    const container = document.getElementById('jsmind_container');
    if (container) container.innerHTML = '';
    jmRef.current = null;
  };

  const jmRef = useRef<any>(null);
  const inputRef = useRef<any>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  // File upload handlers
  const handleFileUpload = async (file: File) => {
    console.log('🔥 File upload attempted:', file.name, file.type, file.size);
    
    // Check if file type is supported by our parser
    if (!FileParser.isFileTypeSupported(file.type)) {
      message.error(`File type không được hỗ trợ: ${file.type}. Vui lòng chọn file PDF, Word, Excel, PowerPoint, ảnh hoặc text.`);
      return;
    }
    
    if (file.size / 1024 / 1024 >= 50) { // Increase limit to 50MB for documents
      message.error('File phải nhỏ hơn 50MB!');
      return;
    }
    
    setSelectedFile(file);
    setIsParsingFile(true);
    
    try {
      // Parse file content
      const parseResult: FileParseResult = await FileParser.parseFile(file);
      
      if (parseResult.error) {
        message.error(parseResult.error);
        setIsParsingFile(false);
        return;
      }
      
      const isImage = file.type.startsWith('image/');
      
      if (isImage) {
        setFileType('image');
        const reader = new FileReader();
        reader.onload = (e) => setFilePreview(e.target?.result as string);
        reader.readAsDataURL(file);
        setParsedFileContent(''); // Images don't need text content
        message.success('Đã thêm ảnh thành công!');
      } else {
        // Document files
        setFileType('document');
        setFilePreview('');
        setParsedFileContent(parseResult.content);
        
        const fileTypeDesc = FileParser.getFileTypeDescription(file.type);
        message.success(`Đã phân tích ${fileTypeDesc} thành công! Đã trích xuất ${parseResult.content.length} ký tự.`);
      }
      
    } catch (error) {
      console.error('Error parsing file:', error);
      message.error(`Lỗi khi xử lý file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsParsingFile(false);
    }
    
    return false; // Prevent default upload
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setFilePreview('');
    setFileType('image');
    setParsedFileContent('');
  };

  // Get file icon based on file type
  const getFileIcon = (file: File) => {
    const type = file.type.toLowerCase();
    const name = file.name.toLowerCase();
    
    // Images
    if (type.startsWith('image/')) return <PictureOutlined className="text-green-500 text-2xl" />;
    
    // PDF
    if (type.includes('pdf')) return <FilePdfOutlined className="text-red-500 text-2xl" />;
    
    // Word documents
    if (type.includes('wordprocessingml') || type.includes('msword') || name.endsWith('.doc') || name.endsWith('.docx')) {
      return <FileWordOutlined className="text-blue-500 text-2xl" />;
    }
    
    // Excel files
    if (type.includes('spreadsheetml') || type.includes('ms-excel') || name.endsWith('.xls') || name.endsWith('.xlsx')) {
      return <FileExcelOutlined className="text-green-600 text-2xl" />;
    }
    
    // PowerPoint files
    if (type.includes('presentationml') || type.includes('ms-powerpoint') || name.endsWith('.ppt') || name.endsWith('.pptx')) {
      return <FileImageOutlined className="text-orange-500 text-2xl" />;
    }
    
    // Text files
    if (type.includes('text') || name.endsWith('.txt')) return <FileTextOutlined className="text-blue-500 text-2xl" />;
    if (name.endsWith('.csv')) return <FileTextOutlined className="text-green-500 text-2xl" />;
    
    // Fallback
    return <FileTextOutlined className="text-gray-500 text-2xl" />;
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) handleFileUpload(file);
        break;
      }
    }
  };

  // Mindmap interaction functions
  const zoomIn = () => {
    if (jmRef.current) {
      jmRef.current.view.zoom_in();
    }
  };

  const zoomOut = () => {
    if (jmRef.current) {
      jmRef.current.view.zoom_out();
    }
  };

  const addNode = () => {
    console.log('🔹 AddNode called, jmRef.current:', jmRef.current);
    if (jmRef.current) {
      const selectedNode = jmRef.current.get_selected_node();
      console.log('🔹 Selected node:', selectedNode);
      if (selectedNode) {
        const newNodeId = `node-${Date.now()}`;
        console.log('🔹 Adding node with ID:', newNodeId, 'to parent:', selectedNode.id);
        // Sử dụng add_node với format đúng: (parent_node, node_id, topic, data)
        try {
          const result = jmRef.current.add_node(selectedNode.id, newNodeId, 'Nút mới');
          console.log('🔹 Add node result:', result);
          if (result) {
            message.success('Đã thêm nút mới thành công!');
          } else {
            message.error('Không thể thêm nút mới');
          }
        } catch (error) {
          console.error('🔹 Error adding node:', error);
          message.error('Lỗi khi thêm nút: ' + error);
        }
      } else {
        message.warning('Vui lòng chọn một nút để thêm nút con');
      }
    } else {
      message.error('Mindmap chưa được khởi tạo');
    }
  };

  const removeNode = () => {
    console.log('🔸 RemoveNode called, jmRef.current:', jmRef.current);
    if (jmRef.current) {
      const selectedNode = jmRef.current.get_selected_node();
      console.log('🔸 Selected node:', selectedNode);
      if (selectedNode) {
        const rootNode = jmRef.current.get_root();
        console.log('🔸 Root node:', rootNode);
        if (selectedNode.id !== rootNode.id) {
          // Sử dụng node_id thay vì node object
          try {
            console.log('🔸 Removing node with ID:', selectedNode.id);
            const result = jmRef.current.remove_node(selectedNode.id);
            console.log('🔸 Remove node result:', result);
            if (result) {
              message.success('Đã xóa nút thành công!');
            } else {
              message.error('Không thể xóa nút này');
            }
          } catch (error) {
            console.error('🔸 Error removing node:', error);
            message.error('Lỗi khi xóa nút: ' + error);
          }
        } else {
          message.warning('Không thể xóa nút gốc');
        }
      } else {
        message.warning('Vui lòng chọn một nút để xóa');
      }
    } else {
      message.error('Mindmap chưa được khởi tạo');
    }
  };

  const exportMindmapAsJSON = () => {
    if (jmRef.current) {
      // Export as JSON
      const mindmapData = jmRef.current.get_data();
      const dataStr = JSON.stringify(mindmapData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'mindmap.json';
      link.click();
      URL.revokeObjectURL(url);
      message.success('Mindmap đã được xuất JSON thành công!');
    }
  };

  const exportMindmapAsPNG = async () => {
    const container = document.getElementById('jsmind_container');
    if (!container || !jmRef.current) {
      message.error('Mindmap chưa được khởi tạo');
      return;
    }

    try {
      message.loading('Đang tạo file PNG...', 0);

      // Check if jsMind has content
      const jsmindInner = container.querySelector('.jsmind-inner') as HTMLElement;
      const nodes = container.querySelectorAll('jmnode');
      
      if (!jsmindInner || nodes.length === 0) {
        message.destroy();
        message.error('Mindmap chưa có nội dung để xuất. Hãy tạo mindmap trước.');
        return;
      }

      console.log('🖼️ Exporting mindmap with clean setup...');

      // Store original container styles
      const originalStyles = {
        overflow: container.style.overflow,
        height: container.style.height,
        width: container.style.width,
        maxHeight: container.style.maxHeight,
        maxWidth: container.style.maxWidth,
        border: container.style.border,
        borderRadius: container.style.borderRadius
      };

      // Prepare container for clean export
      container.style.overflow = 'hidden'; // Hide scrollbars completely
      container.style.border = 'none'; // Remove border
      container.style.borderRadius = '0'; // Remove border radius
      container.style.background = '#ffffff'; // Ensure white background
      
      // Calculate mindmap content dimensions
      const contentWidth = jsmindInner.scrollWidth;
      const contentHeight = jsmindInner.scrollHeight;
      
      // Set container to exactly fit content (no extra space)
      container.style.width = `${contentWidth}px`;
      container.style.height = `${contentHeight}px`;
      container.style.maxWidth = 'none';
      container.style.maxHeight = 'none';

      // Wait for styles to apply
      await new Promise(resolve => setTimeout(resolve, 300));

      console.log('🎯 Export dimensions:', {
        contentWidth,
        contentHeight,
        containerScrollWidth: container.scrollWidth,
        containerScrollHeight: container.scrollHeight
      });

      // Use html2canvas with precise dimensions
      const canvas = await html2canvas(container, {
        backgroundColor: '#ffffff',
        scale: 2, // High quality
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: contentWidth,
        height: contentHeight,
        scrollX: 0,
        scrollY: 0,
        ignoreElements: (element) => {
          // Ignore any scrollbar elements
          return element.tagName === 'SCROLLBAR' || 
                 element.classList.contains('scrollbar') ||
                 element.classList.contains('ant-scrollbar');
        }
      });

      // Restore original styles immediately
      Object.assign(container.style, originalStyles);

      console.log('✅ Canvas created successfully:', { 
        width: canvas.width, 
        height: canvas.height 
      });

      if (canvas.width < 100 || canvas.height < 100) {
        message.destroy();
        message.error(`Canvas kích thước không hợp lệ: ${canvas.width}x${canvas.height}`);
        return;
      }

      // Download the image
      canvas.toBlob((blob) => {
        if (blob && blob.size > 1000) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `mindmap-${Date.now()}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          
          message.destroy();
          message.success('🎉 Mindmap đã được xuất PNG thành công!');
        } else {
          message.destroy();
          message.error('Không thể tạo file PNG');
        }
      }, 'image/png', 1.0);

    } catch (error) {
      message.destroy();
      console.error('Export PNG error:', error);
      message.error('Có lỗi khi xuất PNG: ' + (error instanceof Error ? error.message : 'Unknown error'));
      
      // Ensure styles are restored on error
      const container = document.getElementById('jsmind_container');
      if (container) {
        container.style.overflow = '';
        container.style.height = '600px';
        container.style.width = '100%';
        container.style.maxHeight = '';
        container.style.maxWidth = '';
        container.style.border = '1px solid #e0e0e0';
        container.style.borderRadius = '8px';
        container.style.background = '#fdfdfd';
      }
    }
  };

  const exportMindmapAsPDF = async () => {
    const container = document.getElementById('jsmind_container');
    if (!container || !jmRef.current) {
      message.error('Mindmap chưa được khởi tạo');
      return;
    }

    try {
      message.loading('Đang tạo file PDF...', 0);

      // Check if mindmap has content
      const jsmindInner = container.querySelector('.jsmind-inner') as HTMLElement;
      const nodes = container.querySelectorAll('jmnode');
      
      if (!jsmindInner || nodes.length === 0) {
        message.destroy();
        message.error('Mindmap chưa có nội dung để xuất. Hãy tạo mindmap trước.');
        return;
      }

      console.log('📄 Exporting PDF with clean setup...');

      // Store original container styles
      const originalStyles = {
        overflow: container.style.overflow,
        height: container.style.height,
        width: container.style.width,
        maxHeight: container.style.maxHeight,
        maxWidth: container.style.maxWidth,
        border: container.style.border,
        borderRadius: container.style.borderRadius
      };

      // Prepare container for clean export
      container.style.overflow = 'hidden'; // Hide scrollbars completely
      container.style.border = 'none'; // Remove border
      container.style.borderRadius = '0'; // Remove border radius
      container.style.background = '#ffffff'; // Ensure white background
      
      // Calculate mindmap content dimensions
      const contentWidth = jsmindInner.scrollWidth;
      const contentHeight = jsmindInner.scrollHeight;
      
      // Set container to exactly fit content
      container.style.width = `${contentWidth}px`;
      container.style.height = `${contentHeight}px`;
      container.style.maxWidth = 'none';
      container.style.maxHeight = 'none';

      // Wait for styles to apply
      await new Promise(resolve => setTimeout(resolve, 300));

      // Use html2canvas for consistent results
      const canvas = await html2canvas(container, {
        backgroundColor: '#ffffff',
        scale: 3, // Higher quality for PDF
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: contentWidth,
        height: contentHeight,
        scrollX: 0,
        scrollY: 0,
        ignoreElements: (element) => {
          // Ignore any scrollbar elements
          return element.tagName === 'SCROLLBAR' || 
                 element.classList.contains('scrollbar') ||
                 element.classList.contains('ant-scrollbar');
        }
      });

      // Restore original styles immediately
      Object.assign(container.style, originalStyles);

      if (canvas.width < 100 || canvas.height < 100) {
        message.destroy();
        message.error(`Canvas kích thước không hợp lệ: ${canvas.width}x${canvas.height}`);
        return;
      }

      const imgData = canvas.toDataURL('image/png', 1.0);
      
      if (!imgData || imgData === 'data:,' || imgData.length < 1000) {
        message.destroy();
        message.error('Không thể tạo ảnh từ mindmap');
        return;
      }

      // Create PDF with optimal sizing
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = imgWidth / imgHeight;
      
      console.log('📄 Creating PDF with dimensions:', { imgWidth, imgHeight, ratio });
      
      // Calculate PDF dimensions to fit content perfectly
      let pdfWidth, pdfHeight;
      if (ratio > 1.4) {
        // Very wide - use A3 landscape
        pdfWidth = 420; // A3 landscape width in mm
        pdfHeight = 297; // A3 landscape height in mm
      } else if (ratio > 1) {
        // Wide - use A4 landscape
        pdfWidth = 297; // A4 landscape width in mm
        pdfHeight = 210; // A4 landscape height in mm
      } else if (ratio < 0.7) {
        // Tall - use extended portrait
        pdfWidth = 210; // A4 portrait width in mm
        pdfHeight = 420; // Extended height in mm
      } else {
        // Normal - use A4 portrait
        pdfWidth = 210; // A4 portrait width in mm
        pdfHeight = 297; // A4 portrait height in mm
      }
      
      // Adjust dimensions to maintain aspect ratio
      if (ratio > pdfWidth / pdfHeight) {
        pdfHeight = pdfWidth / ratio;
      } else {
        pdfWidth = pdfHeight * ratio;
      }
      
      // Create PDF
      const pdf = new jsPDF({
        orientation: ratio > 1 ? 'landscape' : 'portrait',
        unit: 'mm',
        format: [pdfWidth, pdfHeight]
      });

      // Add image to PDF (perfect fit)
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      // Save PDF
      pdf.save(`mindmap-${Date.now()}.pdf`);
      
      message.destroy();
      message.success('🎉 Mindmap đã được xuất PDF thành công!');

    } catch (error) {
      message.destroy();
      console.error('Export PDF error:', error);
      message.error('Có lỗi khi xuất PDF: ' + (error instanceof Error ? error.message : 'Unknown error'));
      
      // Ensure styles are restored on error
      const container = document.getElementById('jsmind_container');
      if (container) {
        container.style.overflow = '';
        container.style.height = '600px';
        container.style.width = '100%';
        container.style.maxHeight = '';
        container.style.maxWidth = '';
        container.style.border = '1px solid #e0e0e0';
        container.style.borderRadius = '8px';
        container.style.background = '#fdfdfd';
      }
    }
  };

  const toggleFullscreen = () => {
    const container = document.getElementById('jsmind_container');
    if (container) {
      if (!document.fullscreenElement) {
        // Store original styles
        const originalOverflow = container.style.overflow;
        const originalWidth = container.style.width;
        const originalHeight = container.style.height;
        
        // Apply fullscreen styles with scrollbars
        container.style.overflow = 'auto'; // Enable both vertical and horizontal scrollbars
        container.style.width = '100vw';
        container.style.height = '100vh';
        container.style.background = '#ffffff';
        container.style.padding = '20px';
        container.style.boxSizing = 'border-box';
        
        // Add custom scrollbar styling for better UX
        const fullscreenStyle = document.createElement('style');
        fullscreenStyle.id = 'mindmap-fullscreen-style';
        fullscreenStyle.textContent = `
          #jsmind_container:fullscreen {
            /* Custom scrollbar for webkit browsers */
            scrollbar-width: thin;
            scrollbar-color: #cbd5e1 #f1f5f9;
          }
          
          #jsmind_container:fullscreen::-webkit-scrollbar {
            width: 12px;
            height: 12px;
          }
          
          #jsmind_container:fullscreen::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 6px;
          }
          
          #jsmind_container:fullscreen::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 6px;
            border: 2px solid #f1f5f9;
          }
          
          #jsmind_container:fullscreen::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
          
          #jsmind_container:fullscreen::-webkit-scrollbar-corner {
            background: #f1f5f9;
          }
          
          /* Ensure mindmap content is properly sized in fullscreen */
          #jsmind_container:fullscreen .jsmind-inner {
            min-width: 100%;
            min-height: 100%;
          }
        `;
        
        document.head.appendChild(fullscreenStyle);
        
        container.requestFullscreen().then(() => {
          message.success('Đã vào chế độ toàn màn hình với thanh cuộn');
          
          // Listen for fullscreen exit to restore styles
          const handleFullscreenChange = () => {
            if (!document.fullscreenElement) {
              // Restore original styles
              container.style.overflow = originalOverflow || 'hidden';
              container.style.width = originalWidth || '100%';
              container.style.height = originalHeight || '600px';
              container.style.background = '#fdfdfd';
              container.style.padding = '';
              container.style.boxSizing = '';
              
              // Remove fullscreen custom styles
              const fullscreenStyleElement = document.getElementById('mindmap-fullscreen-style');
              if (fullscreenStyleElement) {
                fullscreenStyleElement.remove();
              }
              
              document.removeEventListener('fullscreenchange', handleFullscreenChange);
              message.info('Đã thoát chế độ toàn màn hình');
            }
          };
          
          document.addEventListener('fullscreenchange', handleFullscreenChange);
        }).catch(() => {
          // Restore styles if fullscreen failed
          container.style.overflow = originalOverflow || 'hidden';
          container.style.width = originalWidth || '100%';
          container.style.height = originalHeight || '600px';
          container.style.background = '#fdfdfd';
          container.style.padding = '';
          container.style.boxSizing = '';
          
          // Remove fullscreen custom styles
          const fullscreenStyleElement = document.getElementById('mindmap-fullscreen-style');
          if (fullscreenStyleElement) {
            fullscreenStyleElement.remove();
          }
          
          message.error('Không thể vào chế độ toàn màn hình');
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

  // 🔹 Zoom controls
  const handleZoomIn = () => {
    if (jmRef.current && zoomLevel < 2) {
      const newZoom = Math.min(zoomLevel + 0.2, 2);
      setZoomLevel(newZoom);
      applyZoom(newZoom);
    }
  };

  const handleZoomOut = () => {
    if (jmRef.current && zoomLevel > 0.5) {
      const newZoom = Math.max(zoomLevel - 0.2, 0.5);
      setZoomLevel(newZoom);
      applyZoom(newZoom);
    }
  };

  const handleResetZoom = () => {
    if (jmRef.current) {
      setZoomLevel(1);
      applyZoom(1);
      // Reset position to center
      resetPosition();
    }
  };

  const applyZoom = (zoom: number) => {
    const container = document.getElementById('jsmind_container');
    if (container) {
      const jsmindInner = container.querySelector('.jsmind-inner') as HTMLElement;
      if (jsmindInner) {
        jsmindInner.style.transform = `scale(${zoom})`;
        jsmindInner.style.transformOrigin = 'center center';
      }
    }
  };

  const resetPosition = () => {
    const container = document.getElementById('jsmind_container');
    if (container) {
      const jsmindInner = container.querySelector('.jsmind-inner') as HTMLElement;
      if (jsmindInner) {
        jsmindInner.style.transform = `scale(${zoomLevel}) translate(0px, 0px)`;
        jsmindInner.style.transformOrigin = 'center center';
      }
    }
  };


  // ✅ useEffect để khởi tạo jsMind khi container xuất hiện
  useEffect(() => {
    if (showMindmap && mindmapData && !jmRef.current) {
      // Đợi DOM update hoàn tất
      const timer = setTimeout(() => {
        try {
          const options = {
            container: "jsmind_container",
            editable: true,
            support_html: true,
          };
          jmRef.current = new jsMind(options);
          
          // Hiển thị mindmap
          jmRef.current.show(mindmapData);
          
          // Add event listeners for better interaction
          jmRef.current.add_event_listener(function(type: string, data: any) {
            if (type === 'edit_node') {
              console.log('Node edited:', data);
            } else if (type === 'select_node') {
              console.log('Node selected:', data);
            }
          });
          
          // CSS đã được định nghĩa trong component
          
          console.log('jsMind initialized successfully:', jmRef.current);
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
        if (selectedFile) {
          if (fileType === 'image') {
            // Smart image analysis prompt
            const userContext = inputValue ? ` với góc nhìn: "${inputValue}"` : '';
            prompt = `Hãy phân tích ảnh đã gửi${userContext} và tạo mindmap JSON chi tiết.

HƯỚNG DẪN PHÂN TÍCH:
- Xác định chủ đề chính của ảnh (văn bản, biểu đồ, sơ đồ, khái niệm học tập...)
- Trích xuất tất cả thông tin quan trọng từ ảnh
- Tổ chức thành cấu trúc mindmap logic với chủ đề chính và các nhánh con
- Nếu là tài liệu học tập: chia theo khái niệm, định nghĩa, ví dụ, ứng dụng
- Nếu là biểu đồ/sơ đồ: theo cấu trúc của biểu đồ
- Nếu là văn bản: theo ý chính và chi tiết

QUAN TRỌNG: 
- Chỉ trả về JSON thuần, KHÔNG có text khác
- KHÔNG sử dụng markdown backticks
- Format chính xác: {"topic": "chủ đề tự động nhận diện", "children": [...]}
- Đảm bảo JSON hợp lệ: mỗi property phải có dấu hai chấm, dấu phẩy đúng vị trí
- Không có dấu phẩy thừa trước ] hoặc }
- Mỗi string value phải có dấu ngoặc kép
- Không có text giải thích trước hoặc sau JSON
- Kiểm tra lại JSON trước khi trả về`;
          } else {
            // Smart document analysis prompt với chunking
            const fileTypeDesc = FileParser.getFileTypeDescription(selectedFile.type);
            const userContext = inputValue ? ` với góc nhìn: "${inputValue}"` : '';
            
            // Chia nhỏ nội dung file nếu quá dài
            const maxContentLength = 8000; // Giới hạn độ dài content
            let contentToAnalyze = parsedFileContent;
            
            if (parsedFileContent.length > maxContentLength) {
              console.log(`📄 File content quá dài (${parsedFileContent.length} chars), chia nhỏ để phân tích...`);
              contentToAnalyze = parsedFileContent.substring(0, maxContentLength) + 
                `\n\n[Lưu ý: Nội dung đã được rút gọn từ ${parsedFileContent.length} ký tự xuống ${maxContentLength} ký tự để tránh JSON quá dài]`;
            }
            
            prompt = `Hãy phân tích nội dung ${fileTypeDesc} sau đây${userContext} và tạo mindmap JSON chi tiết:

===== NỘI DUNG FILE =====
${contentToAnalyze}
===== KẾT THÚC NỘI DUNG FILE =====

HƯỚNG DẪN PHÂN TÍCH:
- Tự động xác định chủ đề chính của tài liệu
- Phân tích cấu trúc nội dung (tiêu đề, mục lục, phần chính, kết luận...)
- Trích xuất các khái niệm, định nghĩa, công thức, ví dụ quan trọng
- Tổ chức theo cấu trúc logic: từ tổng quát đến chi tiết
- Nếu là bài học: chia theo mục tiêu, nội dung, bài tập, đánh giá
- Nếu là tài liệu kỹ thuật: chia theo tính năng, hướng dẫn, lưu ý
- Nếu là bài tập: chia theo dạng bài, phương pháp giải, ví dụ
- GIỚI HẠN: Tối đa 2 cấp độ children để tránh JSON quá dài

QUAN TRỌNG: 
- Chỉ trả về JSON thuần, KHÔNG có text khác
- Format chính xác: {"topic": "chủ đề tự động nhận diện từ nội dung", "children": [...]}
- Đảm bảo JSON hợp lệ: mỗi property phải có dấu hai chấm, dấu phẩy đúng vị trí
- Không có dấu phẩy thừa trước ] hoặc }
- Mỗi string value phải có dấu ngoặc kép
- Không có text giải thích trước hoặc sau JSON
- Kiểm tra lại JSON trước khi trả về`;
          }
        } else {
          prompt = `Hãy tạo mindmap JSON chi tiết cho chủ đề: "${inputValue}".

HƯỚNG DẪN TẠO MINDMAP:
- Phân tích chủ đề và xác định các khía cạnh chính
- Tạo cấu trúc từ tổng quát đến chi tiết
- Bao gồm: định nghĩa, đặc điểm, phân loại, ứng dụng, ví dụ
- Đảm bảo logic và dễ hiểu
- GIỚI HẠN: Tối đa 2 cấp độ children để tránh JSON quá dài

QUAN TRỌNG: 
- Chỉ trả về JSON thuần, KHÔNG có text khác
- Format chính xác: {"topic": "${inputValue}", "children": [...]}
- Đảm bảo JSON hợp lệ: mỗi property phải có dấu hai chấm, dấu phẩy đúng vị trí
- Không có dấu phẩy thừa trước ] hoặc }
- Mỗi string value phải có dấu ngoặc kép
- Không có text giải thích trước hoặc sau JSON
- Kiểm tra lại JSON trước khi trả về`;
        }
      } else if (selectedType === 'gdpt2018') {
        if (selectedFile) {
          if (fileType === 'image') {
            // Smart GDPT 2018 image analysis
            const subjectName = SUBJECTS.find(s => s.value === subject)?.label || 'Học tập';
            const lessonContext = lesson ? ` - Bài học: "${lesson}"` : '';
            prompt = `Hãy phân tích ảnh đã gửi theo chương trình GDPT 2018 - Lớp ${grade}, Môn ${subjectName}${lessonContext} và tạo mindmap JSON chi tiết.

HƯỚNG DẪN PHÂN TÍCH THEO GDPT 2018:
- Xác định mục tiêu học tập từ ảnh (kiến thức, kỹ năng, thái độ)
- Phân tích nội dung theo cấu trúc: Khái niệm cơ bản → Kiến thức chi tiết → Ứng dụng thực tế
- Liên kết với chương trình ${subjectName} lớp ${grade}
- Tổ chức theo năng lực cốt lõi: tư duy, giải quyết vấn đề, hợp tác, giao tiếp
- Đưa ra các hoạt động học tập phù hợp với lứa tuổi
- Bao gồm: Mục tiêu, Nội dung chính, Hoạt động, Đánh giá

QUAN TRỌNG: 
- Chỉ trả về JSON thuần, KHÔNG có text khác, KHÔNG có markdown
- Format chính xác: {"topic": "Bài học theo GDPT 2018", "children": [...]}
- Đảm bảo JSON hợp lệ: mỗi property phải có dấu hai chấm, dấu phẩy đúng vị trí
- Không có dấu phẩy thừa trước ] hoặc }
- Mỗi string value phải có dấu ngoặc kép
- Không có text giải thích trước hoặc sau JSON
- Kiểm tra lại JSON trước khi trả về`;
          } else {
            // Smart GDPT 2018 document analysis với chunking
            const fileTypeDesc = FileParser.getFileTypeDescription(selectedFile.type);
            const subjectName = SUBJECTS.find(s => s.value === subject)?.label || 'Học tập';
            const lessonContext = lesson ? ` - Bài học: "${lesson}"` : '';
            
            // Chia nhỏ nội dung file nếu quá dài
            const maxContentLength = 8000; // Giới hạn độ dài content
            let contentToAnalyze = parsedFileContent;
            
            if (parsedFileContent.length > maxContentLength) {
              console.log(`📄 GDPT File content quá dài (${parsedFileContent.length} chars), chia nhỏ để phân tích...`);
              contentToAnalyze = parsedFileContent.substring(0, maxContentLength) + 
                `\n\n[Lưu ý: Nội dung đã được rút gọn từ ${parsedFileContent.length} ký tự xuống ${maxContentLength} ký tự để tránh JSON quá dài]`;
            }
            
            prompt = `Hãy phân tích nội dung ${fileTypeDesc} theo chương trình GDPT 2018 - Lớp ${grade}, Môn ${subjectName}${lessonContext}:

===== NỘI DUNG FILE =====
${contentToAnalyze}
===== KẾT THÚC NỘI DUNG FILE =====

HƯỚNG DẪN PHÂN TÍCH THEO GDPT 2018:
- Tự động xác định mục tiêu học tập (kiến thức, kỹ năng, thái độ)
- Phân tích theo cấu trúc bài học GDPT 2018: Khởi động → Hình thành kiến thức → Luyện tập → Vận dụng
- Liên kết với chương trình ${subjectName} lớp ${grade}
- Xác định năng lực cần phát triển (tư duy logic, sáng tạo, hợp tác...)
- Đề xuất hoạt động học tập phù hợp: cá nhân, nhóm, thảo luận, thực hành
- Bao gồm: Mục tiêu bài học, Kiến thức cốt lõi, Hoạt động học tập, Đánh giá kết quả
- GIỚI HẠN: Tối đa 2 cấp độ children để tránh JSON quá dài

QUAN TRỌNG: 
- Chỉ trả về JSON thuần, KHÔNG có text khác, KHÔNG có markdown
- Format chính xác: {"topic": "Bài học: [tự động nhận diện từ nội dung]", "children": [...]}
- Đảm bảo JSON hợp lệ: mỗi property phải có dấu hai chấm, dấu phẩy đúng vị trí
- Không có dấu phẩy thừa trước ] hoặc }
- Mỗi string value phải có dấu ngoặc kép
- Không có text giải thích trước hoặc sau JSON
- Kiểm tra lại JSON trước khi trả về`;
          }
        } else {
          // Auto-generate lesson content for GDPT 2018
          const subjectName = SUBJECTS.find(s => s.value === subject)?.label || 'Học tập';
          const autoLesson = lesson || `Bài học ${subjectName} lớp ${grade}`;
          prompt = `Hãy tạo mindmap JSON chi tiết cho "${autoLesson}" theo chương trình GDPT 2018.

HƯỚNG DẪN TẠO BÀI HỌC GDPT 2018:
- Xác định mục tiêu học tập (kiến thức, kỹ năng, thái độ)
- Cấu trúc bài học: Khởi động → Hình thành kiến thức → Luyện tập → Vận dụng
- Phát triển năng lực cốt lõi của môn ${subjectName}
- Thiết kế hoạt động học tập đa dạng: cá nhân, nhóm, thảo luận
- Liên kết với thực tế và cuộc sống
- Bao gồm: Mục tiêu, Nội dung, Hoạt động, Đánh giá

CẤU TRÚC MINDMAP:
- Chủ đề chính: "${autoLesson}"
- Nhánh 1: Mục tiêu học tập
- Nhánh 2: Nội dung kiến thức
- Nhánh 3: Hoạt động học tập  
- Nhánh 4: Đánh giá kết quả

QUAN TRỌNG: 
- Chỉ trả về JSON thuần, KHÔNG có text khác
- Format chính xác: {"topic": "${autoLesson}", "children": [...]}
- Đảm bảo JSON hợp lệ: mỗi property phải có dấu hai chấm, dấu phẩy đúng vị trí
- Không có dấu phẩy thừa trước ] hoặc }
- Mỗi string value phải có dấu ngoặc kép
- Không có text giải thích trước hoặc sau JSON
- Kiểm tra lại JSON trước khi trả về`;
        }
      }

      const response = selectedFile && fileType === 'image'
        ? await GeminiService.chat([
            {
              role: 'user' as const,
              content: prompt,
              timestamp: new Date()
            }
          ], 'mindmap', selectedFile)
        : await GeminiService.generateText(prompt);

      let rawText = response;

      // ✅ làm sạch dữ liệu trả về từ Gemini
      rawText = rawText
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .replace(/```javascript/gi, "")
        .replace(/```js/gi, "")
        .trim();

      console.log("🔹 Raw response from Gemini:", rawText.substring(0, 500) + "...");

      // ✅ tách ra phần JSON hợp lệ
      const firstBrace = rawText.indexOf("{");
      const lastBrace = rawText.lastIndexOf("}");
      
      if (firstBrace === -1 || lastBrace === -1) {
        console.error("❌ Không tìm thấy JSON hợp lệ trong response:", rawText);
        throw new Error("Không tìm thấy JSON hợp lệ trong response từ AI");
      }

      const jsonString = rawText.substring(firstBrace, lastBrace + 1);
      console.log("🔹 Extracted JSON string:", jsonString.substring(0, 200) + "...");

      // Sử dụng hàm validate và sửa JSON
      const json = validateAndFixJSON(jsonString);
      console.log("✅ JSON parsed successfully");
      
      // Kiểm tra xem có sử dụng fallback không
      const isLikelyFallback = json.children && json.children.length <= 15 && jsonString.length > 5000;
      if (isLikelyFallback) {
        message.warning({
          content: 'JSON từ AI có lỗi cú pháp, đã tự động tạo mindmap từ nội dung có sẵn',
          duration: 5,
          style: { marginTop: '10vh' }
        });
      } else {
        message.success({
          content: 'Mindmap đã được tạo thành công!',
          duration: 3,
          style: { marginTop: '10vh' }
        });
      }

      // ✅ convert về jsMind format
      const mindmapData = convertToJsMind(json);

      // ✅ Lưu data và hiển thị container
      setMindmapData(mindmapData);
      setShowMindmap(true);
      
      // ✅ Clear input tương ứng với loại mindmap
      if (selectedType === 'standard') {
        setInputValue('');
        setSelectedFile(null);
        setFilePreview('');
        setFileType('image');
        setParsedFileContent('');
        message.success('Mindmap Tiêu chuẩn đã được tạo thành công!');
      } else if (selectedType === 'gdpt2018') {
        setLesson('');
        setSelectedFile(null);
        setFilePreview('');
        setFileType('image');
        setParsedFileContent('');
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
                      onPaste={handlePaste}
                      placeholder="Nhập tên bài học... (Ctrl+V để dán ảnh hoặc upload file text)"
                      className="w-full"
                    />
                  </div>
                </div>

                {/* File Upload Section */}
                <div className="mb-6">
                  <div className="text-sm font-semibold mb-2 text-gray-700">Ảnh hoặc file text (tùy chọn):</div>
                  
                  {selectedFile ? (
                    <div className="p-3 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <div className="flex items-center gap-3">
                        {fileType === 'image' && filePreview ? (
                          <Image 
                            src={filePreview} 
                            alt="Preview" 
                            width={80} 
                            height={80} 
                            className="rounded-lg object-cover" 
                          />
                        ) : (
                          <div className="w-20 h-20 flex items-center justify-center bg-white rounded-lg border">
                            {getFileIcon(selectedFile)}
                          </div>
                        )}
                        
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 mb-1">
                            {fileType === 'image' ? 'Ảnh' : FileParser.getFileTypeDescription(selectedFile?.type || '')} đã chọn
                          </p>
                          <p className="text-xs text-gray-500">{selectedFile?.name}</p>
                          <p className="text-xs text-gray-400">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            {parsedFileContent && ` • ${parsedFileContent.length} ký tự`}
                          </p>
                        </div>
                        <Button 
                          type="text" 
                          size="small" 
                          onClick={removeSelectedFile} 
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕ Xóa
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Upload.Dragger
                      showUploadList={false}
                      beforeUpload={handleFileUpload}
                      accept="image/*,.txt,.csv,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                      className="!h-24"
                    >
                      <div className="flex items-center justify-center gap-3 py-2">
                        {isParsingFile ? (
                          <Spin className="text-2xl text-blue-500" />
                        ) : (
                          <PictureOutlined className="text-2xl text-gray-400" />
                        )}
                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            {isParsingFile ? 'Đang phân tích file...' : 'Click hoặc kéo thả file vào đây'}
                          </p>
                          <p className="text-xs text-gray-400">
                            Hỗ trợ: PDF, Word, Excel, PowerPoint, Ảnh, Text - tối đa 50MB
                          </p>
                        </div>
                      </div>
                    </Upload.Dragger>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button
                    type="primary"
                    size="large"
                    icon={loading ? <Spin /> : <SendOutlined />}
                    onClick={handleCreateMindmap}
                    disabled={(!lesson.trim() && !selectedFile) || loading || isParsingFile}
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
              {/* Usage Instructions */}
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <Text className="text-blue-800 text-sm">
                  💡 <strong>Hướng dẫn:</strong> Click vào node để chọn → Double-click để chỉnh sửa nội dung → Sử dụng toolbar để thêm/xóa/zoom → Right-click để xem thêm tùy chọn
                </Text>
              </div>

              {/* Mindmap Controls */}
              <div className="flex justify-between items-center mb-4 p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Text strong>Điều khiển Mindmap:</Text>
                  <Space>
                    <Tooltip title="Phóng to">
                      <Button icon={<ZoomInOutlined />} onClick={zoomIn} />
                    </Tooltip>
                    <Tooltip title="Thu nhỏ">
                      <Button icon={<ZoomOutOutlined />} onClick={zoomOut} />
                    </Tooltip>
                    <Tooltip title="Thêm nút con">
                      <Button icon={<PlusOutlined />} onClick={addNode} type="primary" ghost />
                    </Tooltip>
                    <Tooltip title="Xóa nút đã chọn">
                      <Button icon={<MinusOutlined />} onClick={removeNode} danger />
                    </Tooltip>
                  </Space>
                </div>
                <div className="flex items-center gap-2">
                  <Space>
                    <Dropdown
                      menu={{
                        items: [
                          {
                            key: 'png',
                            label: 'Xuất PNG',
                            icon: <FileImageOutlined />,
                            onClick: exportMindmapAsPNG,
                          },
                          {
                            key: 'pdf',
                            label: 'Xuất PDF',
                            icon: <FilePdfOutlined />,
                            onClick: exportMindmapAsPDF,
                          },
                          {
                            type: 'divider',
                          },
                          {
                            key: 'json',
                            label: 'Xuất JSON',
                            icon: <DownloadOutlined />,
                            onClick: exportMindmapAsJSON,
                          },
                        ],
                      }}
                      placement="bottomRight"
                      trigger={['click']}
                    >
                      <Button icon={<DownloadOutlined />}>
                        Xuất file <DownloadOutlined />
                      </Button>
                    </Dropdown>
                    <Tooltip title="Toàn màn hình">
                      <Button icon={<FullscreenOutlined />} onClick={toggleFullscreen} />
                    </Tooltip>
                    
                    {/* Zoom Controls */}
                    <div className="flex items-center gap-1 border border-gray-300 rounded">
                      <Tooltip title="Zoom out">
                        <Button 
                          icon={<ZoomOutOutlined />} 
                          onClick={handleZoomOut}
                          disabled={zoomLevel <= 0.5}
                          size="small"
                        />
                      </Tooltip>
                      <span className="px-2 text-sm font-medium min-w-[60px] text-center">
                        {Math.round(zoomLevel * 100)}%
                      </span>
                      <Tooltip title="Zoom in">
                        <Button 
                          icon={<ZoomInOutlined />} 
                          onClick={handleZoomIn}
                          disabled={zoomLevel >= 2}
                          size="small"
                        />
                      </Tooltip>
                      <Tooltip title="Reset zoom">
                        <Button 
                          icon={<PlusOutlined />} 
                          onClick={handleResetZoom}
                          size="small"
                        />
                      </Tooltip>
                    </div>
                  </Space>
                </div>
              </div>
              
              <div 
                id="jsmind_container" 
                style={{ 
                  width: '100%', 
                  height: '600px', 
                  background: '#fdfdfd', 
                  border: '1px solid #e0e0e0', 
                  borderRadius: '8px',
                  overflow: 'auto',
                  position: 'relative'
                }}
              />
              
              {/* CSS đơn giản cho mindmap */}
              <style dangerouslySetInnerHTML={{
                __html: `
                  #jsmind_container {
                    /* Smooth scrolling */
                    scroll-behavior: smooth;
                    /* Better scrollbar */
                    scrollbar-width: thin;
                    scrollbar-color: #cbd5e1 #f1f5f9;
                  }
                  
                  /* Enhanced scrollbar styling */
                  #jsmind_container::-webkit-scrollbar {
                    width: 12px;
                    height: 12px;
                  }
                  
                  #jsmind_container::-webkit-scrollbar-track {
                    background: #f1f5f9;
                    border-radius: 6px;
                  }
                  
                  #jsmind_container::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 6px;
                    border: 2px solid #f1f5f9;
                  }
                  
                  #jsmind_container::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                  }
                  
                  #jsmind_container::-webkit-scrollbar-corner {
                    background: #f1f5f9;
                  }
                  
                  /* Better node interaction */
                  #jsmind_container .jsmind-node {
                    cursor: pointer;
                  }
                  
                  #jsmind_container .jsmind-node:hover {
                    opacity: 0.8;
                  }
                `
              }} />
          </Card>
          )}

          {/* Input Box ở dưới cùng - chỉ hiển thị cho Mindmap Tiêu chuẩn */}
          {selectedType === 'standard' && (
            <div className="fixed bottom-0 left-[200px] right-0 z-50">
              <div className="max-w-[1100px] mx-auto">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
                  {/* File Preview */}
                  {selectedFile && (
                    <div className="mb-3 p-3 bg-gray-50 rounded-lg relative">
                      <div className="flex items-center gap-3">
                        {fileType === 'image' && filePreview ? (
                          <Image 
                            src={filePreview} 
                            alt="Preview" 
                            width={60} 
                            height={60} 
                            className="rounded-lg object-cover" 
                          />
                        ) : (
                          <div className="w-15 h-15 flex items-center justify-center bg-white rounded-lg border">
                            {getFileIcon(selectedFile)}
                          </div>
                        )}
                        
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 mb-1">
                            {fileType === 'image' ? 'Ảnh' : FileParser.getFileTypeDescription(selectedFile?.type || '')} đã chọn
                          </p>
                          <p className="text-xs text-gray-500">{selectedFile?.name}</p>
                          <p className="text-xs text-gray-400">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            {parsedFileContent && ` • ${parsedFileContent.length} ký tự`}
                          </p>
                        </div>
                        <Button 
                          type="text" 
                          size="small" 
                          onClick={removeSelectedFile} 
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Input and Buttons */}
                  <div className="flex items-center gap-3">
                    <Input.TextArea
                      ref={inputRef}
                      size="large"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onPaste={handlePaste}
                      placeholder="Nhập chủ đề mindmap mới... (Ctrl+V để dán ảnh hoặc upload file text)"
                      autoSize={{ minRows: 1, maxRows: 4 }}
                      className="flex-1 resize-none border-0 rounded-none p-0 shadow-none text-base leading-6 focus:outline-none focus:ring-0 focus:border-0"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleCreateMindmap();
                        }
                      }}
                      disabled={loading}
                    />
                    
                    <div className="flex gap-2 flex-shrink-0">
                      <Tooltip title='File tài liệu (PDF, Word, Excel, PowerPoint, Ảnh, Text)'>
                        <Upload showUploadList={false} beforeUpload={handleFileUpload} accept="image/*,.txt,.csv,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx">
                          <Button 
                            shape='circle' 
                            size='large' 
                            icon={isParsingFile ? <Spin size="small" /> : <PictureOutlined />} 
                            className={`w-10 h-10 border ${
                              selectedFile ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                            } hover:border-gray-400 hover:bg-gray-50`} 
                            disabled={loading || isParsingFile} 
                          />
                        </Upload>
                      </Tooltip>

                      <Tooltip title='Tạo mindmap mới'>
                        <Button
                          type='primary'
                          shape='circle'
                          size='large'
                          icon={loading ? <Spin size="small" /> : <SendOutlined />}
                          onClick={handleCreateMindmap}
                          disabled={(!inputValue.trim() && !selectedFile) || loading || isParsingFile}
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
