import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const onTapDir = path.join(__dirname, 'src', 'assets', 'data', 'onTap');

// Parse lessons from paragraphs
function parseLessons(paragraphs) {
  if (!paragraphs || paragraphs.length < 2) return [];
  
  const lessonsText = paragraphs[1];
  if (!lessonsText) return [];
  
  const lessons = [];
  
  // Tách chuỗi bằng cách tìm tất cả các vị trí bắt đầu bằng "Bài" và số
  const parts = lessonsText.split(/(?=Bài\s+\d+\.)/);
  
  parts.forEach((part) => {
    const trimmed = part.trim();
    if (trimmed && trimmed.startsWith('Bài')) {
      // Tìm số bài và tên bài, sử dụng non-greedy match với lookahead
      const match = trimmed.match(/Bài\s+(\d+)\.\s*(.+?)(?=Bài\s+\d+\.|$)/s);
      if (match) {
        const lessonNum = parseInt(match[1]);
        let lessonName = match[2].trim();
        
        // Loại bỏ dấu chấm ở cuối nếu có
        lessonName = lessonName.replace(/\.$/, '').trim();
        
        if (lessonName) {
          lessons.push({
            number: lessonNum,
            title: lessonName
          });
        }
      }
    }
  });
  
  return lessons;
}

function restructureJson(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContent);
    
    // Parse lessons từ paragraphs
    const lessons = parseLessons(data.paragraphs);
    
    // Tạo cấu trúc mới
    const newData = {
      fileName: data.fileName,
      subject: data.subject,
      title: data.paragraphs[0] || '',
      lessons: lessons,
      reviewSections: data.paragraphs.slice(2) || []
    };
    
    // Ghi lại file
    fs.writeFileSync(filePath, JSON.stringify(newData, null, 2), 'utf8');
    console.log(`✓ Restructured: ${path.basename(filePath)} - ${lessons.length} lessons`);
    return newData;
  } catch (error) {
    console.error(`✗ Error restructuring ${filePath}:`, error.message);
    return null;
  }
}

function restructureAllFiles() {
  const subjects = ['ly', 'su'];
  
  for (const subject of subjects) {
    const subjectDir = path.join(onTapDir, subject);
    
    if (!fs.existsSync(subjectDir)) {
      console.log(`Directory not found: ${subjectDir}`);
      continue;
    }
    
    const files = fs.readdirSync(subjectDir);
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    
    console.log(`\nProcessing ${jsonFiles.length} files in ${subject}/...`);
    
    for (const file of jsonFiles) {
      const filePath = path.join(subjectDir, file);
      restructureJson(filePath);
    }
  }
  
  console.log('\n✓ Restructuring completed!');
}

// Run the restructuring
restructureAllFiles();

