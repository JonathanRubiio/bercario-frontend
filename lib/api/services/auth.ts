import { apiClient, setAuthToken } from '../client'

export type User = {
  id: string
  email: string
  name: string
  role: 'mayorista' | 'admin'
  businessSlug?: string
}

export type LoginResponse = {
  token: string
  user: User
}

export const authService = {
  /**
   * Inicia sesión con credenciales
   */
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const data = await apiClient.post<LoginResponse>('/api/auth/login', {
      email,
      password,
    })
    setAuthToken(data.token)
    return data
  },

  /**
   * Obtiene la información del usuario autenticado actual a partir del token
   */
  getCurrentUser: async (): Promise<User> => {
    return apiClient.get<User>('/api/auth/me')
  },

  /**
   * Cierra la sesión limpiando el token local
   */
  logout: async (): Promise<void> => {
    try {
      // Opcional: avisar al backend del logout si es necesario
      await apiClient.post('/api/auth/logout').catch(() => {
        // Ignorar si el endpoint falla o no existe
      })
    } finally {
      setAuthToken(null)
    }
  },
}
