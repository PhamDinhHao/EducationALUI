import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Simple PDF Exporter cho jsMind
 * Sử dụng jsPDF + html2canvas để convert HTML sang PDF
 */
export class SimplePDFExporter {
  /**
   * Export mindmap từ jsMind container sang PDF
   */
  static async exportToPDF(options: {
    containerId?: string;
    filename?: string;
    format?: 'a4' | 'a3' | 'letter';
    orientation?: 'portrait' | 'landscape';
    margin?: number;
  } = {}): Promise<void> {
    const {
      containerId = 'jsmind_container',
      filename = `mindmap-${Date.now()}.pdf`,
      format = 'a4',
      orientation = 'landscape',
      margin = 20
    } = options;

    try {
      // 1. Lấy container jsMind
      const container = document.getElementById(containerId);
      if (!container) {
        throw new Error(`Container với id "${containerId}" không tồn tại`);
      }

      // 2. Kiểm tra có mindmap content không
      const mindmapContent = container.querySelector('.jsmind-inner');
      if (!mindmapContent) {
        throw new Error('Không tìm thấy mindmap content trong container');
      }

      // 3. Chuẩn bị container để capture toàn bộ content
      const originalStyles = {
        overflow: container.style.overflow,
        height: container.style.height,
        width: container.style.width,
        maxHeight: container.style.maxHeight,
        maxWidth: container.style.maxWidth,
        border: container.style.border,
        borderRadius: container.style.borderRadius,
        transform: container.style.transform,
        transformOrigin: container.style.transformOrigin
      };

      // 4. Tạm thời mở rộng container để hiển thị toàn bộ content
      container.style.overflow = 'visible';
      container.style.border = 'none';
      container.style.borderRadius = '0';
      container.style.background = '#ffffff';
      container.style.transform = 'none';
      container.style.transformOrigin = 'top left';

      // 5. Đợi reflow
      await new Promise(resolve => requestAnimationFrame(() => resolve(null)));

      // 6. Tính toán kích thước thực tế của content
      const contentWidth = Math.max(container.scrollWidth, mindmapContent.scrollWidth);
      const contentHeight = Math.max(container.scrollHeight, mindmapContent.scrollHeight);

      // 7. Set container size để fit toàn bộ content
      container.style.width = `${contentWidth}px`;
      container.style.height = `${contentHeight}px`;
      container.style.maxWidth = 'none';
      container.style.maxHeight = 'none';

      // 8. Capture container với kích thước đầy đủ
      const canvas = await html2canvas(container, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: contentWidth,
        height: contentHeight,
        scrollX: 0,
        scrollY: 0
      });

      // 9. Khôi phục styles gốc
      Object.assign(container.style, originalStyles);

      // 4. Tạo PDF với jsPDF
      const pdf = new jsPDF({
        orientation: orientation,
        unit: 'mm',
        format: format
      });

      // 5. Calculate dimensions
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const availableWidth = pageWidth - (margin * 2);
      const availableHeight = pageHeight - (margin * 2);

      // 6. Calculate scale để fit canvas vào page
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const scaleX = availableWidth / canvasWidth;
      const scaleY = availableHeight / canvasHeight;
      const finalScale = Math.min(scaleX, scaleY, 1);

      // 7. Calculate final dimensions và position
      const finalWidth = canvasWidth * finalScale;
      const finalHeight = canvasHeight * finalScale;
      const x = margin + (availableWidth - finalWidth) / 2;
      const y = margin + (availableHeight - finalHeight) / 2;

      // 8. Add canvas vào PDF
      const imgData = canvas.toDataURL('image/png', 1.0);
      pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);

      // 9. Save PDF
      pdf.save(filename);


    } catch (error) {
      console.error('❌ PDF export error:', error);
      
      // Đảm bảo khôi phục styles ngay cả khi có lỗi
      try {
        const container = document.getElementById(containerId);
        if (container) {
          container.style.overflow = '';
          container.style.height = '';
          container.style.width = '';
          container.style.maxHeight = '';
          container.style.maxWidth = '';
          container.style.border = '';
          container.style.borderRadius = '';
          container.style.background = '';
          container.style.transform = '';
          container.style.transformOrigin = '';
        }
      } catch (restoreError) {
        console.warn('Error restoring styles:', restoreError);
      }
      
      throw error;
    }
  }

  /**
   * Export PNG từ jsMind container
   */
  static async exportToPNG(options: {
    containerId?: string;
    filename?: string;
    scale?: number;
  } = {}): Promise<void> {
    const {
      containerId = 'jsmind_container',
      filename = `mindmap-${Date.now()}.png`,
      scale = 2
    } = options;

    try {
      // 1. Lấy container jsMind
      const container = document.getElementById(containerId);
      if (!container) {
        throw new Error(`Container với id "${containerId}" không tồn tại`);
      }

      // 2. Kiểm tra có mindmap content không
      const mindmapContent = container.querySelector('.jsmind-inner');
      if (!mindmapContent) {
        throw new Error('Không tìm thấy mindmap content trong container');
      }

      // 3. Chuẩn bị container để capture toàn bộ content
      const originalStyles = {
        overflow: container.style.overflow,
        height: container.style.height,
        width: container.style.width,
        maxHeight: container.style.maxHeight,
        maxWidth: container.style.maxWidth,
        border: container.style.border,
        borderRadius: container.style.borderRadius,
        transform: container.style.transform,
        transformOrigin: container.style.transformOrigin
      };

      // 4. Tạm thời mở rộng container để hiển thị toàn bộ content
      container.style.overflow = 'visible';
      container.style.border = 'none';
      container.style.borderRadius = '0';
      container.style.background = '#ffffff';
      container.style.transform = 'none';
      container.style.transformOrigin = 'top left';

      // 5. Đợi reflow
      await new Promise(resolve => requestAnimationFrame(() => resolve(null)));

      // 6. Tính toán kích thước thực tế của content
      const contentWidth = Math.max(container.scrollWidth, mindmapContent.scrollWidth);
      const contentHeight = Math.max(container.scrollHeight, mindmapContent.scrollHeight);

      // 7. Set container size để fit toàn bộ content
      container.style.width = `${contentWidth}px`;
      container.style.height = `${contentHeight}px`;
      container.style.maxWidth = 'none';
      container.style.maxHeight = 'none';

      // 8. Capture container với kích thước đầy đủ
      const canvas = await html2canvas(container, {
        backgroundColor: '#ffffff',
        scale: scale,
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: contentWidth,
        height: contentHeight,
        scrollX: 0,
        scrollY: 0
      });

      // 9. Khôi phục styles gốc
      Object.assign(container.style, originalStyles);

      // 4. Download PNG
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      }, 'image/png', 1.0);


    } catch (error) {
      console.error('❌ PNG export error:', error);
      
      // Đảm bảo khôi phục styles ngay cả khi có lỗi
      try {
        const container = document.getElementById(containerId);
        if (container) {
          container.style.overflow = '';
          container.style.height = '';
          container.style.width = '';
          container.style.maxHeight = '';
          container.style.maxWidth = '';
          container.style.border = '';
          container.style.borderRadius = '';
          container.style.background = '';
          container.style.transform = '';
          container.style.transformOrigin = '';
        }
      } catch (restoreError) {
        console.warn('Error restoring styles:', restoreError);
      }
      
      throw error;
    }
  }
}

// Export singleton instance
export const simplePDFExporter = SimplePDFExporter;
