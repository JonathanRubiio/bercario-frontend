'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/auth-context'
import { PlatformShell } from '@/components/platform/platform-shell'
import { BusinessPreview } from '@/components/preview/business-preview'
import { profileService } from '@/lib/api/services/profile'
import {
  initialProfile,
  defaultSections,
  type BusinessProfile,
  type LandingSection,
} from '@/lib/bercario-data'

export default function PlatformPage() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<BusinessProfile>(initialProfile)
  const [sections, setSections] = useState<LandingSection[]>(defaultSections)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [fetching, setFetching] = useState(true)

  // Cargar datos del perfil del backend o demo al cargar la ruta
  useEffect(() => {
    if (loading) return
    if (!user) {
      router.push('/login')
      return
    }

    async function loadData() {
      try {
        const token = localStorage.getItem('bercario_token')
        // Si es token demo, usamos los datos locales
        if (token === 'demo-token-12345') {
          // Intentar leer de localStorage si ya hay modificaciones locales
          const cachedProfile = localStorage.getItem('bercario_profile')
          const cachedSections = localStorage.getItem('bercario_sections')

          if (cachedProfile) setProfile(JSON.parse(cachedProfile))
          if (cachedSections) setSections(JSON.parse(cachedSections))
          
          setFetching(false)
          return
        }

        // Si es backend real
        const data = await profileService.getMyProfile()
        if (data) {
          setProfile(data)
          if (data.faqs) { // o la estructura que venga de backend
            // Ajustar secciones si el backend las tiene
          }
        }
      } catch (err) {
        console.warn('No se pudo conectar al backend real, usando datos mock.', err)
        // Fallback a localStorage para mantener persistencia mock en desarrollo
        const cachedProfile = localStorage.getItem('bercario_profile')
        const cachedSections = localStorage.getItem('bercario_sections')

        if (cachedProfile) setProfile(JSON.parse(cachedProfile))
        if (cachedSections) setSections(JSON.parse(cachedSections))
      } finally {
        setFetching(false)
      }
    }

    loadData()
  }, [user, loading, router])

  // Handlers para guardar cambios localmente y/o en el backend
  const handleProfileChange = async (updatedProfile: BusinessProfile) => {
    setProfile(updatedProfile)
    
    // Guardar localmente
    localStorage.setItem('bercario_profile', JSON.stringify(updatedProfile))

    // Intentar sincronizar con backend
    const token = localStorage.getItem('bercario_token')
    if (token && token !== 'demo-token-12345') {
      try {
        await profileService.updateProfile(updatedProfile)
      } catch (err) {
        console.error('Error al guardar el perfil en el servidor:', err)
      }
    }
  }

  const handleSectionsChange = async (updatedSections: LandingSection[]) => {
    setSections(updatedSections)

    // Guardar localmente
    localStorage.setItem('bercario_sections', JSON.stringify(updatedSections))

    // Intentar sincronizar con backend
    const token = localStorage.getItem('bercario_token')
    if (token && token !== 'demo-token-12345') {
      try {
        await profileService.updateSections(updatedSections)
      } catch (err) {
        console.error('Error al guardar las secciones en el servidor:', err)
      }
    }
  }

  if (loading || fetching) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary/40">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Cargando tu panel de control...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <PlatformShell
        profile={profile}
        onProfileChange={handleProfileChange}
        sections={sections}
        onSectionsChange={handleSectionsChange}
        onLogout={logout}
        onPreview={() => setPreviewOpen(true)}
      />

      <BusinessPreview
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        profile={profile}
        sections={sections}
      />
    </>
  )
}
