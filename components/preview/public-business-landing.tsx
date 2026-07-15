'use client'

import { useState, useEffect, useRef } from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Phone, Mail, MapPin, ShoppingBag, ShieldCheck, Star, Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { animate } from 'animejs'
import { 
  type BusinessProfile, 
  type LandingSection, 
  type ElementWidget,
  palettes, 
  fontPairs 
} from '@/lib/bercario-data'

function EditableTextInline({
  value,
  onSave,
  className,
  as: Element = 'span',
  type = 'input',
  style,
}: {
  value: string
  onSave?: (val: string) => void
  className?: string
  as?: any
  type?: 'input' | 'textarea'
  style?: React.CSSProperties
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [tempValue, setTempValue] = useState(value)

  useEffect(() => {
    setTempValue(value)
  }, [value])

  if (!onSave) {
    return <Element className={className} style={style}>{value}</Element>
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
      style={style}
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

function FAQAccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
  onInlineEditQuestion,
  onInlineEditAnswer,
}: {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
  onInlineEditQuestion?: (val: string) => void
  onInlineEditAnswer?: (val: string) => void
}) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!contentRef.current) return
    if (isOpen) {
      animate(contentRef.current, {
        height: [0, contentRef.current.scrollHeight],
        opacity: [0, 1],
        duration: 350,
        easing: 'easeOutQuad',
      })
    } else {
      animate(contentRef.current, {
        height: 0,
        opacity: 0,
        duration: 250,
        easing: 'easeOutQuad',
      })
    }
  }, [isOpen])

  return (
    <div className="border-b border-border/40 py-3 w-full">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between text-left font-semibold text-foreground py-2 text-sm focus:outline-none"
      >
        <EditableTextInline value={question} onSave={onInlineEditQuestion} />
        <span className={cn("text-xs transition-transform duration-300 ml-2 text-muted-foreground", isOpen ? "rotate-180" : "")}>▼</span>
      </button>
      <div
        ref={contentRef}
        style={{ height: 0, overflow: 'hidden', opacity: 0 }}
        className="text-xs text-muted-foreground leading-relaxed pr-8"
      >
        <div className="py-2">
          <EditableTextInline type="textarea" value={answer} onSave={onInlineEditAnswer} />
        </div>
      </div>
    </div>
  )
}

function RiskReversalSeal({
  title,
  description,
  days,
  onInlineEditTitle,
  onInlineEditDesc,
}: {
  title: string
  description: string
  days: number
  onInlineEditTitle?: (val: string) => void
  onInlineEditDesc?: (val: string) => void
}) {
  const sealRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => {
    if (!sealRef.current) return
    animate(sealRef.current, {
      scale: 1.05,
      rotate: '5deg',
      duration: 300,
      easing: 'easeOutElastic(1, .8)',
    })
  }

  const handleMouseLeave = () => {
    if (!sealRef.current) return
    animate(sealRef.current, {
      scale: 1,
      rotate: '0deg',
      duration: 300,
      easing: 'easeOutQuad',
    })
  }

  return (
    <div
      ref={sealRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="flex flex-col items-center p-6 border-2 border-dashed border-primary/45 rounded-2xl bg-card shadow-sm cursor-default max-w-md mx-auto transition-shadow hover:shadow-md"
    >
      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
        <ShieldCheck className="h-8 w-8" />
      </div>
      <EditableTextInline
        as="h3"
        value={title}
        onSave={onInlineEditTitle}
        className="text-sm font-bold text-foreground font-serif"
      />
      <div className="mt-1.5 text-xs text-muted-foreground text-center leading-relaxed">
        <EditableTextInline
          type="textarea"
          value={description}
          onSave={onInlineEditDesc}
        />
      </div>
      <span className="mt-3 text-[10px] font-semibold tracking-wider text-primary uppercase bg-primary/10 px-2 py-0.5 rounded-full">
        Garantía de {days} días
      </span>
    </div>
  )
}

function TestimonialsSlider({
  title,
  items,
  columns = 3,
  onInlineEditTitle,
  onInlineEditItem,
}: {
  title: string
  items: any[]
  columns?: number
  onInlineEditTitle?: (val: string) => void
  onInlineEditItem?: (idx: number, field: string, val: string) => void
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!trackRef.current) return
    animate(trackRef.current, {
      translateX: -activeIndex * 100 + '%',
      duration: 500,
      easing: 'easeOutQuart',
    })
  }, [activeIndex])

  return (
    <div className="w-full flex flex-col items-center">
      <EditableTextInline
        as="h2"
        value={title}
        onSave={onInlineEditTitle}
        className="text-2xl font-semibold text-foreground mb-6 font-serif"
      />
      
      {/* Slider Viewport */}
      <div className="w-full overflow-hidden relative px-4">
        <div 
          ref={trackRef} 
          className="flex transition-transform duration-500 ease-in-out w-full"
          style={{ width: `${Math.max(items.length, 1) * 100}%` }}
        >
          {items.map((item, idx) => (
            <div 
              key={idx} 
              className="px-2"
              style={{ width: `${100 / Math.max(items.length, 1)}%` }}
            >
              <Card className="p-6 border border-border/40 bg-card shadow-sm rounded-xl flex flex-col items-center text-center">
                <div className="flex gap-0.5 mb-2.5">
                  {Array.from({ length: item.rating || 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <div className="text-xs italic text-muted-foreground leading-relaxed">
                  <EditableTextInline
                    type="textarea"
                    value={item.comment}
                    onSave={onInlineEditItem ? (val) => onInlineEditItem(idx, 'comment', val) : undefined}
                  />
                </div>
                <div className="mt-4 flex items-center gap-2">
                  {item.avatarUrl && (
                    <img 
                      src={item.avatarUrl} 
                      alt={item.name} 
                      className="w-7 h-7 rounded-full object-cover border border-border/40" 
                    />
                  )}
                  <div className="text-left">
                    <div className="text-xs font-semibold text-foreground">
                      <EditableTextInline
                        value={item.name}
                        onSave={onInlineEditItem ? (val) => onInlineEditItem(idx, 'name', val) : undefined}
                      />
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      <EditableTextInline
                        value={item.role}
                        onSave={onInlineEditItem ? (val) => onInlineEditItem(idx, 'role', val) : undefined}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
      
      {/* Controls */}
      {items.length > 1 && (
        <div className="flex gap-2 mt-4">
          {items.map((_, i) => (
            <button
              type="button"
              key={i}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                activeIndex === i ? "bg-primary w-4" : "bg-muted-foreground/30"
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function LeadCaptureForm({
  title = '¿Listo para empezar?',
  subtitle = 'Déjanos tus datos y te contactaremos de inmediato.',
  ctaText,
  slug,
  onInlineEditTitle,
  onInlineEditSubtitle,
  onInlineEditCta,
}: {
  title?: string
  subtitle?: string
  ctaText: string
  slug: string
  onInlineEditTitle?: (val: string) => void
  onInlineEditSubtitle?: (val: string) => void
  onInlineEditCta?: (val: string) => void
}) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !phone) {
      setMessage({ type: 'error', text: 'Todos los campos son obligatorios.' })
      return
    }

    try {
      setLoading(true)
      setMessage(null)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/public/landing/${slug}/lead`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, phone, metadata: {} }),
      })

      const data = await res.json()
      if (res.ok) {
        setMessage({ type: 'success', text: data.message || '¡Registrado con éxito! Pronto te contactaremos.' })
        setName('')
        setEmail('')
        setPhone('')
      } else {
        setMessage({ type: 'error', text: data.message || 'Hubo un error al registrar tus datos.' })
      }
    } catch (err) {
      console.error(err)
      setMessage({ type: 'error', text: 'No se pudo conectar con el servidor. Inténtalo más tarde.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-lg mx-auto p-6 border border-border/40 bg-card rounded-2xl shadow-sm">
      <h3 className="text-lg font-bold text-foreground font-serif text-center">
        <EditableTextInline value={title} onSave={onInlineEditTitle} />
      </h3>
      <p className="text-xs text-muted-foreground mt-1 text-center mb-5">
        <EditableTextInline value={subtitle} onSave={onInlineEditSubtitle} />
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="text"
            placeholder="Nombre completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            className="text-xs h-9 bg-muted/20"
          />
        </div>
        <div>
          <Input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="text-xs h-9 bg-muted/20"
          />
        </div>
        <div>
          <Input
            type="tel"
            placeholder="Teléfono / WhatsApp"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={loading}
            className="text-xs h-9 bg-muted/20"
          />
        </div>
        
        {message && (
          <div className={cn(
            "p-3 rounded-lg text-xs font-medium text-center",
            message.type === 'success' ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" : "bg-destructive/10 text-destructive border border-destructive/20"
          )}>
            {message.text}
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-9 text-xs font-semibold flex items-center justify-center gap-1.5"
          style={{
            borderRadius: 'var(--preview-btn-radius)',
            backgroundColor: 'var(--preview-primary)',
            color: 'var(--preview-bg)',
          }}
        >
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
          <EditableTextInline value={ctaText} onSave={onInlineEditCta} />
        </Button>
      </form>
    </Card>
  )
}

function ElementWidgetRenderer({
  element,
  sectionId,
  profile,
  onInlineEdit,
  onImageClick,
}: {
  element: ElementWidget
  sectionId: string
  profile: BusinessProfile
  onInlineEdit?: (sectionId: string, fieldKey: string, newValue: string, index?: any, itemKey?: string) => void
  onImageClick?: (type: 'logo' | 'banner' | { sectionId: string; contentKey: string }) => void
}) {
  const { type, content, styles } = element
  const alignmentClass = styles?.alignment === 'center'
    ? 'text-center mx-auto'
    : styles?.alignment === 'right'
    ? 'text-right ml-auto'
    : 'text-left mr-auto'

  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    animate(ref.current, {
      scale: [0.85, 1],
      opacity: [0, 1],
      duration: 350,
      easing: 'easeOutBack'
    })
  }, [element.id])

  switch (type) {
    case 'HEADING': {
      const Level = content.level || 'h2'
      let headingClass = 'font-bold font-serif leading-tight'
      if (Level === 'h1') headingClass += ' text-3xl md:text-4xl'
      else if (Level === 'h2') headingClass += ' text-2xl md:text-3xl'
      else if (Level === 'h3') headingClass += ' text-xl md:text-2xl'
      else headingClass += ' text-lg'

      return (
        <div ref={ref} className={cn("w-full transition-all duration-300", alignmentClass)}>
          <EditableTextInline
            as={Level}
            value={content.text || 'Encabezado'}
            onSave={onInlineEdit ? (val) => onInlineEdit(sectionId, 'element_content', val, element.id, 'text') : undefined}
            className={cn(headingClass)}
            style={styles?.color ? { color: styles.color } : undefined}
          />
        </div>
      )
    }

    case 'PARAGRAPH':
      return (
        <div ref={ref} className={cn("w-full transition-all duration-300", alignmentClass)}>
          <EditableTextInline
            as="p"
            value={content.text || 'Texto del párrafo.'}
            onSave={onInlineEdit ? (val) => onInlineEdit(sectionId, 'element_content', val, element.id, 'text') : undefined}
            className={cn(
              "text-sm sm:text-base leading-relaxed opacity-80",
              styles?.italic && 'italic',
              styles?.bold && 'font-semibold'
            )}
          />
        </div>
      )

    case 'IMAGE':
      return (
        <div ref={ref} className={cn("relative overflow-hidden w-full transition-all duration-300 group/widget-img", alignmentClass)}>
          <img
            src={content.url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80'}
            alt={content.alt || 'Imagen'}
            className={cn(
              "max-h-[350px] object-cover transition-transform duration-300 hover:scale-102 w-full",
              styles?.borderRadius === 'xl' ? 'rounded-2xl' : styles?.borderRadius === 'lg' ? 'rounded-xl' : styles?.borderRadius === 'md' ? 'rounded-md' : 'rounded-none'
            )}
            onClick={() => onImageClick?.({ sectionId, contentKey: `element_image_${element.id}` })}
          />
        </div>
      )

    case 'BUTTON':
      return (
        <div ref={ref} className={cn("w-full transition-all duration-300", alignmentClass)}>
          <a
            href={content.url || '#form'}
            className={cn(
              buttonVariants({ variant: styles?.variant === 'outline' ? 'outline' : 'default' }),
              "shadow-sm font-medium hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-1 w-fit"
            )}
            style={{
              borderRadius: 'var(--preview-btn-radius)',
              backgroundColor: styles?.variant === 'outline' ? 'transparent' : 'var(--preview-primary)',
              color: styles?.variant === 'outline' ? 'var(--preview-text)' : 'var(--preview-bg)',
              borderColor: styles?.variant === 'outline' ? 'var(--preview-primary)' : 'transparent',
            }}
          >
            <EditableTextInline
              value={content.text || 'Hacer clic'}
              onSave={onInlineEdit ? (val) => onInlineEdit(sectionId, 'element_content', val, element.id, 'text') : undefined}
            />
          </a>
        </div>
      )

    case 'SPACER':
      return (
        <div 
          ref={ref} 
          className="w-full transition-all duration-300"
          style={{ height: content.height || '24px' }}
        />
      )

    case 'VIDEO':
      return (
        <div ref={ref} className="w-full aspect-video rounded-xl overflow-hidden shadow-sm relative transition-all duration-300">
          <iframe
            src={content.url ? content.url.replace('watch?v=', 'embed/') : 'https://www.youtube.com/embed/dQw4w9WgXcQ'}
            title="Video Player"
            className="h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )

    case 'FORM':
      return (
        <div ref={ref} className="w-full max-w-md bg-card/40 p-5 rounded-2xl border border-border/40 backdrop-blur shadow-sm transition-all duration-300 mx-auto">
          <LeadCaptureForm slug={profile.slug} ctaText={content.ctaText || 'Enviar Datos'} />
        </div>
      )

    case 'TESTIMONIAL':
      return (
        <div ref={ref} className="w-full transition-all duration-300">
          <TestimonialsSlider 
            title="" 
            items={content.items || []} 
            columns={content.columns || 3} 
          />
        </div>
      )

    case 'ACCORDION':
      return (
        <div ref={ref} className="w-full transition-all duration-300">
          <div className="flex flex-col gap-2 w-full text-left">
            {(content.items || []).map((faq: any, i: number) => {
              return (
                <details key={i} className="group border-b border-border/40 py-3 w-full cursor-pointer">
                  <summary className="flex items-center justify-between font-serif text-sm font-semibold text-foreground list-none outline-none">
                    <span>{faq.question}</span>
                    <span className="text-primary transition-transform duration-200 group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-2 text-xs opacity-85 leading-normal whitespace-pre-line pl-1 pr-6 pt-1">
                    {faq.answer}
                  </p>
                </details>
              )
            })}
          </div>
        </div>
      )

    default:
      return null
  }
}

function PreviewSection({
  section,
  profile,
  onInlineEdit,
  onImageClick,
}: {
  section: LandingSection
  profile: BusinessProfile
  onInlineEdit?: (sectionId: string, fieldKey: string, newValue: string, index?: any, itemKey?: string) => void
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
      
  // Local state for FAQ Accordion
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  if (type === 'GRID_SECTION') {
    return (
      <section 
        className={cn("w-full px-6 py-12 flex flex-col items-center transition-all duration-300", section.styles?.paddingY || 'py-16')}
        style={{ backgroundColor: section.styles?.backgroundColor || 'transparent' }}
      >
        <div className="w-full max-w-4xl grid grid-cols-1 gap-8 items-start lg:grid-cols-12">
          {(section.columns || []).map((col, colIdx) => {
            const widthSpan = col.width === '1/2' 
              ? 'lg:col-span-6' 
              : col.width === '1/3' 
              ? 'lg:col-span-4' 
              : col.width === '2/3' 
              ? 'lg:col-span-8' 
              : col.width === '1/4' 
              ? 'lg:col-span-3' 
              : 'lg:col-span-12';
            
            return (
              <div 
                key={col.id} 
                className={cn(
                  "col-span-12 flex flex-col gap-4 p-3 rounded-lg border border-dashed border-transparent hover:border-muted-foreground/30 transition-all min-h-[100px]", 
                  widthSpan
                )}
              >
                {(col.elements || []).map((el) => (
                  <ElementWidgetRenderer 
                    key={el.id}
                    element={el}
                    sectionId={section.id}
                    profile={profile}
                    onInlineEdit={onInlineEdit}
                    onImageClick={onImageClick}
                  />
                ))}
                
                {(!col.elements || col.elements.length === 0) && (
                  <div className="flex-1 flex items-center justify-center p-6 border border-dashed border-border/85 rounded-xl bg-muted/5 min-h-[100px]">
                    <span className="text-[10px] text-muted-foreground italic">Columna Vacía</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>
    )
  }

  if (type === 'HERO_BANNER') {
    const layoutDir = content?.layoutDirection || 'left-to-right'
    const isLeftText = layoutDir === 'left-to-right'

    return (
      <section className="relative w-full px-6 py-12 md:py-20 flex flex-col items-center">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Columna Texto */}
          <div className={cn("flex flex-col gap-4 order-1", isLeftText ? "md:order-1" : "md:order-2", alignClass)}>
            <div className="h-16 w-16 overflow-hidden rounded-2xl border-2 border-primary bg-card shadow-sm relative group/logo mb-2">
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
              className="font-bold tracking-tight text-foreground text-3xl sm:text-4xl transition-all duration-300 leading-tight"
              style={{ fontFamily: 'var(--preview-font-title)' }}
            />
            <EditableTextInline
              as="p"
              value={content?.subtitle || profile.tagline}
              onSave={onInlineEdit ? (val) => onInlineEdit(section.id, 'subtitle', val) : undefined}
              className="opacity-80 text-sm sm:text-base leading-relaxed max-w-lg"
            />
            <div>
              <a
                href={content?.ctaUrl || '#form'}
                className={cn(
                  buttonVariants({ variant: 'default' }),
                  "mt-2 shadow-sm font-medium hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-1.5 w-fit"
                )}
                style={{
                  borderRadius: 'var(--preview-btn-radius)',
                  backgroundColor: 'var(--preview-primary)',
                  color: 'var(--preview-bg)',
                }}
              >
                <ShoppingBag className="h-4 w-4" />
                <EditableTextInline
                  value={content?.ctaText || 'Ver catálogo'}
                  onSave={onInlineEdit ? (val) => onInlineEdit(section.id, 'ctaText', val) : undefined}
                />
              </a>
            </div>
          </div>

          {/* Columna Imagen */}
          <div className={cn("order-2 relative aspect-[4/3] rounded-2xl overflow-hidden border border-border/40 shadow-md group/banner bg-muted/20", isLeftText ? "md:order-2" : "md:order-1")}>
            <img
              src={profile.banner || '/images/company-banner.png'}
              alt="Banner"
              className="h-full w-full object-cover cursor-pointer hover:scale-[1.01] transition-all duration-300"
              onClick={() => onImageClick?.('banner')}
              title="Clic para cambiar imagen principal"
              onError={(e) => {
                e.currentTarget.src = '/images/company-banner.png'
              }}
            />
          </div>
        </div>
      </section>
    )
  }

  if (type === 'EMPATHY_SECTION') {
    return (
      <section className="mx-auto max-w-3xl px-6 py-12 w-full">
        <div className={cn("flex flex-col p-6 sm:p-8 rounded-2xl border border-destructive/20 bg-destructive/5 shadow-sm text-balance", alignClass)}>
          <span className="text-[10px] font-bold uppercase tracking-wider text-destructive mb-2.5 bg-destructive/10 px-2 py-0.5 rounded-full w-fit">
            El Problema Común
          </span>
          <EditableTextInline
            as="h2"
            value={content?.title || '¿Problemas con tus pedidos?'}
            onSave={onInlineEdit ? (val) => onInlineEdit(section.id, 'title', val) : undefined}
            className="text-xl sm:text-2xl font-bold text-foreground mb-3 font-serif"
          />
          <div className="text-sm opacity-85 leading-relaxed max-w-2xl">
            <EditableTextInline
              as="p"
              type="textarea"
              value={content?.description}
              onSave={onInlineEdit ? (val) => onInlineEdit(section.id, 'description', val) : undefined}
            />
          </div>
        </div>
      </section>
    )
  }

  if (type === 'SOLUTION_OFFER') {
    const layoutDir = content?.layoutDirection || 'left-to-right'
    const isLeftText = layoutDir === 'left-to-right'
    const sectionImgKey = { sectionId: section.id, contentKey: 'imageUrl' }

    return (
      <section className="mx-auto max-w-4xl px-6 py-12 sm:py-16 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Texto de la Oferta */}
          <div className={cn("flex flex-col gap-4 order-1", isLeftText ? "md:order-1" : "md:order-2", alignClass)}>
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full w-fit">
              Nuestra Propuesta
            </span>
            <EditableTextInline
              as="h2"
              value={content?.title || 'La Solución'}
              onSave={onInlineEdit ? (val) => onInlineEdit(section.id, 'title', val) : undefined}
              className="text-2xl sm:text-3xl font-bold text-foreground font-serif leading-snug"
            />
            <div className="text-sm opacity-85 leading-relaxed max-w-lg">
              <EditableTextInline
                as="p"
                type="textarea"
                value={content?.description}
                onSave={onInlineEdit ? (val) => onInlineEdit(section.id, 'description', val) : undefined}
              />
            </div>
            <div>
              <a
                href={content?.ctaUrl || '#form'}
                className={cn(
                  buttonVariants({ variant: 'default' }),
                  "mt-2 shadow-sm font-medium hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-1 w-fit"
                )}
                style={{
                  borderRadius: 'var(--preview-btn-radius)',
                  backgroundColor: 'var(--preview-primary)',
                  color: 'var(--preview-bg)',
                }}
              >
                <EditableTextInline
                  value={content?.ctaText || 'Ver Más'}
                  onSave={onInlineEdit ? (val) => onInlineEdit(section.id, 'ctaText', val) : undefined}
                />
              </a>
            </div>
          </div>

          {/* Imagen de la Oferta */}
          <div 
            className={cn(
              "order-2 relative aspect-[4/3] rounded-2xl overflow-hidden border border-border/40 shadow-sm cursor-pointer hover:opacity-95 transition-all", 
              isLeftText ? "md:order-2" : "md:order-1"
            )}
            onClick={() => onImageClick?.(sectionImgKey)}
            title="Clic para cambiar imagen de oferta"
          >
            <img
              src={content?.imageUrl || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&auto=format&fit=crop&q=80'}
              alt="Oferta"
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&auto=format&fit=crop&q=80'
              }}
            />
          </div>
        </div>
      </section>
    )
  }

  if (type === 'VALUE_PROP') {
    const cols = content?.columns || 3
    const gridClass =
      cols === 2
        ? 'grid-cols-1 sm:grid-cols-2'
        : cols === 4
        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
        : 'grid-cols-1 sm:grid-cols-3'

    return (
      <section className={cn("mx-auto max-w-4xl px-6 py-12 flex flex-col", alignClass)}>
        <EditableTextInline
          as="h2"
          value={content?.title || '¿Por qué elegirnos?'}
          onSave={onInlineEdit ? (val) => onInlineEdit(section.id, 'title', val) : undefined}
          className="text-2xl font-semibold text-foreground mb-6 font-serif"
        />
        <div className={cn("grid gap-5 w-full", gridClass)}>
          {(content?.items || []).map((item: any, i: number) => (
            <Card
              key={i}
              className="p-5 border border-border/40 bg-card shadow-sm rounded-2xl flex flex-col gap-2 items-stretch transition-transform hover:scale-[1.01]"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                {i + 1}
              </div>
              <EditableTextInline
                as="h3"
                value={item.title}
                onSave={onInlineEdit ? (val) => onInlineEdit(section.id, 'items', val, i, 'title') : undefined}
                className="text-sm font-bold text-foreground"
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

  if (type === 'HOW_IT_WORKS') {
    return (
      <section className={cn("mx-auto max-w-3xl px-6 py-12 flex flex-col", alignClass)}>
        <EditableTextInline
          as="h2"
          value={content?.title || 'Proceso de Compra'}
          onSave={onInlineEdit ? (val) => onInlineEdit(section.id, 'title', val) : undefined}
          className="text-2xl font-semibold text-foreground mb-8 font-serif"
        />
        <div className="relative border-l border-border/85 ml-3 pl-6 space-y-8 w-full text-left">
          {(content?.items || []).map((item: any, i: number) => (
            <div key={i} className="relative">
              <span className="absolute -left-[37px] top-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {item.step || i + 1}
              </span>
              <EditableTextInline
                as="h3"
                value={item.title}
                onSave={onInlineEdit ? (val) => onInlineEdit(section.id, 'items', val, i, 'title') : undefined}
                className="text-sm font-semibold text-foreground"
              />
              <div className="text-xs text-muted-foreground mt-1 leading-relaxed w-full">
                <EditableTextInline
                  type="textarea"
                  value={item.description}
                  onSave={onInlineEdit ? (val) => onInlineEdit(section.id, 'items', val, i, 'description') : undefined}
                />
              </div>
            </div>
          ))}
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
          className="text-2xl font-semibold text-foreground transition-all duration-300 font-serif"
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
        {content?.signature && (
          <div className="mt-6 border-t border-border/40 pt-3 text-xs italic text-muted-foreground">
            <EditableTextInline
              value={content.signature}
              onSave={onInlineEdit ? (val) => onInlineEdit(section.id, 'signature', val) : undefined}
            />
          </div>
        )}
      </section>
    )
  }

  if (type === 'TESTIMONIALS') {
    return (
      <section className="mx-auto max-w-3xl px-6 py-12 w-full">
        <TestimonialsSlider
          title={content?.title || 'Lo que dicen nuestros clientes'}
          items={content?.items || []}
          columns={content?.columns || 3}
          onInlineEditTitle={onInlineEdit ? (val) => onInlineEdit(section.id, 'title', val) : undefined}
          onInlineEditItem={onInlineEdit ? (idx, field, val) => onInlineEdit(section.id, 'items', val, idx, field) : undefined}
        />
      </section>
    )
  }

  if (type === 'CONVERSION_FORM') {
    return (
      <section id="form" className="mx-auto max-w-3xl px-6 py-12 w-full">
        <LeadCaptureForm
          title={content?.title || '¿Listo para empezar?'}
          subtitle={content?.subtitle || 'Déjanos tus datos y te contactaremos de inmediato.'}
          ctaText={content?.ctaText || 'Enviar Información'}
          slug={profile.slug}
          onInlineEditTitle={onInlineEdit ? (val) => onInlineEdit(section.id, 'title', val) : undefined}
          onInlineEditSubtitle={onInlineEdit ? (val) => onInlineEdit(section.id, 'subtitle', val) : undefined}
          onInlineEditCta={onInlineEdit ? (val) => onInlineEdit(section.id, 'ctaText', val) : undefined}
        />
      </section>
    )
  }

  if (type === 'RISK_REVERSAL') {
    return (
      <section className="mx-auto max-w-3xl px-6 py-12 w-full">
        <RiskReversalSeal
          title={content?.title || 'Garantía de Satisfacción'}
          description={content?.description || 'Te respaldamos con una garantía de devolución completa de tu inversión.'}
          days={content?.days || 30}
          onInlineEditTitle={onInlineEdit ? (val) => onInlineEdit(section.id, 'title', val) : undefined}
          onInlineEditDesc={onInlineEdit ? (val) => onInlineEdit(section.id, 'description', val) : undefined}
        />
      </section>
    )
  }

  if (type === 'FAQ_ACCORDION') {
    const faqItems = content?.items || []

    return (
      <section className={cn("mx-auto max-w-3xl px-6 py-12 flex flex-col", alignClass)}>
        <EditableTextInline
          as="h2"
          value={content?.title || 'Preguntas Frecuentes'}
          onSave={onInlineEdit ? (val) => onInlineEdit(section.id, 'title', val) : undefined}
          className="text-2xl font-semibold text-foreground mb-6 font-serif"
        />
        <div className="w-full text-left space-y-1">
          {faqItems.map((item: any, i: number) => (
            <FAQAccordionItem
              key={i}
              question={item.question}
              answer={item.answer}
              isOpen={openFaqIndex === i}
              onToggle={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
              onInlineEditQuestion={onInlineEdit ? (val) => onInlineEdit(section.id, 'items', val, i, 'question') : undefined}
              onInlineEditAnswer={onInlineEdit ? (val) => onInlineEdit(section.id, 'items', val, i, 'answer') : undefined}
            />
          ))}
        </div>
      </section>
    )
  }

  if (type === 'FOOTER_SECTION') {
    return (
      <section className="border-t border-border/30 bg-muted/10 px-6 py-8 w-full text-center text-xs opacity-75">
        <div className="mx-auto max-w-3xl flex flex-col items-center gap-2">
          <EditableTextInline
            value={content?.copyright || '© 2026 Todos los derechos reservados.'}
            onSave={onInlineEdit ? (val) => onInlineEdit(section.id, 'copyright', val) : undefined}
          />
          <div className="text-[10px] text-muted-foreground">
            Sitio web profesional generado con Berçário
          </div>
        </div>
      </section>
    )
  }

  // Fallbacks para compatibilidad con secciones legacy
  if (type === 'PRODUCTS_LIST') {
    return (
      <section className={cn("mx-auto max-w-4xl px-6 py-12 flex flex-col", alignClass)}>
        <EditableTextInline
          as="h2"
          value={content?.title || 'Catálogo'}
          onSave={onInlineEdit ? (val) => onInlineEdit(section.id, 'title', val) : undefined}
          className="text-2xl font-semibold text-foreground transition-all duration-300 font-serif"
        />
        <EditableTextInline
          as="p"
          value={content?.subtitle || `${profile.products?.length || 0} productos disponibles`}
          onSave={onInlineEdit ? (val) => onInlineEdit(section.id, 'subtitle', val) : undefined}
          className="mt-1 text-sm opacity-80"
        />
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 w-full">
          {(profile.products || []).map((p) => (
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
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  return null
}
