import { apiClient } from '../client'
import type { BusinessProfile, LandingSection } from '@/lib/bercario-data'

export const profileService = {
  /**
   * Obtiene un perfil comercial público usando su slug
   */
  getProfileBySlug: async (slug: string): Promise<BusinessProfile> => {
    return apiClient.get<BusinessProfile>(`/api/profiles/${slug}`)
  },

  /**
   * Obtiene el perfil comercial del usuario autenticado actual
   */
  getMyProfile: async (): Promise<BusinessProfile> => {
    return apiClient.get<BusinessProfile>('/api/profile')
  },

  /**
   * Actualiza el perfil comercial del usuario autenticado actual
   */
  updateProfile: async (profile: Partial<BusinessProfile>): Promise<BusinessProfile> => {
    return apiClient.put<BusinessProfile>('/api/profile', profile)
  },

  /**
   * Guarda el orden y estado de las secciones de la landing del usuario autenticado actual
   */
  updateSections: async (sections: LandingSection[]): Promise<LandingSection[]> => {
    return apiClient.put<LandingSection[]>('/api/profile/sections', { sections })
  },
}
