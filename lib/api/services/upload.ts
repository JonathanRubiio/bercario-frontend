import { apiClient } from '../client'

export const uploadService = {
  /**
   * Sube una imagen al servidor y retorna su URL en S3/MinIO
   */
  uploadImage: async (file: File, type?: string): Promise<{ url: string }> => {
    const formData = new FormData()
    formData.append('file', file)
    const path = type ? `/api/upload?type=${encodeURIComponent(type)}` : '/api/upload'
    return apiClient.post(path, formData)
  },
}
