import mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import * as pdfjsLib from 'pdfjs-dist';

// Set worker source for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export interface FileParseResult {
  content: string;
  fileName: string;
  fileType: string;
  error?: string;
}

export class FileParser {
  /**
   * Parse different file types and extract text content
   */
  static async parseFile(file: File): Promise<FileParseResult> {
    const result: FileParseResult = {
      content: '',
      fileName: file.name,
      fileType: file.type
    };

    try {
      if (file.type.includes('text/')) {
        // Text files
        result.content = await this.parseTextFile(file);
      } else if (file.type.includes('application/pdf')) {
        // PDF files
        result.content = await this.parsePDFFile(file);
      } else if (file.type.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document') || 
                 file.type.includes('application/msword')) {
        // Word documents
        result.content = await this.parseWordFile(file);
      } else if (file.type.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') ||
                 file.type.includes('application/vnd.ms-excel')) {
        // Excel files
        result.content = await this.parseExcelFile(file);
      } else if (file.type.includes('application/vnd.openxmlformats-officedocument.presentationml.presentation') ||
                 file.type.includes('application/vnd.ms-powerpoint')) {
        // PowerPoint files
        result.content = await this.parsePowerPointFile(file);
      } else if (file.type.includes('image/')) {
        // Image files - return file info for Gemini to process
        result.content = `[Image file: ${file.name}]`;
      } else {
        // Unknown file type - try as text
        result.content = await this.parseTextFile(file);
      }

      return result;
    } catch (error) {
      result.error = `Lỗi khi đọc file: ${error instanceof Error ? error.message : 'Unknown error'}`;
      return result;
    }
  }

  /**
   * Parse text files
   */
  private static async parseTextFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content);
      };
      reader.onerror = () => reject(new Error('Không thể đọc file text'));
      reader.readAsText(file, 'UTF-8');
    });
  }

  /**
   * Parse PDF files using PDF.js
   */
  private static async parsePDFFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const typedArray = new Uint8Array(e.target?.result as ArrayBuffer);
          const pdf = await pdfjsLib.getDocument(typedArray).promise;
          
          let fullText = '';
          
          // Extract text from all pages
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
              .filter((item: any) => item.str)
              .map((item: any) => item.str)
              .join(' ');
            fullText += `\n--- Trang ${i} ---\n${pageText}\n`;
          }
          
          resolve(fullText.trim());
        } catch (error) {
          reject(new Error(`Lỗi khi đọc PDF: ${error instanceof Error ? error.message : 'Unknown error'}`));
        }
      };
      reader.onerror = () => reject(new Error('Không thể đọc file PDF'));
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Parse Word documents using mammoth
   */
  private static async parseWordFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const result = await mammoth.extractRawText({ arrayBuffer });
          resolve(result.value);
        } catch (error) {
          reject(new Error(`Lỗi khi đọc Word: ${error instanceof Error ? error.message : 'Unknown error'}`));
        }
      };
      reader.onerror = () => reject(new Error('Không thể đọc file Word'));
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Parse Excel files using SheetJS
   */
  private static async parseExcelFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          let fullText = '';
          
          // Extract data from all sheets
          workbook.SheetNames.forEach((sheetName) => {
            const worksheet = workbook.Sheets[sheetName];
            const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            
            fullText += `\n--- Sheet: ${sheetName} ---\n`;
            (sheetData as any[][]).forEach((row: any[], rowIndex: number) => {
              if (row && row.length > 0) {
                fullText += `Hàng ${rowIndex + 1}: ${row.join(' | ')}\n`;
              }
            });
          });
          
          resolve(fullText.trim());
        } catch (error) {
          reject(new Error(`Lỗi khi đọc Excel: ${error instanceof Error ? error.message : 'Unknown error'}`));
        }
      };
      reader.onerror = () => reject(new Error('Không thể đọc file Excel'));
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Parse PowerPoint files (basic extraction)
   */
  private static async parsePowerPointFile(file: File): Promise<string> {
    // Note: PowerPoint parsing is complex, this is a basic implementation
    // For full PowerPoint support, consider using a specialized library
    return new Promise((resolve) => {
      resolve(`[PowerPoint file: ${file.name}] - Nội dung PowerPoint cần được xử lý thủ công. Vui lòng mô tả nội dung slide để tạo mindmap.`);
    });
  }

  /**
   * Get supported file types
   */
  static getSupportedFileTypes(): string[] {
    return [
      // Text files
      'text/plain',
      'text/csv',
      'text/html',
      'text/xml',
      'application/json',
      
      // PDF
      'application/pdf',
      
      // Word documents
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/msword', // .doc
      
      // Excel files
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      
      // PowerPoint files
      'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
      'application/vnd.ms-powerpoint', // .ppt
      
      // Images (for Gemini)
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp'
    ];
  }

  /**
   * Check if file type is supported
   */
  static isFileTypeSupported(fileType: string): boolean {
    return this.getSupportedFileTypes().includes(fileType);
  }

  /**
   * Parse PDF from URL/path
   */
  static async parsePDFFromUrl(url: string): Promise<string> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch PDF: ${response.statusText}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const typedArray = new Uint8Array(arrayBuffer);
      const pdf = await pdfjsLib.getDocument(typedArray).promise;
      
      let fullText = '';
      
      // Extract text from all pages
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .filter((item: any) => item.str)
          .map((item: any) => item.str)
          .join(' ');
        fullText += `\n--- Trang ${i} ---\n${pageText}\n`;
      }
      
      return fullText.trim();
    } catch (error) {
      throw new Error(`Lỗi khi đọc PDF từ URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get file type description
   */
  static getFileTypeDescription(fileType: string): string {
    const descriptions: Record<string, string> = {
      'text/plain': 'Text file',
      'text/csv': 'CSV file',
      'application/pdf': 'PDF document',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word document',
      'application/msword': 'Word document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel spreadsheet',
      'application/vnd.ms-excel': 'Excel spreadsheet',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PowerPoint presentation',
      'application/vnd.ms-powerpoint': 'PowerPoint presentation',
      'image/jpeg': 'JPEG image',
      'image/png': 'PNG image',
      'image/gif': 'GIF image',
      'image/webp': 'WebP image'
    };
    
    return descriptions[fileType] || 'Unknown file type';
  }
}
