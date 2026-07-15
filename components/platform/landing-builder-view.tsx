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
  X,
  Palette,
  Type,
  Smile,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  MousePointerClick,
  Check,
  Paintbrush,
  ListCollapse,
  Upload,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { landingConfigService } from '@/lib/api/services/landing-config'
import { profileService } from '@/lib/api/services/profile'
import { uploadService } from '../../lib/api/services/upload'
import { 
  migrateSections, 
  sectionTemplates, 
  getLabelForType, 
  getDescForType, 
  getDefaultContentForType,
  SectionType,
  LandingSection,
  palettes,
  fontPairs,
  buttonStyles,
} from '@/lib/bercario-data'
import { animateSelector } from '../../hooks/use-anime'
import { PublicBusinessLanding } from '../preview/public-business-landing'
import { MediaManagerDialog } from './media-manager-dialog'

export function LandingBuilderView() {
  const [config, setConfig] = useState<LandingSection[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null)
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop')
  const [editorTab, setEditorTab] = useState<'content' | 'styles'>('content')

  // Estados de Configuración
  const [templateId, setTemplateId] = useState<string>('minimalist_dark')
  const [globalStyles, setGlobalStyles] = useState<any>({
    paletteId: 'pizarra',
    fontPairId: 'modern_serif',
    buttonStyle: 'rounded',
  })
  const [templates, setTemplates] = useState<any[]>([])
  const [uploadingImage, setUploadingImage] = useState<string | null>(null)

  // Estados para Gestor de Media Centralizado
  const [mediaOpen, setMediaOpen] = useState(false)
  const [mediaTarget, setMediaTarget] = useState<'logo' | 'banner' | { sectionId: string; contentKey: string } | null>(null)

  function handleMediaSelect(url: string) {
    if (!mediaTarget) return

    if (mediaTarget === 'logo' || mediaTarget === 'banner') {
      const updatedProfile = { ...profile, [mediaTarget]: url }
      setProfile(updatedProfile)
      profileService.updateProfile(updatedProfile).catch((err) => {
        console.error('Error al actualizar imagen del perfil:', err)
      })
    } else {
      const { sectionId, contentKey } = mediaTarget
      handleContentChange(sectionId, contentKey, url)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (!loading) {
      // Efecto staggered fade-in al cargar el constructor
      setTimeout(() => {
        animateSelector('.animate-builder-panel', {
          opacity: [0, 1],
          translateX: [-25, 0],
          delay: (_, i) => (i ?? 0) * 150,
          duration: 650,
          easing: 'easeOutCubic',
        })
      }, 50)
    }
  }, [loading])

  // Transición elástica de color de fondo y text al cambiar de paleta
  useEffect(() => {
    if (globalStyles?.paletteId && !loading) {
      animateSelector('#preview-viewport-container', {
        opacity: [0.96, 1],
        scale: [0.99, 1],
        duration: 400,
        easing: 'easeInOutQuad',
      })
    }
  }, [globalStyles?.paletteId])

  async function fetchData() {
    try {
      setLoading(true)
      const [configData, profileData, templatesData] = await Promise.all([
        landingConfigService.getLandingConfig(),
        profileService.getMyProfile(),
        landingConfigService.getTemplates()
      ])

      setProfile(profileData)
      setTemplates(templatesData || [])

      if (configData) {
        setTemplateId(configData.templateId || 'minimalist_dark')
        setGlobalStyles(configData.globalStyles || {
          paletteId: 'pizarra',
          fontPairId: 'modern_serif',
          buttonStyle: 'rounded',
        })

        const migrated = migrateSections(configData.landingConfig || [], profileData)
        const sorted = [...migrated].sort((a, b) => a.order - b.order)
        setConfig(sorted)

        if (sorted.length > 0) {
          setActiveSectionId(sorted[0].id)
        }
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
      const data = await landingConfigService.updateLandingConfig({
        templateId,
        landingConfig: config,
        globalStyles
      })
      
      setTemplateId(data.templateId)
      setGlobalStyles(data.globalStyles)
      const migrated = migrateSections(data.landingConfig || [], profile)
      setConfig(migrated)
      alert('Configuración de la landing guardada con éxito.')
    } catch (err: any) {
      console.error('Error al guardar la landing config:', err)
      alert(err.message || 'Error al guardar los cambios.')
    } finally {
      setSaving(false)
    }
  }

  // Sobrescribir plantilla
  function applyTemplate(tpl: any) {
    if (window.confirm(`¿Estás seguro de que deseas aplicar la plantilla "${tpl.name}"? Se sobrescribirá tu configuración de secciones y estilos actuales.`)) {
      setTemplateId(tpl.id)
      setGlobalStyles(tpl.globalStyles)
      
      const adaptedConfig = tpl.landingConfig.map((s: any) => {
        const sCopy = JSON.parse(JSON.stringify(s))
        if (sCopy.type === 'HERO_BANNER') {
          sCopy.content.title = profile?.name || sCopy.content.title
          sCopy.content.subtitle = profile?.tagline || sCopy.content.subtitle
        } else if (sCopy.type === 'ABOUT_US') {
          sCopy.content.description = profile?.description || sCopy.content.description
        } else if (sCopy.type === 'CONTACT_INFO') {
          sCopy.content.phone = profile?.phone || sCopy.content.phone
          sCopy.content.email = profile?.email || sCopy.content.email
          sCopy.content.address = profile?.address || sCopy.content.address
        }
        return sCopy
      })

      const sorted = adaptedConfig.sort((a: any, b: any) => a.order - b.order)
      setConfig(sorted)
      if (sorted.length > 0) {
        setActiveSectionId(sorted[0].id)
      }
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

  // Reordenar con animación premium slide
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

    // Resetear posiciones físicas en el DOM
    animateSelector(`${idA}, ${idB}, ${previewIdA}, ${previewIdB}`, {
      translateY: 0,
      duration: 0
    })

    const newConfig = [...config]
    newConfig[index] = { ...sectionB, order: sectionA.order }
    newConfig[targetIndex] = { ...sectionA, order: sectionB.order }

    setConfig(newConfig.sort((a, b) => a.order - b.order))
  }

  // Mostrar/Ocultar con fade-out/fade-in
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

  // Sincronizar edición inline (derecha) con el estado local
  function handleInlineEdit(sectionId: string, fieldKey: string, newValue: string, index?: number, itemKey?: string) {
    setConfig(prev =>
      prev.map(item => {
        if (item.id === sectionId) {
          if (fieldKey === 'items' && typeof index === 'number' && itemKey) {
            const currentItems = [...(item.content.items || [])]
            currentItems[index] = {
              ...currentItems[index],
              [itemKey]: newValue
            }
            return {
              ...item,
              content: { ...item.content, items: currentItems }
            }
          } else {
            return {
              ...item,
              content: {
                ...item.content,
                [fieldKey]: newValue,
              },
            }
          }
        }
        return item
      })
    )
  }

  // Subir imagen para secciones
  async function handleSectionImageUpload(e: React.ChangeEvent<HTMLInputElement>, sectionId: string, contentKey: string) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setUploadingImage(`${sectionId}-${contentKey}`)
      const res = await uploadService.uploadImage(file)
      handleContentChange(sectionId, contentKey, res.url)
    } catch (err) {
      console.error('Error al subir la imagen:', err)
      alert('Ocurrió un error al subir la imagen.')
    } finally {
      setUploadingImage(null)
    }
  }

  // Lógica del catálogo de items (Servicios / Características)
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
    <div className="grid gap-6 lg:grid-cols-[460px_1fr] h-[calc(100vh-140px)] overflow-hidden">
      
      {/* PANEL IZQUIERDO: The Wix Workspace Panel */}
      <div className="animate-builder-panel opacity-0 flex flex-col h-full bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        
        {/* Encabezado */}
        <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layout className="h-5 w-5 text-primary" />
            <h2 className="font-serif text-base font-semibold">Constructor Landing</h2>
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

        {/* Workspace Tab Selector */}
        <div className="flex border-b border-border bg-muted/10 p-1">
          <button
            type="button"
            className={cn(
              "flex-1 py-2 text-xs font-semibold rounded-lg transition-all",
              editorTab === 'content' ? "bg-card text-foreground shadow-sm border border-border" : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setEditorTab('content')}
          >
            Contenido y Estructura
          </button>
          <button
            type="button"
            className={cn(
              "flex-1 py-2 text-xs font-semibold rounded-lg transition-all",
              editorTab === 'styles' ? "bg-card text-foreground shadow-sm border border-border" : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setEditorTab('styles')}
          >
            Estilos Globales
          </button>
        </div>

        {editorTab === 'content' ? (
          <>
            {/* Carrusel de Plantillas Base */}
            <div className="px-4 py-3 border-b border-border bg-secondary/5">
              <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">
                Plantillas Base Disponibles
              </Label>
              <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
                {templates.map((tpl) => (
                  <Card
                    key={tpl.id}
                    className={cn(
                      "min-w-[130px] max-w-[130px] p-2.5 border border-border bg-card hover:border-primary/40 cursor-pointer transition-all flex flex-col justify-between select-none relative overflow-hidden shrink-0",
                      templateId === tpl.id ? "border-primary ring-1 ring-primary/20 bg-primary/5" : ""
                    )}
                    onClick={() => applyTemplate(tpl)}
                  >
                    <div className="space-y-0.5">
                      <h4 className="text-[11px] font-semibold text-foreground truncate">{tpl.name}</h4>
                      <span className="text-[9px] text-muted-foreground block">{tpl.niche}</span>
                    </div>
                    
                    <div className="flex gap-1 mt-2.5">
                      {palettes.find(p => p.id === tpl.globalStyles?.paletteId)?.colors.map((c, i) => (
                        <span key={i} className="h-3 w-3 rounded-full border border-border/30" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Selector de bloques para añadir */}
            <div className="px-4 py-2 border-b border-border bg-muted/5 flex items-center justify-between">
              <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                Añadir Sección
              </Label>
              <div className="flex gap-1 overflow-x-auto max-w-[320px] scrollbar-none py-1">
                {sectionTemplates.map((t) => (
                  <Button
                    key={t.type}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-6 px-2 rounded-full bg-background text-[9px] hover:border-primary/50 hover:bg-primary/5 shrink-0"
                    onClick={() => addSection(t.type)}
                  >
                    <Plus className="mr-1 h-2.5 w-2.5 text-primary" />
                    {t.label.replace(' adicional', '').substring(0, 16)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Listado de secciones (Drag and Drop / Up-Down) */}
            <div className="p-4 border-b border-border max-h-[180px] overflow-y-auto space-y-1.5 bg-muted/10 scrollbar-thin">
              <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                Orden de Secciones
              </Label>
              {config.map((item, idx) => (
                <div
                  key={item.id}
                  id={`builder-card-${item.id}`}
                  className={cn(
                    "flex items-center justify-between p-2 rounded-lg border border-border bg-card transition-all cursor-pointer",
                    activeSectionId === item.id ? "border-primary/40 ring-1 ring-primary/10" : "hover:border-border-hover",
                    !item.visible && 'bg-secondary/10 opacity-70'
                  )}
                  onClick={() => setActiveSectionId(item.id)}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground font-mono w-3">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-foreground">
                      {item.label}
                    </span>
                    {!item.visible && (
                      <Badge variant="secondary" className="text-[8px] px-1 py-0 rounded">
                        Oculto
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 rounded-md"
                      disabled={idx === 0}
                      onClick={() => moveSection(idx, 'up')}
                    >
                      <ArrowUp className="h-3 w-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 rounded-md"
                      disabled={idx === config.length - 1}
                      onClick={() => moveSection(idx, 'down')}
                    >
                      <ArrowDown className="h-3 w-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => deleteSection(item.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                    <Switch
                      checked={item.visible}
                      onCheckedChange={() => toggleVisibility(item.id, item.visible)}
                      className="scale-75"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Formulario de Contenido Dinámico */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
              {activeSection ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs capitalize px-2 py-0.5 border-primary/30 text-primary">
                      Sección: {activeSection.label}
                    </Badge>
                  </div>

                  {/* Alineación (Afecta a todas las secciones que lo soportan) */}
                  <div className="grid gap-1.5 border-b border-border/40 pb-3">
                    <Label className="text-xs text-muted-foreground">Alineación del Texto</Label>
                    <div className="flex gap-2">
                      {[
                        { id: 'left', icon: AlignLeft, label: 'Izquierda' },
                        { id: 'center', icon: AlignCenter, label: 'Centro' },
                        { id: 'right', icon: AlignRight, label: 'Derecha' },
                      ].map((a) => (
                        <Button
                          key={a.id}
                          type="button"
                          variant={(activeSection.content.align || (activeSection.type === 'HERO_BANNER' ? 'center' : 'left')) === a.id ? 'secondary' : 'outline'}
                          size="sm"
                          className="flex-1 py-1 rounded-md text-xs h-8"
                          onClick={() => handleContentChange(activeSection.id, 'align', a.id)}
                        >
                          <a.icon className="h-3.5 w-3.5 mr-1" />
                          {a.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Formulario Específico de HERO_BANNER */}
                  {activeSection.type === 'HERO_BANNER' && (
                    <div className="space-y-3">
                      <div className="grid gap-1.5">
                        <Label htmlFor="b-title" className="text-xs">Título Principal</Label>
                        <Input
                          id="b-title"
                          value={activeSection.content.title || ''}
                          onChange={(e) => handleContentChange(activeSection.id, 'title', e.target.value)}
                        />
                      </div>
                      <div className="grid gap-1.5">
                        <Label htmlFor="b-tagline" className="text-xs">Lema / Subtítulo</Label>
                        <Textarea
                          id="b-tagline"
                          rows={2}
                          value={activeSection.content.subtitle || ''}
                          onChange={(e) => handleContentChange(activeSection.id, 'subtitle', e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="grid gap-1.5">
                          <Label htmlFor="b-cta" className="text-xs">Texto Botón</Label>
                          <Input
                            id="b-cta"
                            value={activeSection.content.ctaText || ''}
                            onChange={(e) => handleContentChange(activeSection.id, 'ctaText', e.target.value)}
                          />
                        </div>
                        <div className="grid gap-1.5">
                          <Label htmlFor="b-ctaUrl" className="text-xs">Enlace Botón (URL)</Label>
                          <Input
                            id="b-ctaUrl"
                            value={activeSection.content.ctaUrl || ''}
                            onChange={(e) => handleContentChange(activeSection.id, 'ctaUrl', e.target.value)}
                            placeholder="Ej. /catalog"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 border-t border-border/40 pt-2.5">
                        <div className="grid gap-1.5">
                          <Label className="text-xs">Logo del Negocio</Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs flex gap-1.5"
                            onClick={() => {
                              setMediaTarget('logo')
                              setMediaOpen(true)
                            }}
                          >
                            <ImageIcon className="h-3.5 w-3.5 text-primary" />
                            Elegir Logo
                          </Button>
                        </div>
                        <div className="grid gap-1.5">
                          <Label className="text-xs">Banner Principal</Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs flex gap-1.5"
                            onClick={() => {
                              setMediaTarget('banner')
                              setMediaOpen(true)
                            }}
                          >
                            <ImageIcon className="h-3.5 w-3.5 text-primary" />
                            Elegir Banner
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Formulario Específico de ABOUT_US */}
                  {activeSection.type === 'ABOUT_US' && (
                    <div className="space-y-3">
                      <div className="grid gap-1.5">
                        <Label htmlFor="a-title" className="text-xs">Título de Sección</Label>
                        <Input
                          id="a-title"
                          value={activeSection.content.title || ''}
                          onChange={(e) => handleContentChange(activeSection.id, 'title', e.target.value)}
                        />
                      </div>
                      <div className="grid gap-1.5">
                        <Label htmlFor="a-desc" className="text-xs">Descripción</Label>
                        <Textarea
                          id="a-desc"
                          rows={5}
                          value={activeSection.content.description || ''}
                          onChange={(e) => handleContentChange(activeSection.id, 'description', e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {/* Formulario Específico de PRODUCTS_LIST */}
                  {activeSection.type === 'PRODUCTS_LIST' && (
                    <div className="space-y-3">
                      <div className="grid gap-1.5">
                        <Label htmlFor="p-title" className="text-xs">Título</Label>
                        <Input
                          id="p-title"
                          value={activeSection.content.title || ''}
                          onChange={(e) => handleContentChange(activeSection.id, 'title', e.target.value)}
                        />
                      </div>
                      <div className="grid gap-1.5">
                        <Label htmlFor="p-subtitle" className="text-xs">Subtítulo</Label>
                        <Input
                          id="p-subtitle"
                          value={activeSection.content.subtitle || ''}
                          onChange={(e) => handleContentChange(activeSection.id, 'subtitle', e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {/* Formulario Específico de CONTACT_INFO */}
                  {activeSection.type === 'CONTACT_INFO' && (
                    <div className="space-y-3">
                      <div className="grid gap-1.5">
                        <Label htmlFor="c-title" className="text-xs">Título</Label>
                        <Input
                          id="c-title"
                          value={activeSection.content.title || ''}
                          onChange={(e) => handleContentChange(activeSection.id, 'title', e.target.value)}
                        />
                      </div>
                      <div className="grid gap-1.5">
                        <Label htmlFor="c-phone" className="text-xs">Teléfono</Label>
                        <Input
                          id="c-phone"
                          value={activeSection.content.phone || ''}
                          onChange={(e) => handleContentChange(activeSection.id, 'phone', e.target.value)}
                        />
                      </div>
                      <div className="grid gap-1.5">
                        <Label htmlFor="c-email" className="text-xs">Email</Label>
                        <Input
                          id="c-email"
                          value={activeSection.content.email || ''}
                          onChange={(e) => handleContentChange(activeSection.id, 'email', e.target.value)}
                        />
                      </div>
                      <div className="grid gap-1.5">
                        <Label htmlFor="c-address" className="text-xs">Dirección</Label>
                        <Input
                          id="c-address"
                          value={activeSection.content.address || ''}
                          onChange={(e) => handleContentChange(activeSection.id, 'address', e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {/* Formulario Específico de FEATURES_LIST */}
                  {activeSection.type === 'FEATURES_LIST' && (
                    <div className="space-y-3">
                      <div className="grid gap-1.5">
                        <Label htmlFor="f-title" className="text-xs">Título de Sección</Label>
                        <Input
                          id="f-title"
                          value={activeSection.content.title || ''}
                          onChange={(e) => handleContentChange(activeSection.id, 'title', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2.5">
                        <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                          Tarjetas de Servicio
                        </Label>
                        <div className="grid gap-2">
                          {(activeSection.content.items || []).map((item: any, idx: number) => (
                            <Card key={idx} className="animate-feature-item p-3 border border-border bg-background rounded-lg shadow-none relative group/item">
                              <button
                                type="button"
                                onClick={() => removeFeatureItem(activeSection.id, idx)}
                                className="absolute right-2 top-2 h-5 w-5 flex items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive opacity-0 group-hover/item:opacity-100 transition-all duration-200"
                              >
                                <X className="h-3 w-3" />
                              </button>
                              <div className="grid gap-2">
                                <div className="grid gap-0.5">
                                  <Label className="text-[10px] text-muted-foreground">Título</Label>
                                  <Input
                                    value={item.title || ''}
                                    onChange={(e) => updateFeatureItem(activeSection.id, idx, 'title', e.target.value)}
                                    placeholder="Nombre del servicio"
                                    className="h-7 text-xs"
                                  />
                                </div>
                                <div className="grid gap-0.5">
                                  <Label className="text-[10px] text-muted-foreground">Descripción</Label>
                                  <Textarea
                                    rows={2}
                                    value={item.description || ''}
                                    onChange={(e) => updateFeatureItem(activeSection.id, idx, 'description', e.target.value)}
                                    placeholder="Detalles"
                                    className="text-xs py-1 min-h-[50px] resize-none"
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
                          className="rounded-lg border border-dashed border-border text-[11px] w-full py-3 h-auto"
                          onClick={() => addFeatureItem(activeSection.id)}
                        >
                          <Plus className="mr-1 h-3 w-3" /> Agregar Servicio
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Formulario Específico de TESTIMONIALS */}
                  {activeSection.type === 'TESTIMONIALS' && (
                    <div className="space-y-3">
                      <div className="grid gap-1.5">
                        <Label htmlFor="t-title" className="text-xs">Título</Label>
                        <Input
                          id="t-title"
                          value={activeSection.content.title || ''}
                          onChange={(e) => handleContentChange(activeSection.id, 'title', e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {/* Formulario Específico de FAQ */}
                  {activeSection.type === 'FAQ' && (
                    <div className="space-y-3">
                      <div className="grid gap-1.5">
                        <Label htmlFor="q-title" className="text-xs">Título</Label>
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
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center p-6">
                  <Sparkles className="h-8 w-8 mb-2 opacity-40 text-primary" />
                  <p className="text-xs">Selecciona una sección activa en el listado superior para comenzar a editar su contenido.</p>
                </div>
              )}
            </div>
          </>
        ) : (
          /* PESTAÑA: Estilos Globales (Theme Manager) */
          <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin">
            
            {/* Paletas de Color */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <Paintbrush className="h-4 w-4 text-primary" />
                <Label className="text-xs font-bold text-foreground uppercase tracking-wider block">
                  Paleta de Colores
                </Label>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {palettes.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className={cn(
                      "flex items-center justify-between p-2.5 rounded-lg border border-border bg-card text-left transition-all text-xs hover:border-primary/30",
                      globalStyles.paletteId === p.id ? "border-primary ring-1 ring-primary/20 bg-muted/10 font-bold" : ""
                    )}
                    onClick={() => setGlobalStyles((prev: any) => ({ ...prev, paletteId: p.id }))}
                  >
                    <span className="truncate max-w-[80px]">{p.name.replace(' (por defecto)', '')}</span>
                    <div className="flex gap-0.5 shrink-0">
                      {p.colors.map((c, idx) => (
                        <span
                          key={idx}
                          className="h-3 w-3 rounded-full border border-background"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Combinaciones Tipográficas */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <Type className="h-4 w-4 text-primary" />
                <Label className="text-xs font-bold text-foreground uppercase tracking-wider block">
                  Parejas de Fuentes
                </Label>
              </div>
              <div className="grid gap-2">
                {fontPairs.map((fp) => (
                  <button
                    key={fp.id}
                    type="button"
                    className={cn(
                      "flex flex-col p-3 rounded-lg border border-border bg-card text-left transition-all hover:border-primary/30",
                      globalStyles.fontPairId === fp.id ? "border-primary ring-1 ring-primary/20 bg-muted/10" : ""
                    )}
                    onClick={() => setGlobalStyles((prev: any) => ({ ...prev, fontPairId: fp.id }))}
                  >
                    <span className="text-xs font-bold text-foreground">{fp.name}</span>
                    <div className="flex gap-4 mt-1.5 opacity-70">
                      <span className="text-[10px]" style={{ fontFamily: fp.titleFont }}>
                        Título Ejemplo
                      </span>
                      <span className="text-[10px]" style={{ fontFamily: fp.bodyFont }}>
                        Lorem ipsum dolor sit amet
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Bordes / Estilos de Botón */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <Smile className="h-4 w-4 text-primary" />
                <Label className="text-xs font-bold text-foreground uppercase tracking-wider block">
                  Estilo de Botones
                </Label>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {buttonStyles.map((bs) => (
                  <Button
                    key={bs.id}
                    type="button"
                    variant={globalStyles.buttonStyle === bs.id ? 'secondary' : 'outline'}
                    size="sm"
                    className={cn(
                      "text-[10px] py-2 h-auto truncate font-medium",
                      bs.id === 'rounded' ? 'rounded-md' : bs.id === 'square' ? 'rounded-none' : 'rounded-full'
                    )}
                    onClick={() => setGlobalStyles((prev: any) => ({ ...prev, buttonStyle: bs.id }))}
                  >
                    {bs.name.split(' ')[0]}
                  </Button>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>

      {/* PANEL DERECHO: Live Preview */}
      <div className="animate-builder-panel opacity-0 flex flex-col h-full bg-muted/20 border border-border rounded-xl overflow-hidden shadow-inner">
        
        {/* Barra superior de controles del Preview */}
        <div className="p-3 border-b border-border bg-card flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Edición Inline Activa
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

        {/* Viewport de Simulación */}
        <div className="flex-1 overflow-y-auto p-4 flex justify-center bg-muted/40 items-start">
          <div 
            id="preview-viewport-container"
            className={cn(
              "bg-background shadow-md border border-border/80 transition-all duration-300 overflow-y-auto max-h-[80vh] w-full",
              previewDevice === 'desktop' ? "max-w-4xl rounded-xl" : "w-[360px] h-[640px] rounded-3xl border-8 border-zinc-800"
            )}
          >
            {/* Componente interactivo con inline editing */}
            <div className="w-full h-full min-h-[450px]">
              {profile && (
                <PublicBusinessLanding 
                  profile={profile} 
                  sections={config} 
                  globalStyles={globalStyles}
                  onInlineEdit={handleInlineEdit}
                  onImageClick={(target) => {
                    setMediaTarget(target)
                    setMediaOpen(true)
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <MediaManagerDialog
        open={mediaOpen}
        onClose={() => {
          setMediaOpen(false)
          setMediaTarget(null)
        }}
        onSelect={handleMediaSelect}
        profile={profile}
      />
    </div>
  )
}
