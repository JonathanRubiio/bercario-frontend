import { apiClient } from '../client'

export const uploadService = {
  /**
   * Sube una imagen al servidor y retorna su URL en S3/MinIO
   */
  uploadImage: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.post('/api/upload', formData)
  },
}
