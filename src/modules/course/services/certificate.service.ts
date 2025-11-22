import { ApiService } from '@/shared/services'
import env from '@/shared/core/constants/env'

export interface Certificate {
  id: number
  userId: number
  courseId: number
  certificateNumber: string
  issuedAt: string
  pdfUrl?: string | null
  imageUrl?: string | null
  createdAt: string
  updatedAt: string
  course?: {
    id: number
    title: string
    teacher: string
    img?: string | null
  }
}

export const createCertificate = async (courseId: number): Promise<Certificate> => {
  try {
    const res = await ApiService.post('certificates', { courseId })
    return res.data?.data || res.data
  } catch (error) {
    console.error('Error creating certificate:', error)
    throw error
  }
}

export const getMyCertificates = async (): Promise<Certificate[]> => {
  try {
    const res = await ApiService.get('certificates/me')
    return res.data?.data || res.data || []
  } catch (error) {
    console.error('Error fetching certificates:', error)
    return []
  }
}

export const getCertificateById = async (certificateId: number): Promise<Certificate | null> => {
  try {
    const res = await ApiService.get(`certificates/${certificateId}`)
    return res.data?.data || res.data || null
  } catch (error) {
    console.error('Error fetching certificate:', error)
    return null
  }
}

export const downloadCertificate = async (certificateId: number): Promise<void> => {
  try {
    // Use fetch directly for blob response
    const response = await fetch(`${env.VITE_HOST_API}/certificates/${certificateId}/download`, {
      credentials: 'include'
    })
    
    if (!response.ok) {
      throw new Error('Failed to download certificate')
    }
    
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `certificate-${certificateId}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error downloading certificate:', error)
    throw error
  }
}

