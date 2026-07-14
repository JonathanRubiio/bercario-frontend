'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  EyeOff, 
  Save, 
  Smartphone, 
  Laptop,
  Sparkles,
  Layout,
  Loader2,
  Plus,
  Trash2,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { landingConfigService } from '@/lib/api/services/landing-config'
import { profileService } from '@/lib/api/services/profile'
import { 
  migrateSections, 
  sectionTemplates, 
  getLabelForType, 
  getDescForType, 
  getDefaultContentForType,
  SectionType,
  LandingSection
} from '@/lib/bercario-data'
import { animateSelector } from '../../hooks/use-anime'
import { PublicBusinessLanding } from '../preview/public-business-landing'

export function LandingBuilderView() {
  const [config, setConfig] = useState<LandingSection[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null)
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop')

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      setLoading(true)
      const [configData, profileData] = await Promise.all([
        landingConfigService.getLandingConfig(),
        profileService.getMyProfile()
      ])

      setProfile(profileData)

      // Migrar y ordenar por el campo order al cargar
      const migrated = migrateSections(configData || [], profileData)
      const sorted = [...migrated].sort((a, b) => a.order - b.order)
      setConfig(sorted)

      if (sorted.length > 0) {
        setActiveSectionId(sorted[0].id)
      }
    } catch (err) {
      console.error('Error al cargar la configuración de la landing:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    try {
      setSaving(true)
      // Guardar cambios en el backend
      const data = await landingConfigService.updateLandingConfig(config as any)
      const migrated = migrateSections(data || [], profile)
      setConfig(migrated)
      alert('Configuración de la landing guardada con éxito.')
    } catch (err: any) {
      console.error('Error al guardar la landing config:', err)
      alert(err.message || 'Error al guardar los cambios.')
    } finally {
      setSaving(false)
    }
  }

  // Operaciones de agregar/eliminar secciones
  function addSection(templateType: SectionType) {
    const newSec: LandingSection = {
      id: `sec_${templateType.toLowerCase()}_${Date.now()}`,
      type: templateType,
      order: config.length + 1,
      visible: true,
      label: getLabelForType(templateType),
      description: getDescForType(templateType),
      content: getDefaultContentForType(templateType, profile),
    }

    const updated = [...config, newSec]
    setConfig(updated)
    setActiveSectionId(newSec.id)

    // Animación elástica de adición
    setTimeout(() => {
      animateSelector(`#builder-card-${newSec.id}`, {
        scale: [0.95, 1],
        opacity: [0, 1],
        duration: 350,
        easing: 'easeOutBack',
      })
    }, 30)
  }

  function deleteSection(id: string) {
    const updated = config
      .filter((s) => s.id !== id)
      .map((s, idx) => ({ ...s, order: idx + 1 }))
    setConfig(updated)
    if (activeSectionId === id) {
      setActiveSectionId(updated.length > 0 ? updated[0].id : null)
    }
  }

  // Animación y lógica para reordenar
  async function moveSection(index: number, direction: 'up' | 'down') {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= config.length) return

    const sectionA = config[index]
    const sectionB = config[targetIndex]

    const idA = `#builder-card-${sectionA.id}`
    const idB = `#builder-card-${sectionB.id}`
    const previewIdA = `#preview-section-${sectionA.id}`
    const previewIdB = `#preview-section-${sectionB.id}`

    const travelDistance = direction === 'up' ? -56 : 56 
    const previewTravelDistance = direction === 'up' ? -150 : 150

    await Promise.all([
      animateSelector(idA, {
        translateY: [0, travelDistance],
        duration: 250,
        easing: 'easeInOutQuad',
      }),
      animateSelector(idB, {
        translateY: [0, -travelDistance],
        duration: 250,
        easing: 'easeInOutQuad',
      }),
      animateSelector(previewIdA, {
        translateY: [0, previewTravelDistance],
        duration: 300,
        easing: 'easeInOutQuad',
      }),
      animateSelector(previewIdB, {
        translateY: [0, -previewTravelDistance],
        duration: 300,
        easing: 'easeInOutQuad',
      })
    ])

    // Resetear posiciones en el DOM
    animateSelector(`${idA}, ${idB}, ${previewIdA}, ${previewIdB}`, {
      translateY: 0,
      duration: 0
    })

    const newConfig = [...config]
    newConfig[index] = { ...sectionB, order: sectionA.order }
    newConfig[targetIndex] = { ...sectionA, order: sectionB.order }

    setConfig(newConfig.sort((a, b) => a.order - b.order))
  }

  // Mostrar/Ocultar sección con animación de desvanecimiento
  async function toggleVisibility(id: string, currentVisible: boolean) {
    const targetId = `#preview-section-${id}`

    if (currentVisible) {
      await animateSelector(targetId, {
        opacity: [1, 0],
        scale: [1, 0.95],
        duration: 200,
        easing: 'easeInOutQuad',
      })
    }

    setConfig(prev =>
      prev.map(item =>
        item.id === id ? { ...item, visible: !item.visible } : item
      )
    )

    if (!currentVisible) {
      setTimeout(() => {
        animateSelector(targetId, {
          opacity: [0, 1],
          scale: [0.96, 1],
          duration: 250,
          easing: 'easeOutBack',
        })
      }, 50)
    }
  }

  function handleContentChange(sectionId: string, key: string, value: any) {
    setConfig(prev =>
      prev.map(item => {
        if (item.id === sectionId) {
          return {
            ...item,
            content: {
              ...item.content,
              [key]: value,
            },
          }
        }
        return item
      })
    )
  }

  // Manejadores específicos para FEATURES_LIST
  function updateFeatureItem(secId: string, itemIdx: number, field: 'title' | 'description', value: string) {
    setConfig(prev =>
      prev.map(item => {
        if (item.id === secId) {
          const currentItems = item.content.items || []
          const newItems = currentItems.map((fItem: any, idx: number) => {
            if (idx === itemIdx) {
              return { ...fItem, [field]: value }
            }
            return fItem
          })
          return {
            ...item,
            content: { ...item.content, items: newItems }
          }
        }
        return item
      })
    )
  }

  function addFeatureItem(secId: string) {
    setConfig(prev =>
      prev.map(item => {
        if (item.id === secId) {
          const currentItems = item.content.items || []
          return {
            ...item,
            content: {
              ...item.content,
              items: [...currentItems, { title: 'Nuevo Servicio', description: 'Descripción de lo que incluye este servicio.' }]
            }
          }
        }
        return item
      })
    )

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
    setConfig(prev =>
      prev.map(item => {
        if (item.id === secId) {
          const currentItems = item.content.items || []
          return {
            ...item,
            content: {
              ...item.content,
              items: currentItems.filter((_: any, idx: number) => idx !== itemIdx)
            }
          }
        }
        return item
      })
    )
  }

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const activeSection = config.find(item => item.id === activeSectionId)

  return (
    <div className="grid gap-6 lg:grid-cols-[450px_1fr] h-[calc(100vh-140px)] overflow-hidden">
      
      {/* PANEL IZQUIERDO: Constructor / Controles */}
      <div className="flex flex-col h-full bg-card rounded-xl border border-border overflow-hidden">
        
        {/* Encabezado del constructor */}
        <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layout className="h-5 w-5 text-primary" />
            <h2 className="font-serif text-base font-semibold">Diseño de Landing</h2>
          </div>
          <Button 
            size="sm" 
            onClick={handleSave} 
            disabled={saving}
            className="rounded-full shadow-sm"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
            ) : (
              <Save className="h-4 w-4 mr-1.5" />
            )}
            Guardar Cambios
          </Button>
        </div>

        {/* Barra de Plantillas Predefinidas */}
        <div className="px-4 py-3 border-b border-border bg-secondary/10">
          <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
            Añadir Sección Predefinida
          </Label>
          <div className="flex flex-wrap gap-1.5">
            {sectionTemplates.map((t) => (
              <Button
                key={t.type}
                type="button"
                variant="outline"
                size="sm"
                className="h-7 px-2.5 rounded-full bg-background border-border text-[10px] hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
                onClick={() => addSection(t.type)}
              >
                <Plus className="mr-1 h-3 w-3 text-primary" />
                {t.label.replace(' adicional', '')}
              </Button>
            ))}
          </div>
        </div>

        {/* Lista de Secciones */}
        <div className="p-4 border-b border-border max-h-[220px] overflow-y-auto space-y-2 bg-muted/10">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
            Secciones de la página
          </Label>
          {config.map((item, idx) => (
            <div
              key={item.id}
              id={`builder-card-${item.id}`}
              className={cn(
                "flex items-center justify-between p-2.5 rounded-lg border border-border bg-card transition-all cursor-pointer",
                activeSectionId === item.id ? "border-primary/40 ring-1 ring-primary/20" : "hover:border-border-hover",
                !item.visible && 'bg-secondary/20 opacity-75'
              )}
              onClick={() => setActiveSectionId(item.id)}
            >
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-mono w-4">
                  {idx + 1}
                </span>
                <span className="text-sm font-medium text-foreground">
                  {item.label}
                </span>
                {!item.visible && (
                  <Badge variant="secondary" className="text-[9px] px-1 py-0.5 rounded">
                    Oculto
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                {/* Botón Subir */}
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 rounded-md"
                  disabled={idx === 0}
                  onClick={() => moveSection(idx, 'up')}
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </Button>
                {/* Botón Bajar */}
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 rounded-md"
                  disabled={idx === config.length - 1}
                  onClick={() => moveSection(idx, 'down')}
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </Button>
                {/* Botón Eliminar */}
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => deleteSection(item.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
                {/* Switch de Visibilidad */}
                <Switch
                  checked={item.visible}
                  onCheckedChange={() => toggleVisibility(item.id, item.visible)}
                  className="scale-90"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Editor del contenido de la sección activa */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {activeSection ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs capitalize px-2 py-0.5">
                  Editando: {activeSection.label}
                </Badge>
              </div>

              {/* Formulario Dinámico según Tipo */}
              {activeSection.type === 'HERO_BANNER' && (
                <div className="space-y-4">
                  <div className="grid gap-1.5">
                    <Label htmlFor="b-title">Título Principal</Label>
                    <Input
                      id="b-title"
                      value={activeSection.content.title || ''}
                      onChange={(e) => handleContentChange(activeSection.id, 'title', e.target.value)}
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="b-tagline">Lema / Subtítulo</Label>
                    <Textarea
                      id="b-tagline"
                      rows={2}
                      value={activeSection.content.subtitle || ''}
                      onChange={(e) => handleContentChange(activeSection.id, 'subtitle', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-1.5">
                      <Label htmlFor="b-cta">Texto Botón (CTA)</Label>
                      <Input
                        id="b-cta"
                        value={activeSection.content.ctaText || ''}
                        onChange={(e) => handleContentChange(activeSection.id, 'ctaText', e.target.value)}
                      />
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="b-bgColor">Color de Fondo</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          id="b-bgColor-picker"
                          className="h-9 w-9 p-0 border border-border rounded cursor-pointer"
                          value={activeSection.content.backgroundColor || '#f5f3ef'}
                          onChange={(e) => handleContentChange(activeSection.id, 'backgroundColor', e.target.value)}
                        />
                        <Input
                          id="b-bgColor"
                          className="font-mono text-xs h-9"
                          value={activeSection.content.backgroundColor || '#f5f3ef'}
                          onChange={(e) => handleContentChange(activeSection.id, 'backgroundColor', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection.type === 'ABOUT_US' && (
                <div className="space-y-4">
                  <div className="grid gap-1.5">
                    <Label htmlFor="a-title">Título de la Sección</Label>
                    <Input
                      id="a-title"
                      value={activeSection.content.title || ''}
                      onChange={(e) => handleContentChange(activeSection.id, 'title', e.target.value)}
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="a-desc">Descripción / Quiénes Somos</Label>
                    <Textarea
                      id="a-desc"
                      rows={5}
                      value={activeSection.content.description || ''}
                      onChange={(e) => handleContentChange(activeSection.id, 'description', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {activeSection.type === 'PRODUCTS_LIST' && (
                <div className="space-y-4">
                  <div className="grid gap-1.5">
                    <Label htmlFor="p-title">Título del Catálogo</Label>
                    <Input
                      id="p-title"
                      value={activeSection.content.title || ''}
                      onChange={(e) => handleContentChange(activeSection.id, 'title', e.target.value)}
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="p-subtitle">Subtítulo</Label>
                    <Input
                      id="p-subtitle"
                      value={activeSection.content.subtitle || ''}
                      onChange={(e) => handleContentChange(activeSection.id, 'subtitle', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {activeSection.type === 'CONTACT_INFO' && (
                <div className="space-y-4">
                  <div className="grid gap-1.5">
                    <Label htmlFor="c-title">Título del Contacto</Label>
                    <Input
                      id="c-title"
                      value={activeSection.content.title || ''}
                      onChange={(e) => handleContentChange(activeSection.id, 'title', e.target.value)}
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="c-phone">Teléfono</Label>
                    <Input
                      id="c-phone"
                      value={activeSection.content.phone || ''}
                      onChange={(e) => handleContentChange(activeSection.id, 'phone', e.target.value)}
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="c-email">Correo Electrónico</Label>
                    <Input
                      id="c-email"
                      value={activeSection.content.email || ''}
                      onChange={(e) => handleContentChange(activeSection.id, 'email', e.target.value)}
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="c-address">Dirección Física</Label>
                    <Input
                      id="c-address"
                      value={activeSection.content.address || ''}
                      onChange={(e) => handleContentChange(activeSection.id, 'address', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {activeSection.type === 'FEATURES_LIST' && (
                <div className="space-y-4">
                  <div className="grid gap-1.5">
                    <Label htmlFor="f-title">Título de la Sección</Label>
                    <Input
                      id="f-title"
                      value={activeSection.content.title || ''}
                      onChange={(e) => handleContentChange(activeSection.id, 'title', e.target.value)}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                      Servicios / Características Detalladas
                    </Label>
                    <div className="grid gap-3">
                      {(activeSection.content.items || []).map((item: any, idx: number) => (
                        <Card key={idx} className="animate-feature-item p-4 border border-border/80 bg-background rounded-xl shadow-none relative group/item">
                          <button
                            type="button"
                            onClick={() => removeFeatureItem(activeSection.id, idx)}
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
                              <Label htmlFor={`item-${idx}-title`} className="text-[11px] text-muted-foreground">Nombre</Label>
                              <Input
                                id={`item-${idx}-title`}
                                value={item.title || ''}
                                onChange={(e) => updateFeatureItem(activeSection.id, idx, 'title', e.target.value)}
                                placeholder="Ej. Despacho rápido"
                                className="h-8 text-xs rounded-lg"
                              />
                            </div>
                            <div className="grid gap-1">
                              <Label htmlFor={`item-${idx}-desc`} className="text-[11px] text-muted-foreground">Descripción</Label>
                              <Textarea
                                id={`item-${idx}-desc`}
                                rows={2}
                                value={item.description || ''}
                                onChange={(e) => updateFeatureItem(activeSection.id, idx, 'description', e.target.value)}
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
                      onClick={() => addFeatureItem(activeSection.id)}
                    >
                      <Plus className="mr-1 h-4 w-4" /> Agregar nuevo servicio
                    </Button>
                  </div>
                </div>
              )}

              {activeSection.type === 'TESTIMONIALS' && (
                <div className="space-y-4">
                  <div className="grid gap-1.5">
                    <Label htmlFor="t-title">Título de la Sección</Label>
                    <Input
                      id="t-title"
                      value={activeSection.content.title || ''}
                      onChange={(e) => handleContentChange(activeSection.id, 'title', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {activeSection.type === 'FAQ' && (
                <div className="space-y-4">
                  <div className="grid gap-1.5">
                    <Label htmlFor="q-title">Título de la Sección</Label>
                    <Input
                      id="q-title"
                      value={activeSection.content.title || ''}
                      onChange={(e) => handleContentChange(activeSection.id, 'title', e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center">
              <Sparkles className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-sm">Selecciona una sección en la lista superior para comenzar a editar su contenido.</p>
            </div>
          )}
        </div>
      </div>

      {/* PANEL DERECHO: Live Preview */}
      <div className="flex flex-col h-full bg-muted/20 border border-border rounded-xl overflow-hidden">
        
        {/* Barra superior de Vista Previa */}
        <div className="p-3 border-b border-border bg-card flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Vista previa en tiempo real
          </div>
          <div className="flex items-center gap-1 border border-border rounded-lg p-0.5 bg-muted/40">
            <Button
              size="sm"
              variant={previewDevice === 'desktop' ? 'secondary' : 'ghost'}
              className="h-7 px-2.5 rounded-md text-xs font-medium"
              onClick={() => setPreviewDevice('desktop')}
            >
              <Laptop className="h-3.5 w-3.5 mr-1" />
              Escritorio
            </Button>
            <Button
              size="sm"
              variant={previewDevice === 'mobile' ? 'secondary' : 'ghost'}
              className="h-7 px-2.5 rounded-md text-xs font-medium"
              onClick={() => setPreviewDevice('mobile')}
            >
              <Smartphone className="h-3.5 w-3.5 mr-1" />
              Móvil
            </Button>
          </div>
        </div>

        {/* Contenedor de simulación del Viewport */}
        <div className="flex-1 overflow-y-auto p-4 flex justify-center bg-muted/40 items-start">
          <div 
            className={cn(
              "bg-background shadow-md border border-border transition-all duration-300 overflow-y-auto max-h-[80vh]",
              previewDevice === 'desktop' ? "w-full max-w-4xl" : "w-[360px] h-[640px] rounded-3xl border-8 border-zinc-800"
            )}
          >
            {/* Contenido Dinámico de la Landing Preview */}
            <div className="w-full h-full min-h-[450px]">
              {profile && (
                <PublicBusinessLanding profile={profile} sections={config} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
