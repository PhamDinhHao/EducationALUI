import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import domtoimage from 'dom-to-image';

/**
 * Simple PDF Exporter cho jsMind
 * Sử dụng jsPDF + dom-to-image/html2canvas để convert HTML sang PDF/PNG
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

      // Reset transform của jsmind-inner trước khi capture
      const jsmindInner = container.querySelector('.jsmind-inner') as HTMLElement;
      const originalInnerTransform = jsmindInner ? jsmindInner.style.transform : '';
      const originalInnerTransformOrigin = jsmindInner ? jsmindInner.style.transformOrigin : '';
      
      if (jsmindInner) {
        jsmindInner.style.transform = 'none';
        jsmindInner.style.transformOrigin = 'top left';
      }

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
      // Lấy bounding box để đảm bảo capture đầy đủ
      const mindmapBounds = (mindmapContent as HTMLElement).getBoundingClientRect();
      const containerBounds = container.getBoundingClientRect();
      
      const contentWidth = Math.max(
        container.scrollWidth || 0, 
        mindmapContent.scrollWidth || 0,
        mindmapBounds.width || 0,
        containerBounds.width || 0,
        1200 // Minimum width
      );
      const contentHeight = Math.max(
        container.scrollHeight || 0, 
        mindmapContent.scrollHeight || 0,
        mindmapBounds.height || 0,
        containerBounds.height || 0,
        800 // Minimum height
      );

      // 7. Set container size để fit toàn bộ content
      const padding = 50;
      container.style.width = `${contentWidth + padding}px`;
      container.style.height = `${contentHeight + padding}px`;
      container.style.maxWidth = 'none';
      container.style.maxHeight = 'none';

      // 8. Đợi render xong
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // 9. Sử dụng dom-to-image thay vì html2canvas để xử lý SVG tốt hơn
      let canvas: HTMLCanvasElement;
      try {
        // Thử dùng dom-to-image trước (xử lý SVG tốt hơn)
        const dataUrl = await domtoimage.toPng(container, {
          quality: 1.0,
          width: contentWidth + padding,
          height: contentHeight + padding,
          style: {
            transform: 'scale(1)',
            transformOrigin: 'top left'
          },
          filter: () => {
            // Không filter gì cả - lấy tất cả
            return true;
          }
        });
        
        // Convert dataUrl sang canvas với scale cao
        const img = new Image();
        img.crossOrigin = 'anonymous';
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = reject;
          img.src = dataUrl;
        });
        
        canvas = document.createElement('canvas');
        const scale = 3; // Scale 3x để text rõ
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Failed to get canvas context');
        
        // Enable image smoothing for better quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      } catch (domError) {
        console.warn('dom-to-image failed, falling back to html2canvas:', domError);
        // Fallback to html2canvas
        canvas = await html2canvas(container, {
          backgroundColor: '#ffffff',
          scale: 3,
          useCORS: true,
          allowTaint: true,
          logging: false,
          onclone: (clonedDoc) => {
            const clonedContainer = clonedDoc.getElementById(containerId);
            if (clonedContainer) {
              const clonedInner = clonedContainer.querySelector('.jsmind-inner') as HTMLElement;
              if (clonedInner) {
                clonedInner.style.transform = 'none';
                clonedInner.style.transformOrigin = 'top left';
              }
            }
          }
        });
      }

      // 9. Khôi phục styles gốc
      Object.assign(container.style, originalStyles);
      
      // Khôi phục transform của jsmind-inner
      if (jsmindInner) {
        jsmindInner.style.transform = originalInnerTransform;
        jsmindInner.style.transformOrigin = originalInnerTransformOrigin;
      }

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

      // Reset transform của jsmind-inner trước khi capture
      const jsmindInner = container.querySelector('.jsmind-inner') as HTMLElement;
      const originalInnerTransform = jsmindInner ? jsmindInner.style.transform : '';
      const originalInnerTransformOrigin = jsmindInner ? jsmindInner.style.transformOrigin : '';
      
      if (jsmindInner) {
        jsmindInner.style.transform = 'none';
        jsmindInner.style.transformOrigin = 'top left';
      }

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
      // Lấy bounding box để đảm bảo capture đầy đủ
      const mindmapBounds = (mindmapContent as HTMLElement).getBoundingClientRect();
      const containerBounds = container.getBoundingClientRect();
      
      const contentWidth = Math.max(
        container.scrollWidth || 0, 
        mindmapContent.scrollWidth || 0,
        mindmapBounds.width || 0,
        containerBounds.width || 0,
        1200 // Minimum width
      );
      const contentHeight = Math.max(
        container.scrollHeight || 0, 
        mindmapContent.scrollHeight || 0,
        mindmapBounds.height || 0,
        containerBounds.height || 0,
        800 // Minimum height
      );

      // 7. Set container size để fit toàn bộ content
      const padding = 50;
      container.style.width = `${contentWidth + padding}px`;
      container.style.height = `${contentHeight + padding}px`;
      container.style.maxWidth = 'none';
      container.style.maxHeight = 'none';

      // 8. Đợi render xong
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // 9. Sử dụng dom-to-image thay vì html2canvas để xử lý SVG tốt hơn
      let canvas: HTMLCanvasElement;
      try {
        // Thử dùng dom-to-image trước (xử lý SVG tốt hơn)
        const dataUrl = await domtoimage.toPng(container, {
          quality: 1.0,
          width: contentWidth + padding,
          height: contentHeight + padding,
          style: {
            transform: 'scale(1)',
            transformOrigin: 'top left'
          },
          filter: () => {
            // Không filter gì cả - lấy tất cả
            return true;
          }
        });
        
        // Convert dataUrl sang canvas với scale cao
        const img = new Image();
        img.crossOrigin = 'anonymous';
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = reject;
          img.src = dataUrl;
        });
        
        canvas = document.createElement('canvas');
        const finalScale = Math.max(scale, 3); // Scale tối thiểu 3x
        canvas.width = img.width * finalScale;
        canvas.height = img.height * finalScale;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Failed to get canvas context');
        
        // Enable image smoothing for better quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      } catch (domError) {
        console.warn('dom-to-image failed, falling back to html2canvas:', domError);
        // Fallback to html2canvas
        const finalScale = Math.max(scale, 3);
        canvas = await html2canvas(container, {
          backgroundColor: '#ffffff',
          scale: finalScale,
          useCORS: true,
          allowTaint: true,
          logging: false,
          onclone: (clonedDoc) => {
            const clonedContainer = clonedDoc.getElementById(containerId);
            if (clonedContainer) {
              const clonedInner = clonedContainer.querySelector('.jsmind-inner') as HTMLElement;
              if (clonedInner) {
                clonedInner.style.transform = 'none';
                clonedInner.style.transformOrigin = 'top left';
              }
            }
          }
        });
      }

      // 9. Khôi phục styles gốc
      Object.assign(container.style, originalStyles);
      
      // Khôi phục transform của jsmind-inner
      if (jsmindInner) {
        jsmindInner.style.transform = originalInnerTransform;
        jsmindInner.style.transformOrigin = originalInnerTransformOrigin;
      }

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
