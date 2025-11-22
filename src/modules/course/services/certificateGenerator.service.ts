import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { Certificate } from './certificate.service'
import { CertificateTemplate } from '../components/CertificateTemplate/CertificateTemplate'
import React from 'react'
import { createRoot } from 'react-dom/client'

/**
 * Generate certificate as PDF
 */
export const generateCertificatePDF = async (
  certificate: Certificate,
  user?: { name?: string | null; email?: string }
): Promise<Blob> => {
  // Create a temporary container
  const container = document.createElement('div')
  container.style.position = 'absolute'
  container.style.left = '-9999px'
  container.style.top = '-9999px'
  container.style.width = '1200px'
  container.style.height = '800px'
  document.body.appendChild(container)

  try {
    // Render certificate template
    const root = createRoot(container)
    root.render(
      React.createElement(CertificateTemplate, {
        certificate,
        user
      })
    )

    // Wait for rendering
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Find the certificate element
    const certificateElement = container.querySelector('#certificate-template') as HTMLElement
    if (!certificateElement) {
      throw new Error('Certificate template not found')
    }

    // Generate canvas from HTML
    const canvas = await html2canvas(certificateElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
      logging: false,
      width: 1200,
      height: 800
    })

    // Convert canvas to PDF
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [297, 210] // A4 landscape
    })

    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = canvas.width
    const imgHeight = canvas.height
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
    const imgX = (pdfWidth - imgWidth * ratio) / 2
    const imgY = 0

    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)
    const pdfBlob = pdf.output('blob')

    // Cleanup
    try {
      root.unmount()
    } catch (e) {
      console.warn('Error unmounting root:', e)
    }
    if (container.parentNode) {
      document.body.removeChild(container)
    }

    return pdfBlob
  } catch (error) {
    // Cleanup on error
    try {
      if (container.parentNode) {
        document.body.removeChild(container)
      }
    } catch (cleanupError) {
      console.warn('Error during cleanup:', cleanupError)
    }
    throw error
  }
}

/**
 * Generate certificate as PNG image
 */
export const generateCertificateImage = async (
  certificate: Certificate,
  user?: { name?: string | null; email?: string }
): Promise<Blob> => {
  // Create a temporary container
  const container = document.createElement('div')
  container.style.position = 'absolute'
  container.style.left = '-9999px'
  container.style.top = '-9999px'
  container.style.width = '1200px'
  container.style.height = '800px'
  document.body.appendChild(container)

  try {
    // Render certificate template
    const root = createRoot(container)
    root.render(
      React.createElement(CertificateTemplate, {
        certificate,
        user
      })
    )

    // Wait for rendering
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Find the certificate element
    const certificateElement = container.querySelector('#certificate-template') as HTMLElement
    if (!certificateElement) {
      throw new Error('Certificate template not found')
    }

    // Generate canvas from HTML
    const canvas = await html2canvas(certificateElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
      logging: false,
      width: 1200,
      height: 800
    })

    // Convert canvas to blob
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Failed to generate image blob'))
          }
        },
        'image/png',
        1.0
      )
    })

    // Cleanup
    try {
      root.unmount()
    } catch (e) {
      console.warn('Error unmounting root:', e)
    }
    if (container.parentNode) {
      document.body.removeChild(container)
    }

    return blob
  } catch (error) {
    // Cleanup on error
    try {
      if (container.parentNode) {
        document.body.removeChild(container)
      }
    } catch (cleanupError) {
      console.warn('Error during cleanup:', cleanupError)
    }
    throw error
  }
}

/**
 * Download certificate as PDF
 */
export const downloadCertificatePDF = async (
  certificate: Certificate,
  user?: { name?: string | null; email?: string }
): Promise<void> => {
  try {
    const blob = await generateCertificatePDF(certificate, user)
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `certificate-${certificate.certificateNumber}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error downloading certificate PDF:', error)
    throw error
  }
}

/**
 * Download certificate as PNG image
 */
export const downloadCertificateImage = async (
  certificate: Certificate,
  user?: { name?: string | null; email?: string }
): Promise<void> => {
  try {
    const blob = await generateCertificateImage(certificate, user)
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `certificate-${certificate.certificateNumber}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error downloading certificate image:', error)
    throw error
  }
}

