import { apiClient } from '../client'

export type DomainConfig = {
  customDomain: string | null
  subdomain: string | null
  domainVerified: boolean
}

export const domainService = {
  /**
   * Obtiene la configuración actual de dominios
   */
  getDomainConfig: async (): Promise<DomainConfig> => {
    return apiClient.get('/api/profile') // El endpoint de perfil ya retorna las columnas customDomain, subdomain y domainVerified
  },

  /**
   * Vincula un dominio personalizado y/o subdominio
   */
  linkDomain: async (data: { customDomain?: string | null; subdomain?: string | null }): Promise<DomainConfig> => {
    return apiClient.put('/api/profile/domain', data)
  },

  /**
   * Dispara el proceso de validación DNS en el backend
   */
  verifyDomain: async (): Promise<{ success: boolean; domainVerified: boolean; message?: string }> => {
    return apiClient.post('/api/profile/domain/verify')
  },
}
