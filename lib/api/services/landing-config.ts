import { apiClient } from '../client'

export type LandingConfigItem = {
  id: string
  type: string
  order: number
  visible: boolean
  content: Record<string, any>
}

export type GlobalStyles = {
  paletteId: string
  fontPairId: string
  buttonStyle: 'rounded' | 'square' | 'pill'
}

export type LandingConfigResponse = {
  templateId: string
  landingConfig: LandingConfigItem[]
  globalStyles: GlobalStyles
}

export const landingConfigService = {
  /**
   * Obtiene la configuración de la landing page (plantilla, secciones, estilos)
   */
  getLandingConfig: async (): Promise<LandingConfigResponse> => {
    return apiClient.get('/api/landing-page/config')
  },

  /**
   * Guarda/actualiza la configuración de la landing page
   */
  updateLandingConfig: async (data: {
    templateId: string
    landingConfig: LandingConfigItem[]
    globalStyles: GlobalStyles
  }): Promise<LandingConfigResponse> => {
    return apiClient.put('/api/landing-page/config', data)
  },

  /**
   * Obtiene el catálogo de plantillas predefinidas
   */
  getTemplates: async (): Promise<any[]> => {
    return apiClient.get('/api/landing-page/templates')
  },
}
