'use client'

import { use, useState, useEffect } from 'react'
import { PublicBusinessLanding } from '@/components/preview/public-business-landing'
import { profileService } from '@/lib/api/services/profile'
import {
  initialProfile,
  defaultSections,
  type BusinessProfile,
  type LandingSection,
} from '@/lib/bercario-data'

export default function BusinessLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const [profile, setProfile] = useState<BusinessProfile | null>(null)
  const [sections, setSections] = useState<LandingSection[]>(defaultSections)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchLanding() {
      try {
        // En modo demo o local, si coincide con el slug por defecto,
        // primero revisamos si hay algo editado en localStorage para esta sesión.
        if (slug === 'calzado-la-frontera') {
          const cachedProfile = localStorage.getItem('bercario_profile')
          const cachedSections = localStorage.getItem('bercario_sections')

          if (cachedProfile) {
            setProfile(JSON.parse(cachedProfile))
          } else {
            setProfile(initialProfile)
          }

          if (cachedSections) {
            setSections(JSON.parse(cachedSections))
          }
          setLoading(false)
          return
        }

        // De lo contrario, intentamos conectar con la API real
        const data = await profileService.getProfileBySlug(slug)
        if (data) {
          setProfile(data)
          // Secciones pueden cargarse desde el backend si las provee
        } else {
          setError('El negocio solicitado no existe.')
        }
      } catch (err) {
        console.warn('Fallo al cargar perfil desde el backend, intentando mock:', err)
        // Fallback a mock si falla la conexión y es el slug demo
        if (slug === 'calzado-la-frontera' || slug === 'demo') {
          setProfile(initialProfile)
        } else {
          setError('No pudimos conectar con el servidor para cargar este negocio.')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchLanding()
  }, [slug])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Cargando sitio...</p>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-secondary/40 px-5 text-center">
        <h1 className="font-serif text-2xl font-semibold text-foreground">Sitio no disponible</h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-sm">
          {error || 'El perfil comercial que buscas no está disponible en este momento.'}
        </p>
        <a
          href="/"
          className="mt-6 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Ir a Berçário
        </a>
      </div>
    )
  }

  return <PublicBusinessLanding profile={profile} sections={sections} />
}
