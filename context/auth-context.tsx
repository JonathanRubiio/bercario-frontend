'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { authService, type User } from '@/lib/api/services/auth'

type AuthContextType = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  // Intentar cargar el usuario actual al montar la aplicación
  useEffect(() => {
    async function loadUser() {
      const token = typeof window !== 'undefined' ? localStorage.getItem('bercario_token') : null
      
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const currentUser = await authService.getCurrentUser()
        setUser(currentUser)
      } catch (err) {
        console.error('Error cargando usuario inicial:', err)
        // Si falla la verificación (token expirado), limpiamos
        localStorage.removeItem('bercario_token')
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  // Proteger la ruta de la plataforma
  useEffect(() => {
    if (!loading) {
      const isPlatformRoute = pathname?.startsWith('/platform')
      if (isPlatformRoute && !user) {
        router.push('/login')
      }
    }
  }, [user, loading, pathname, router])

  const handleLogin = async (email: string, password: string) => {
    setError(null)
    setLoading(true)

    try {
      const response = await authService.login(email, password)
      setUser(response.user)
      router.push('/platform')
    } catch (err: any) {
      console.error('Error de login:', err)
      setError(err?.message || 'Credenciales inválidas o error de conexión.')
      throw err;
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    setLoading(true)

    try {
      await authService.logout()
    } catch (err) {
      console.error('Error durante el logout en backend:', err)
    } finally {
      localStorage.removeItem('bercario_token')
      setUser(null)
      setLoading(false)
      router.push('/')
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login: handleLogin,
        logout: handleLogout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider')
  }
  return context
}
