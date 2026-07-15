'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Phone, Mail, MapPin, ShoppingBag } from 'lucide-react'
import { cn } from '@/lib/utils'
import { 
  type BusinessProfile, 
  type LandingSection, 
  palettes, 
  fontPairs 
} from '@/lib/bercario-data'

function EditableTextInline({
  value,
  onSave,
  className,
  as: Element = 'span',
  type = 'input',
}: {
  value: string
  onSave?: (val: string) => void
  className?: string
  as?: any
  type?: 'input' | 'textarea'
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [tempValue, setTempValue] = useState(value)

  useEffect(() => {
    setTempValue(value)
  }, [value])

  if (!onSave) {
    return <Element className={className}>{value}</Element>
  }

  if (isEditing) {
    return type === 'textarea' ? (
      <textarea
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={() => {
          setIsEditing(false)
          if (tempValue.trim() !== '') {
            onSave(tempValue)
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setIsEditing(false)
            setTempValue(value)
          }
        }}
        className={cn(
          "bg-background text-foreground border border-primary focus:outline-none focus:ring-1 focus:ring-primary px-1 py-0.5 rounded w-full min-h-[80px] text-sm",
          className
        )}
        autoFocus
        onClick={(e) => e.stopPropagation()}
        onDoubleClick={(e) => e.stopPropagation()}
      />
    ) : (
      <input
        type="text"
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={() => {
          setIsEditing(false)
          if (tempValue.trim() !== '') {
            onSave(tempValue)
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            setIsEditing(false)
            if (tempValue.trim() !== '') {
              onSave(tempValue)
            }
          } else if (e.key === 'Escape') {
            setIsEditing(false)
            setTempValue(value)
          }
        }}
        className={cn(
          "bg-background text-foreground border border-primary focus:outline-none focus:ring-1 focus:ring-primary px-1 py-0.5 rounded w-full text-inherit",
          className
        )}
        autoFocus
        onClick={(e) => e.stopPropagation()}
        onDoubleClick={(e) => e.stopPropagation()}
      />
    )
  }

  return (
    <Element
      onDoubleClick={(e: any) => {
        e.stopPropagation()
        setIsEditing(true)
      }}
      className={cn(
        "cursor-pointer hover:bg-primary/10 hover:ring-1 hover:ring-primary/30 px-1 py-0.5 rounded transition-all inline-block max-w-full", 
        className
      )}
      title="Doble clic para editar"
    >
      {value}
    </Element>
  )
}

export function PublicBusinessLanding({
  profile,
  sections,
  globalStyles,
  onInlineEdit,
  onImageClick,
}: {
  profile: BusinessProfile
  sections: LandingSection[]
  globalStyles?: { paletteId: string; fontPairId: string; buttonStyle: 'rounded' | 'square' | 'pill' }
  onInlineEdit?: (sectionId: string, fieldKey: string, newValue: string, index?: number, itemKey?: string) => void
  onImageClick?: (type: 'logo' | 'banner' | { sectionId: string; contentKey: string }) => void
}) {
  const activePalette = palettes.find((p) => p.id === globalStyles?.paletteId) || palettes[0]
  const activeFont = fontPairs.find((f) => f.id === globalStyles?.fontPairId) || fontPairs[0]
  const activeRadius =
    globalStyles?.buttonStyle === 'square'
      ? '0px'
      : globalStyles?.buttonStyle === 'pill'
      ? '9999px'
      : '0.5rem'

  return (
    <div
      className="w-full transition-colors duration-400 ease-in-out pb-10"
      style={{
        backgroundColor: activePalette.colors[0],
        color: activePalette.colors[2],
        fontFamily: activeFont.bodyFont,
        '--preview-bg': activePalette.colors[0],
        '--preview-primary': activePalette.colors[1],
        '--preview-text': activePalette.colors[2],
        '--preview-font-title': activeFont.titleFont,
        '--preview-font-body': activeFont.bodyFont,
        '--preview-btn-radius': activeRadius,
      } as React.CSSProperties}
    >
      <div className="mx-auto max-w-4xl transition-all duration-300">
        {sections
          .filter((s) => s.visible)
          .sort((a, b) => a.order - b.order)
          .map((section) => (
            <div 
              key={section.id} 
              id={`preview-section-${section.id}`} 
              className="relative transition-all duration-300"
            >
              <PreviewSection 
                section={section} 
                profile={profile} 
                onInlineEdit={onInlineEdit} 
                onImageClick={onImageClick}
              />
            </div>
          ))}

        <footer className="border-t border-border/30 px-6 py-8 text-center text-xs opacity-75">
          Sitio generado con Berçário · {profile.name}
        </footer>
      </div>
    </div>
  )
}

function PreviewSection({
  section,
  profile,
  onInlineEdit,
  onImageClick,
}: {
  section: LandingSection
  profile: BusinessProfile
  onInlineEdit?: (sectionId: string, fieldKey: string, newValue: string, index?: number, itemKey?: string) => void
  onImageClick?: (type: 'logo' | 'banner' | { sectionId: string; contentKey: string }) => void
}) {
  const { type, content } = section
  
  // Alinear textos
  const textAlignment = content?.align || (type === 'HERO_BANNER' ? 'center' : 'left')
  const alignClass =
    textAlignment === 'right'
      ? 'text-right items-end'
      : textAlignment === 'center'
      ? 'text-center items-center'
      : 'text-left items-start'

  if (type === 'HERO_BANNER') {
    return (
      <section className="relative w-full flex flex-col items-center">
        <div className="relative h-56 w-full overflow-hidden sm:h-72 group/banner">
          <img
            src={profile.banner || '/images/company-banner.png'}
            alt="Banner"
            className="h-full w-full object-cover cursor-pointer hover:brightness-95 transition-all"
            onClick={() => onImageClick?.('banner')}
            title="Clic para cambiar imagen de banner"
            onError={(e) => {
              e.currentTarget.src = '/images/company-banner.png'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/45 to-transparent pointer-events-none" />
        </div>
        <div
          className={cn(
            "mx-auto -mt-12 flex w-11/12 max-w-3xl flex-col px-6 py-8 rounded-2xl border border-border/40 shadow-sm transition-all duration-400 ease-in-out",
            alignClass
          )}
          style={{ backgroundColor: 'var(--preview-bg)', borderColor: 'var(--preview-primary)' }}
        >
          <div className="h-20 w-20 overflow-hidden rounded-3xl border-4 border-background bg-card shadow-md relative group/logo">
            <img
              src={profile.logo || '/images/company-logo.png'}
              alt={profile.name}
              className="h-full w-full object-cover cursor-pointer hover:brightness-95 transition-all"
              onClick={() => onImageClick?.('logo')}
              title="Clic para cambiar logo"
              onError={(e) => {
                e.currentTarget.src = '/images/company-logo.png'
              }}
            />
          </div>
          <EditableTextInline
            as="h1"
            value={content?.title || profile.name}
            onSave={onInlineEdit ? (val) => onInlineEdit(section.id, 'title', val) : undefined}
            className="mt-4 font-bold tracking-tight text-foreground text-3xl transition-all duration-300"
            style={{ fontFamily: 'var(--preview-font-title)' }}
          />
          <EditableTextInline
            as="p"
            value={content?.subtitle || profile.tagline}
            onSave={onInlineEdit ? (val) => onInlineEdit(section.id, 'subtitle', val) : undefined}
            className="mt-1.5 opacity-80"
          />
          <Button
            className="mt-5 shadow-sm border border-transparent font-medium hover:scale-105 active:scale-95 transition-all duration-300"
            style={{
              borderRadius: 'var(--preview-btn-radius)',
              backgroundColor: 'var(--preview-primary)',
              color: 'var(--preview-bg)',
            }}
          >
            <ShoppingBag className="mr-1.5 h-4 w-4" />
            <EditableTextInline
              value={content?.ctaText || 'Ver catálogo'}
              onSave={onInlineEdit ? (val) => onInlineEdit(section.id, 'ctaText', val) : undefined}
            />
          </Button>
        </div>
      </section>
    )
  }

  if (type === 'ABOUT_US') {
    return (
      <section className={cn("mx-auto max-w-3xl px-6 py-12 flex flex-col", alignClass)}>
        <EditableTextInline
          as="h2"
          value={content?.title || 'Quiénes somos'}
          onSave={onInlineEdit ? (val) => onInlineEdit(section.id, 'title', val) : undefined}
          className="text-2xl font-semibold text-foreground transition-all duration-300"
          style={{ fontFamily: 'var(--preview-font-title)' }}
        />
        <div className="mt-3 text-pretty leading-relaxed text-sm opacity-85 w-full">
          <EditableTextInline
            as="p"
            type="textarea"
            value={content?.description || profile.description}
            onSave={onInlineEdit ? (val) => onInlineEdit(section.id, 'description', val) : undefined}
            className="w-full leading-relaxed"
          />
        </div>
      </section>
    )
  }

  if (type === 'PRODUCTS_LIST') {
    return (
      <section className={cn("mx-auto max-w-4xl px-6 py-12 flex flex-col", alignClass)}>
        <EditableTextInline
          as="h2"
          value={content?.title || 'Catálogo'}
          onSave={onInlineEdit ? (val) => onInlineEdit(section.id, 'title', val) : undefined}
          className="text-2xl font-semibold text-foreground transition-all duration-300"
          style={{ fontFamily: 'var(--preview-font-title)' }}
        />
        <EditableTextInline
          as="p"
          value={content?.subtitle || `${profile.products?.length || 0} productos disponibles al por mayor`}
          onSave={onInlineEdit ? (val) => onInlineEdit(section.id, 'subtitle', val) : undefined}
          className="mt-1 text-sm opacity-80"
        />
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 w-full">
          {profile.products.map((p) => (
            <div
              key={p.id}
              className="group overflow-hidden rounded-xl border border-border/40 bg-card shadow-sm"
              style={{ borderColor: 'var(--preview-primary)' }}
            >
              <div className="relative aspect-square overflow-hidden bg-secondary">
                <img
                  src={p.image || '/placeholder.svg'}
                  alt={p.title || (p as any).name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg'
                  }}
                />
                <span className="absolute left-2 top-2 rounded-full bg-card/90 px-2 py-0.5 text-[11px] font-semibold text-foreground backdrop-blur">
                  {p.price}
                </span>
              </div>
              <div className="p-3">
                <h3 className="truncate text-sm font-medium text-foreground">
                  {p.title || (p as any).name}
                </h3>
                <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-muted-foreground">
                  {p.description || (p as any).desc}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {p.tags?.slice(0, 2).map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-medium text-accent-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (type === 'CONTACT_INFO') {
    return (
      <section className="border-t border-border/30 bg-secondary/20 px-6 py-12 w-full">
        <div className={cn("mx-auto max-w-3xl flex flex-col", alignClass)}>
          <EditableTextInline
            as="h2"
            value={content?.title || 'Contáctanos'}
            onSave={onInlineEdit ? (val) => onInlineEdit(section.id, 'title', val) : undefined}
            className="text-2xl font-semibold text-foreground transition-all duration-300"
            style={{ fontFamily: 'var(--preview-font-title)' }}
          />
          <div className="mt-5 grid gap-3 sm:grid-cols-3 w-full">
            {[
              { icon: Phone, field: 'phone', value: content?.phone || profile.phone },
              { icon: Mail, field: 'email', value: content?.email || profile.email },
              { icon: MapPin, field: 'address', value: content?.address || profile.address },
            ].map((c, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 rounded-xl border border-border/40 bg-card p-3.5 text-sm"
              >
                <c.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                <EditableTextInline
                  value={c.value}
                  onSave={onInlineEdit ? (val) => onInlineEdit(section.id, c.field, val) : undefined}
                  className="truncate text-foreground text-xs"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (type === 'FEATURES_LIST') {
    return (
      <section className={cn("mx-auto max-w-3xl px-6 py-12 flex flex-col", alignClass)}>
        <EditableTextInline
          as="h2"
          value={content?.title || 'Nuestros Servicios'}
          onSave={onInlineEdit ? (val) => onInlineEdit(section.id, 'title', val) : undefined}
          className="text-2xl font-semibold text-foreground mb-1.5 transition-all duration-300"
          style={{ fontFamily: 'var(--preview-font-title)' }}
        />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 w-full">
          {(content?.items || []).map((item: any, i: number) => (
            <Card
              key={i}
              className="p-5 border border-border/40 bg-card shadow-sm rounded-2xl transition-all duration-300 hover:scale-[1.01] hover:shadow-md flex flex-col items-stretch"
            >
              <EditableTextInline
                as="h3"
                value={item.title}
                onSave={onInlineEdit ? (val) => onInlineEdit(section.id, 'items', val, i, 'title') : undefined}
                className="text-sm font-semibold text-foreground mb-1.5"
              />
              <EditableTextInline
                as="p"
                type="textarea"
                value={item.description}
                onSave={onInlineEdit ? (val) => onInlineEdit(section.id, 'items', val, i, 'description') : undefined}
                className="text-xs leading-relaxed text-muted-foreground w-full"
              />
            </Card>
          ))}
        </div>
      </section>
    )
  }

  if (type === 'TESTIMONIALS') {
    return (
      <section className={cn("mx-auto max-w-3xl px-6 py-12 flex flex-col", alignClass)}>
        <EditableTextInline
          as="h2"
          value={content?.title || 'Lo que dicen nuestros clientes'}
          onSave={onInlineEdit ? (val) => onInlineEdit(section.id, 'title', val) : undefined}
          className="text-2xl font-semibold text-foreground mb-1.5 transition-all duration-300"
          style={{ fontFamily: 'var(--preview-font-title)' }}
        />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 w-full">
          {(profile.testimonials || []).map((t: any) => (
            <Card key={t.id} className="p-5 border border-border/40 bg-card shadow-sm rounded-xl">
              <p className="text-xs italic text-muted-foreground">"{t.quote || t.text}"</p>
              <div className="mt-3 flex items-center justify-between text-[11px]">
                <span className="font-semibold text-foreground">{t.name || t.author}</span>
                <span className="text-muted-foreground">{t.role}</span>
              </div>
            </Card>
          ))}
        </div>
      </section>
    )
  }

  if (type === 'FAQ') {
    return (
      <section className={cn("mx-auto max-w-3xl px-6 py-12 flex flex-col", alignClass)}>
        <EditableTextInline
          as="h2"
          value={content?.title || 'Preguntas Frecuentes'}
          onSave={onInlineEdit ? (val) => onInlineEdit(section.id, 'title', val) : undefined}
          className="text-2xl font-semibold text-foreground mb-1.5 transition-all duration-300"
          style={{ fontFamily: 'var(--preview-font-title)' }}
        />
        <div className="mt-6 space-y-4 w-full">
          {(profile.faqs || []).map((f: any) => (
            <div key={f.id} className="border-b border-border/60 pb-3">
              <h4 className="text-sm font-semibold text-foreground">{f.question || f.q}</h4>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{f.answer || f.a}</p>
            </div>
          ))}
        </div>
      </section>
    )
  }

  return null
}
