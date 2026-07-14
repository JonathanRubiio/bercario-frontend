'use client'

import { Button } from '@/components/ui/button'
import type { BusinessProfile, LandingSection } from '@/lib/bercario-data'
import { X, Globe } from 'lucide-react'
import { PublicBusinessLanding } from './public-business-landing'

export function BusinessPreview({
  open,
  onClose,
  profile,
  sections,
}: {
  open: boolean
  onClose: () => void
  profile: BusinessProfile
  sections: LandingSection[]
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-foreground/40 backdrop-blur-sm">
      {/* Browser chrome */}
      <div className="flex items-center gap-3 border-b border-border bg-card px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-muted-foreground/30" />
          <span className="h-3 w-3 rounded-full bg-muted-foreground/30" />
          <span className="h-3 w-3 rounded-full bg-muted-foreground/30" />
        </div>
        <div className="flex flex-1 items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-xs text-muted-foreground">
          <Globe className="h-3.5 w-3.5" />
          bercario.co/{profile.slug}
        </div>
        <Button
          size="sm"
          variant="outline"
          className="rounded-full bg-transparent"
          onClick={onClose}
        >
          <X className="mr-1 h-4 w-4" /> Cerrar vista
        </Button>
      </div>

      {/* Scrollable rendered landing */}
      <div className="flex-1 overflow-y-auto bg-background">
        <PublicBusinessLanding profile={profile} sections={sections} />
      </div>
    </div>
  )
}
