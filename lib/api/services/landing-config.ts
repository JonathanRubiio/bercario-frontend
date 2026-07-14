import { apiClient } from '../client'

export type LandingConfigItem = {
  id: string
  type: string
  order: number
  visible: boolean
  content: Record<string, any>
}

export const landingConfigService = {
  /**
   * Obtiene la configuración del constructor de la landing page del usuario logueado
   */
  getLandingConfig: async (): Promise<LandingConfigItem[]> => {
    return apiClient.get('/api/landing-page/config')
  },

  /**
   * Guarda/actualiza la configuración del constructor de la landing page
   */
  updateLandingConfig: async (config: LandingConfigItem[]): Promise<LandingConfigItem[]> => {
    return apiClient.post('/api/landing-page/config', { config })
  },
}
