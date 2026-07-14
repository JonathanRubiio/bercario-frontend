'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { IncomingBadge } from '@/components/platform/incoming-badge'
import { cn } from '@/lib/utils'
import {
  LandingSection,
  SectionType,
  sectionTemplates,
  getLabelForType,
  getDescForType,
  getDefaultContentForType,
} from '@/lib/bercario-data'
import { animateSelector } from '../../hooks/use-anime'
import {
  GripVertical,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Image as ImageIcon,
  FileText,
  LayoutGrid,
  Mail,
  Palette,
  Check,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  ListCollapse,
  X,
} from 'lucide-react'

const sectionIcons: Record<string, any> = {
  HERO_BANNER: ImageIcon,
  ABOUT_US: FileText,
  PRODUCTS_LIST: LayoutGrid,
  CONTACT_INFO: Mail,
  FEATURES_LIST: ListCollapse,
}

const palettes = [
  { id: 'nido', name: 'Nido (por defecto)', colors: ['#f5f3ef', '#d9c7a8', '#3a352f'] },
  { id: 'arena', name: 'Arena cálida', colors: ['#faf6f0', '#e0b088', '#4a3c30'] },
  { id: 'bosque', name: 'Bosque sereno', colors: ['#f2f5f1', '#a7c4a0', '#2f3d2c'] },
  { id: 'pizarra', name: 'Pizarra elegante', colors: ['#f4f4f5', '#a1a1aa', '#27272a'] },
]

export function LandingConfig({
  sections,
  onSectionsChange,
  onPreview,
}: {
  sections: LandingSection[]
  onSectionsChange: (s: LandingSection[]) => void
  onPreview: () => void
}) {
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [palette, setPalette] = useState('nido')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    // Animación de entrada para las secciones de la landing
    animateSelector('.animate-section-card', {
      opacity: [0, 1],
      translateX: [-20, 0],
      delay: (_, i) => (i ?? 0) * 60,
      duration: 500,
      easing: 'easeOutExpo',
    })

    // Animación de entrada para los elementos del sidebar
    animateSelector('.animate-sidebar-card', {
      opacity: [0, 1],
      translateY: [15, 0],
      delay: (_, i) => (i ?? 0) * 80,
      duration: 550,
      easing: 'easeOutExpo',
    })
  }, [sections.length])

  function move(from: number, to: number) {
    if (to < 0 || to >= sections.length) return
    const next = [...sections]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    // Sincronizar propiedad order (1-indexed)
    const updated = next.map((s, idx) => ({ ...s, order: idx + 1 }))
    onSectionsChange(updated)
  }

  function handleDrop(index: number) {
    if (dragIndex === null || dragIndex === index) return
    move(dragIndex, index)
    setDragIndex(null)
  }

  // Operaciones de Secciones
  function addSection(templateType: SectionType) {
    const newSec: LandingSection = {
      id: `sec_${templateType.toLowerCase()}_${Date.now()}`,
      type: templateType,
      order: sections.length + 1,
      visible: true,
      label: getLabelForType(templateType),
      description: getDescForType(templateType),
      content: getDefaultContentForType(templateType),
    }
    onSectionsChange([...sections, newSec])
    setExpandedId(newSec.id)
  }

  function deleteSection(id: string) {
    const updated = sections
      .filter((s) => s.id !== id)
      .map((s, idx) => ({ ...s, order: idx + 1 }))
    onSectionsChange(updated)
    if (expandedId === id) setExpandedId(null)
  }

  function toggleVisibility(id: string) {
    const updated = sections.map((s) =>
      s.id === id ? { ...s, visible: !s.visible } : s
    )
    onSectionsChange(updated)
  }

  function updateSectionContent(id: string, key: string, val: any) {
    const updated = sections.map((s) => {
      if (s.id === id) {
        return {
          ...s,
          content: {
            ...s.content,
            [key]: val,
          },
        }
      }
      return s
    })
    onSectionsChange(updated)
  }

  // Funciones específicas para FEATURES_LIST (Servicios / Características)
  function updateFeatureItem(secId: string, itemIdx: number, field: 'title' | 'description', value: string) {
    const updated = sections.map((s) => {
      if (s.id === secId) {
        const currentItems = s.content.items || []
        const newItems = currentItems.map((item: any, idx: number) => {
          if (idx === itemIdx) {
            return { ...item, [field]: value }
          }
          return item
        })
        return {
          ...s,
          content: { ...s.content, items: newItems }
        }
      }
      return s
    })
    onSectionsChange(updated)
  }

  function addFeatureItem(secId: string) {
    const updated = sections.map((s) => {
      if (s.id === secId) {
        const currentItems = s.content.items || []
        return {
          ...s,
          content: {
            ...s.content,
            items: [...currentItems, { title: 'Nuevo Servicio', description: 'Descripción de lo que incluye este servicio.' }]
          }
        }
      }
      return s
    })
    onSectionsChange(updated)
    
    // Animar la creación del item de servicio
    setTimeout(() => {
      animateSelector('.animate-feature-item:last-child', {
        scale: [0.93, 1],
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutBack',
      })
    }, 30)
  }

  function removeFeatureItem(secId: string, itemIdx: number) {
    const updated = sections.map((s) => {
      if (s.id === secId) {
        const currentItems = s.content.items || []
        return {
          ...s,
          content: {
            ...s.content,
            items: currentItems.filter((_: any, idx: number) => idx !== itemIdx)
          }
        }
      }
      return s
    })
    onSectionsChange(updated)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div>
        {/* Header constructor */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-serif text-xl font-semibold text-foreground">
              Constructor de Landing Page
            </h2>
            <p className="text-sm text-muted-foreground">
              Personaliza el orden, contenido y visibilidad de las secciones de tu sitio.
            </p>
          </div>
          <Button onClick={onPreview} className="rounded-full self-start sm:self-auto shadow-sm">
            <Eye className="mr-1 h-4 w-4" /> Vista previa
          </Button>
        </div>

        {/* Barra de Plantillas Predefinidas */}
        <Card className="mb-6 border border-border p-4 shadow-none bg-secondary/20 bg-opacity-40">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Plantillas de Secciones Predefinidas (Haz clic para agregar)
          </h3>
          <div className="flex flex-wrap gap-2">
            {sectionTemplates.map((t) => (
              <Button
                key={t.type}
                type="button"
                variant="outline"
                size="sm"
                className="rounded-full bg-background border-border text-xs hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
                onClick={() => addSection(t.type)}
              >
                <Plus className="mr-1 h-3.5 w-3.5 text-primary" />
                {t.label.replace(' adicional', '')}
              </Button>
            ))}
          </div>
        </Card>

        {/* Listado de secciones constructor */}
        <div className="space-y-3.5">
          {sections
            .sort((a, b) => a.order - b.order)
            .map((section, index) => {
              const Icon = sectionIcons[section.type] ?? LayoutGrid
              const isExpanded = expandedId === section.id
              const isVisible = section.visible

              return (
                <Card
                  key={section.id}
                  draggable
                  onDragStart={() => setDragIndex(index)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(index)}
                  onDragEnd={() => setDragIndex(null)}
                  className={cn(
                    'overflow-hidden border transition-all animate-section-card opacity-0 shadow-none',
                    dragIndex === index
                      ? 'border-primary opacity-60 shadow-md scale-[0.99]'
                      : 'border-border hover:border-primary/30',
                    !isVisible && 'bg-secondary/20 border-dashed opacity-75'
                  )}
                >
                  {/* Encabezado de la Sección */}
                  <div className="flex items-center gap-3 p-4">
                    {/* Botón Drag y Controles Reordenar */}
                    <div className="flex items-center gap-1">
                      <GripVertical className="h-5 w-5 shrink-0 cursor-grab text-muted-foreground/60 active:cursor-grabbing hover:text-foreground transition-colors" />
                      <div className="flex flex-col gap-0.5">
                        <button
                          onClick={() => move(index, index - 1)}
                          disabled={index === 0}
                          className="rounded p-0.5 text-muted-foreground/50 hover:bg-secondary hover:text-foreground disabled:opacity-20 transition-all"
                          aria-label="Subir"
                        >
                          <ArrowUp className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => move(index, index + 1)}
                          disabled={index === sections.length - 1}
                          className="rounded p-0.5 text-muted-foreground/50 hover:bg-secondary hover:text-foreground disabled:opacity-20 transition-all"
                          aria-label="Bajar"
                        >
                          <ArrowDown className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    {/* Toggle Ojo Visibilidad */}
                    <button
                      type="button"
                      onClick={() => toggleVisibility(section.id)}
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-full transition-all',
                        isVisible
                          ? 'bg-primary/5 text-primary hover:bg-primary/10'
                          : 'bg-muted text-muted-foreground hover:bg-secondary'
                      )}
                      title={isVisible ? 'Ocultar sección' : 'Mostrar sección'}
                    >
                      {isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>

                    {/* Icono de Tipo */}
                    <span className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-accent-foreground shadow-sm',
                      isVisible ? 'bg-accent border border-border' : 'bg-muted border border-dashed border-border'
                    )}>
                      <Icon className="h-5 w-5" />
                    </span>

                    {/* Título de Fila */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={cn(
                          'text-sm font-semibold leading-none text-foreground',
                          !isVisible && 'text-muted-foreground line-through decoration-muted-foreground/40'
                        )}>
                          {section.content?.title || section.label}
                        </p>
                        <span className="rounded-full bg-secondary/80 border border-border/50 px-2 py-0.5 text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                          {section.type.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="truncate text-xs text-muted-foreground mt-1">
                        {section.description}
                      </p>
                    </div>

                    {/* Expandir / Colapsar y Borrar */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => deleteSection(section.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
                        title="Eliminar Sección"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : section.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:bg-secondary transition-all"
                        aria-label={isExpanded ? 'Colapsar edición' : 'Expandir edición'}
                      >
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Panel de Formulario Desplegable */}
                  {isExpanded && (
                    <div className="border-t border-border bg-secondary/15 px-6 py-5 space-y-4 animate-tag-birth">
                      <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider border-b border-border/40 pb-2">
                        Configurar Contenido de la Sección
                      </h4>

                      {/* Campos según el Tipo de Sección */}
                      {section.type === 'HERO_BANNER' && (
                        <div className="grid gap-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="grid gap-1.5">
                              <Label htmlFor={`${section.id}-title`} className="text-xs">Título Principal</Label>
                              <Input
                                id={`${section.id}-title`}
                                value={section.content?.title || ''}
                                onChange={(e) => updateSectionContent(section.id, 'title', e.target.value)}
                                placeholder="Ej. Bienvenidos a mi tienda"
                                className="bg-background rounded-xl"
                              />
                            </div>
                            <div className="grid gap-1.5">
                              <Label htmlFor={`${section.id}-subtitle`} className="text-xs">Subtítulo / Eslogan</Label>
                              <Input
                                id={`${section.id}-subtitle`}
                                value={section.content?.subtitle || ''}
                                onChange={(e) => updateSectionContent(section.id, 'subtitle', e.target.value)}
                                placeholder="Ej. Surtido de calzado al por mayor"
                                className="bg-background rounded-xl"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="grid gap-1.5">
                              <Label htmlFor={`${section.id}-ctaText`} className="text-xs">Texto de Botón (CTA)</Label>
                              <Input
                                id={`${section.id}-ctaText`}
                                value={section.content?.ctaText || ''}
                                onChange={(e) => updateSectionContent(section.id, 'ctaText', e.target.value)}
                                placeholder="Ej. Contactar"
                                className="bg-background rounded-xl"
                              />
                            </div>
                            <div className="grid gap-1.5">
                              <Label htmlFor={`${section.id}-bgColor`} className="text-xs">Color de Fondo</Label>
                              <div className="flex gap-2">
                                <Input
                                  id={`${section.id}-bgColor`}
                                  value={section.content?.backgroundColor || '#f5f3ef'}
                                  onChange={(e) => updateSectionContent(section.id, 'backgroundColor', e.target.value)}
                                  placeholder="#f5f3ef"
                                  className="bg-background rounded-xl flex-1 font-mono text-sm"
                                />
                                <Input
                                  type="color"
                                  value={section.content?.backgroundColor || '#f5f3ef'}
                                  onChange={(e) => updateSectionContent(section.id, 'backgroundColor', e.target.value)}
                                  className="w-12 h-10 p-1 bg-background rounded-xl border border-border cursor-pointer"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {section.type === 'ABOUT_US' && (
                        <div className="grid gap-4">
                          <div className="grid gap-1.5">
                            <Label htmlFor={`${section.id}-title`} className="text-xs">Título de Sección</Label>
                            <Input
                              id={`${section.id}-title`}
                              value={section.content?.title || ''}
                              onChange={(e) => updateSectionContent(section.id, 'title', e.target.value)}
                              placeholder="Ej. Quiénes somos"
                              className="bg-background rounded-xl"
                            />
                          </div>
                          <div className="grid gap-1.5">
                            <Label htmlFor={`${section.id}-desc`} className="text-xs">Descripción</Label>
                            <Textarea
                              id={`${section.id}-desc`}
                              rows={4}
                              value={section.content?.description || ''}
                              onChange={(e) => updateSectionContent(section.id, 'description', e.target.value)}
                              placeholder="Describe la historia, misión o valores del negocio..."
                              className="bg-background rounded-xl resize-none"
                            />
                          </div>
                        </div>
                      )}

                      {section.type === 'PRODUCTS_LIST' && (
                        <div className="grid gap-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="grid gap-1.5">
                              <Label htmlFor={`${section.id}-title`} className="text-xs">Título de Sección</Label>
                              <Input
                                id={`${section.id}-title`}
                                value={section.content?.title || ''}
                                onChange={(e) => updateSectionContent(section.id, 'title', e.target.value)}
                                placeholder="Ej. Catálogo de productos"
                                className="bg-background rounded-xl"
                              />
                            </div>
                            <div className="grid gap-1.5">
                              <Label htmlFor={`${section.id}-subtitle`} className="text-xs">Subtítulo / Info</Label>
                              <Input
                                id={`${section.id}-subtitle`}
                                value={section.content?.subtitle || ''}
                                onChange={(e) => updateSectionContent(section.id, 'subtitle', e.target.value)}
                                placeholder="Ej. Productos al por mayor"
                                className="bg-background rounded-xl"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {section.type === 'CONTACT_INFO' && (
                        <div className="grid gap-4">
                          <div className="grid gap-1.5">
                            <Label htmlFor={`${section.id}-title`} className="text-xs">Título de Sección</Label>
                            <Input
                              id={`${section.id}-title`}
                              value={section.content?.title || ''}
                              onChange={(e) => updateSectionContent(section.id, 'title', e.target.value)}
                              placeholder="Ej. Contáctanos"
                              className="bg-background rounded-xl"
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="grid gap-1.5">
                              <Label htmlFor={`${section.id}-phone`} className="text-xs">Teléfono</Label>
                              <Input
                                id={`${section.id}-phone`}
                                value={section.content?.phone || ''}
                                onChange={(e) => updateSectionContent(section.id, 'phone', e.target.value)}
                                placeholder="+57 312 456 7890"
                                className="bg-background rounded-xl"
                              />
                            </div>
                            <div className="grid gap-1.5">
                              <Label htmlFor={`${section.id}-email`} className="text-xs">Correo</Label>
                              <Input
                                id={`${section.id}-email`}
                                value={section.content?.email || ''}
                                onChange={(e) => updateSectionContent(section.id, 'email', e.target.value)}
                                placeholder="ventas@negocio.com"
                                className="bg-background rounded-xl"
                              />
                            </div>
                            <div className="grid gap-1.5">
                              <Label htmlFor={`${section.id}-address`} className="text-xs">Dirección</Label>
                              <Input
                                id={`${section.id}-address`}
                                value={section.content?.address || ''}
                                onChange={(e) => updateSectionContent(section.id, 'address', e.target.value)}
                                placeholder="Av. Principal, Cúcuta"
                                className="bg-background rounded-xl"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {section.type === 'FEATURES_LIST' && (
                        <div className="grid gap-4">
                          <div className="grid gap-1.5">
                            <Label htmlFor={`${section.id}-title`} className="text-xs">Título de Sección</Label>
                            <Input
                              id={`${section.id}-title`}
                              value={section.content?.title || ''}
                              onChange={(e) => updateSectionContent(section.id, 'title', e.target.value)}
                              placeholder="Ej. Nuestros Servicios"
                              className="bg-background rounded-xl"
                            />
                          </div>

                          <div className="space-y-3">
                            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                              Servicios / Características Detalladas
                            </Label>
                            <div className="grid gap-3">
                              {(section.content?.items || []).map((item: any, idx: number) => (
                                <Card key={idx} className="animate-feature-item p-4 border border-border/80 bg-background rounded-xl shadow-none relative group/item">
                                  <button
                                    type="button"
                                    onClick={() => removeFeatureItem(section.id, idx)}
                                    className="absolute right-3 top-3 h-6 w-6 flex items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive opacity-0 group-hover/item:opacity-100 transition-all duration-200"
                                    title="Quitar servicio"
                                  >
                                    <X className="h-3.5 w-3.5" />
                                  </button>
                                  <h5 className="text-[11px] font-bold text-primary uppercase tracking-wider mb-2">
                                    Servicio #{idx + 1}
                                  </h5>
                                  <div className="grid gap-3">
                                    <div className="grid gap-1">
                                      <Label htmlFor={`${section.id}-item-${idx}-title`} className="text-[11px] text-muted-foreground">Nombre</Label>
                                      <Input
                                        id={`${section.id}-item-${idx}-title`}
                                        value={item.title || ''}
                                        onChange={(e) => updateFeatureItem(section.id, idx, 'title', e.target.value)}
                                        placeholder="Ej. Despacho rápido"
                                        className="h-8 text-xs rounded-lg"
                                      />
                                    </div>
                                    <div className="grid gap-1">
                                      <Label htmlFor={`${section.id}-item-${idx}-desc`} className="text-[11px] text-muted-foreground">Descripción</Label>
                                      <Textarea
                                        id={`${section.id}-item-${idx}-desc`}
                                        rows={2}
                                        value={item.description || ''}
                                        onChange={(e) => updateFeatureItem(section.id, idx, 'description', e.target.value)}
                                        placeholder="Ej. Despachamos tu pedido en menos de 24 horas hábiles."
                                        className="text-xs rounded-lg resize-none"
                                      />
                                    </div>
                                  </div>
                                </Card>
                              ))}
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="rounded-xl border border-dashed border-border hover:border-primary/50 hover:bg-primary/5 text-xs w-full py-5"
                              onClick={() => addFeatureItem(section.id)}
                            >
                              <Plus className="mr-1 h-4 w-4" /> Agregar nuevo servicio
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              )
            })}
        </div>
      </div>

      {/* Sidebar: palette + phase 2 */}
      <div className="space-y-6">
        <Card className="border-border p-5 shadow-none animate-sidebar-card opacity-0">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-serif text-sm font-semibold text-foreground">
              Paleta de color
            </h3>
          </div>
          <div className="mt-4 space-y-2">
            {palettes.map((p) => (
              <button
                key={p.id}
                onClick={() => setPalette(p.id)}
                className={cn(
                  'flex w-full items-center justify-between rounded-lg border p-2.5 text-left transition-colors',
                  palette === p.id
                    ? 'border-primary bg-secondary'
                    : 'border-border hover:bg-secondary/60',
                )}
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex">
                    {p.colors.map((c) => (
                      <span
                        key={c}
                        className="-ml-1 h-5 w-5 rounded-full border-2 border-card first:ml-0"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-foreground">
                    {p.name}
                  </span>
                </div>
                {palette === p.id && <Check className="h-4 w-4 text-foreground" />}
              </button>
            ))}
          </div>
        </Card>

        <Card className="relative border-border p-5 shadow-none animate-sidebar-card opacity-0">
          <h3 className="font-serif text-sm font-semibold text-foreground">
            Dominio personalizado
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Conecta tu propio dominio y activa un carrito de compras integrado.
          </p>
          <div className="mt-4 flex justify-center">
            <IncomingBadge />
          </div>
        </Card>
      </div>
    </div>
  )
}
