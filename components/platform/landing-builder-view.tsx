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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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

  // Estados para diálogos de alerta y confirmación personalizados
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean
    title: string
    message: string
    onConfirm: () => void
  } | null>(null)

  const [alertModal, setAlertModal] = useState<{
    open: boolean
    title: string
    message: string
  } | null>(null)

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
      setAlertModal({
        open: true,
        title: '¡Guardado exitoso!',
        message: 'La configuración de tu landing page se ha guardado correctamente en la base de datos.'
      })
    } catch (err: any) {
      console.error('Error al guardar la landing config:', err)
      setAlertModal({
        open: true,
        title: 'Error al guardar',
        message: err.message || 'Ocurrió un error inesperado al intentar guardar los cambios.'
      })
    } finally {
      setSaving(false)
    }
  }

  // Sobrescribir plantilla
  function applyTemplate(tpl: any) {
    setConfirmModal({
      open: true,
      title: '¿Confirmas aplicar esta plantilla?',
      message: `Estás seguro de que deseas aplicar la plantilla "${tpl.name}". Ten en cuenta que esto sobrescribirá tu configuración de secciones y estilos actuales en el constructor.`,
      onConfirm: () => {
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
    })
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
  function handleInlineEdit(sectionId: string, fieldKey: string, newValue: string, index?: any, itemKey?: string) {
    setConfig(prev =>
      prev.map(item => {
        if (item.id !== sectionId) return item
        
        // Element Widget nested edit
        if (fieldKey === 'element_content' && index) {
          const elementId = index;
          const updatedColumns = (item.columns || []).map(col => {
            const updatedElements = (col.elements || []).map(el => {
              if (el.id !== elementId) return el
              return {
                ...el,
                content: {
                  ...el.content,
                  [itemKey || 'text']: newValue
                }
              }
            })
            return { ...col, elements: updatedElements }
          })
          return { ...item, columns: updatedColumns }
        }
        
        // Fallback standard fields
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
              ...(item.content || {}),
              [fieldKey]: newValue,
            },
          }
        }
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

  function addListItem(sectionId: string, defaultItem: any) {
    setConfig((prev) =>
      prev.map((s) => {
        if (s.id !== sectionId) return s
        const items = [...(s.content.items || []), defaultItem]
        return { ...s, content: { ...s.content, items } }
      })
    )
  }

  function removeListItem(sectionId: string, idx: number) {
    setConfig((prev) =>
      prev.map((s) => {
        if (s.id !== sectionId) return s
        const items = (s.content.items || []).filter((_: any, i: number) => i !== idx)
        return { ...s, content: { ...s.content, items } }
      })
    )
  }

  function updateListItem(sectionId: string, idx: number, field: string, val: any) {
    setConfig((prev) =>
      prev.map((s) => {
        if (s.id !== sectionId) return s
        const items = (s.content.items || []).map((item: any, i: number) => {
          if (i !== idx) return item
          return { ...item, [field]: val }
        })
        return { ...s, content: { ...s.content, items } }
      })
    )
  }

  function changeColumnsLayout(sectionId: string, colCount: number) {
    setConfig((prev) =>
      prev.map((s) => {
        if (s.id !== sectionId) return s
        const currentCols = s.columns || []
        let newCols: any[] = []
        if (colCount === 1) {
          const allElements = currentCols.flatMap((c) => c.elements || [])
          newCols = [
            {
              id: `col_${s.id}_1`,
              width: '1',
              elements: allElements
            }
          ]
        } else if (colCount === 2) {
          const col1Elements = currentCols[0]?.elements || []
          const col2Elements = [
            ...(currentCols[1]?.elements || []),
            ...(currentCols[2]?.elements || [])
          ]
          newCols = [
            { id: `col_${s.id}_1`, width: '1/2', elements: col1Elements },
            { id: `col_${s.id}_2`, width: '1/2', elements: col2Elements }
          ]
        } else if (colCount === 3) {
          const col1Elements = currentCols[0]?.elements || []
          const col2Elements = currentCols[1]?.elements || []
          const col3Elements = currentCols[2]?.elements || []
          newCols = [
            { id: `col_${s.id}_1`, width: '1/3', elements: col1Elements },
            { id: `col_${s.id}_2`, width: '1/3', elements: col2Elements },
            { id: `col_${s.id}_3`, width: '1/3', elements: col3Elements }
          ]
        }
        return { ...s, columns: newCols }
      })
    )
    
    setTimeout(() => {
      animateSelector('#preview-viewport-container div.grid', {
        opacity: [0.8, 1],
        duration: 350,
        easing: 'easeOutExpo'
      })
    }, 30)
  }

  function addElement(sectionId: string, colIdx: number, type: string) {
    const newElId = `el_${type.toLowerCase()}_${Date.now()}`
    let content: any = {}
    let styles: any = { alignment: 'left' }

    if (type === 'HEADING') {
      content = { text: 'Nuevo Título', level: 'h2' }
    } else if (type === 'PARAGRAPH') {
      content = { text: 'Texto del párrafo. Edítame haciendo doble clic.' }
    } else if (type === 'IMAGE') {
      content = { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80', alt: 'Imagen' }
      styles = { borderRadius: 'lg', alignment: 'center' }
    } else if (type === 'BUTTON') {
      content = { text: 'Haz clic aquí', url: '#form' }
      styles = { variant: 'solid', alignment: 'left' }
    } else if (type === 'SPACER') {
      content = { height: '24px' }
    } else if (type === 'VIDEO') {
      content = { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
    } else if (type === 'FORM') {
      content = { ctaText: 'Registrarme' }
    } else if (type === 'TESTIMONIAL') {
      content = {
        columns: 3,
        items: [
          { name: 'Cliente Satisfecho', role: 'Comerciante', comment: 'Excelente servicio.', rating: 5, avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' }
        ]
      }
    } else if (type === 'ACCORDION') {
      content = {
        items: [
          { question: '¿Nueva Pregunta?', answer: 'Respuesta de ejemplo.' }
        ]
      }
    }

    setConfig((prev) =>
      prev.map((s) => {
        if (s.id !== sectionId) return s
        const columns = (s.columns || []).map((col: any, idx: number) => {
          if (idx !== colIdx) return col
          return {
            ...col,
            elements: [...(col.elements || []), { id: newElId, type, content, styles }]
          }
        })
        return { ...s, columns }
      })
    )

    setTimeout(() => {
      animateSelector(`#preview-section-${sectionId} div`, {
        scale: [0.93, 1],
        opacity: [0, 1],
        duration: 350,
        easing: 'easeOutBack'
      })
    }, 50)
  }

  function deleteElement(sectionId: string, colIdx: number, elIdx: number) {
    setConfig((prev) =>
      prev.map((s) => {
        if (s.id !== sectionId) return s
        const columns = (s.columns || []).map((col: any, idx: number) => {
          if (idx !== colIdx) return col
          return {
            ...col,
            elements: (col.elements || []).filter((_: any, i: number) => i !== elIdx)
          }
        })
        return { ...s, columns }
      })
    )
  }

  function moveElement(sectionId: string, colIdx: number, elIdx: number, direction: 'up' | 'down') {
    setConfig((prev) =>
      prev.map((s) => {
        if (s.id !== sectionId) return s
        const columns = (s.columns || []).map((col: any, idx: number) => {
          if (idx !== colIdx) return col
          const elements = [...(col.elements || [])]
          const targetIdx = direction === 'up' ? elIdx - 1 : elIdx + 1
          if (targetIdx < 0 || targetIdx >= elements.length) return col
          
          const temp = elements[elIdx]
          elements[elIdx] = elements[targetIdx]
          elements[targetIdx] = temp
          return { ...col, elements }
        })
        return { ...s, columns }
      })
    )
  }

  function moveElementToColumn(sectionId: string, fromColIdx: number, toColIdx: number, elIdx: number) {
    setConfig((prev) =>
      prev.map((s) => {
        if (s.id !== sectionId) return s
        const cols = [...(s.columns || [])]
        if (!cols[fromColIdx] || !cols[toColIdx]) return s
        
        const el = cols[fromColIdx].elements[elIdx]
        cols[fromColIdx].elements = cols[fromColIdx].elements.filter((_: any, i: number) => i !== elIdx)
        cols[toColIdx].elements = [...(cols[toColIdx].elements || []), el]
        
        return { ...s, columns: cols }
      })
    )
  }

  function updateElementProperty(sectionId: string, colIdx: number, elIdx: number, key: 'content' | 'styles', propName: string, val: any) {
    setConfig((prev) =>
      prev.map((s) => {
        if (s.id !== sectionId) return s
        const columns = (s.columns || []).map((col: any, idx: number) => {
          if (idx !== colIdx) return col
          const elements = (col.elements || []).map((el: any, i: number) => {
            if (i !== elIdx) return el
            return {
              ...el,
              [key]: {
                ...(el[key] || {}),
                [propName]: val
              }
            }
          })
          return { ...col, elements }
        })
        return { ...s, columns }
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

                  {/* Formulario de Rejilla Modular GRID_SECTION */}
                  {activeSection.type === 'GRID_SECTION' && (
                    <div className="space-y-6">
                      <div className="grid gap-1.5 border-b border-border/40 pb-4">
                        <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                          Distribución de Columnas
                        </Label>
                        <div className="flex gap-2">
                          {[
                            { count: 1, label: '1 Col (100%)' },
                            { count: 2, label: '2 Col (50/50)' },
                            { count: 3, label: '3 Col (33/33/33)' }
                          ].map((colOpt) => (
                            <Button
                              key={colOpt.count}
                              type="button"
                              variant={(activeSection.columns?.length || 1) === colOpt.count ? 'secondary' : 'outline'}
                              size="sm"
                              className="flex-1 text-xs"
                              onClick={() => changeColumnsLayout(activeSection.id, colOpt.count)}
                            >
                              {colOpt.label}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        {(activeSection.columns || []).map((col: any, colIdx: number) => (
                          <Card key={col.id} className="p-3.5 border border-border bg-card rounded-xl space-y-3 shadow-none">
                            <div className="flex justify-between items-center border-b border-border/30 pb-2">
                              <span className="text-xs font-bold text-foreground">
                                Columna {colIdx + 1} ({col.width === '1' ? '100%' : col.width === '1/2' ? '50%' : '33%'})
                              </span>
                              <Badge variant="outline" className="text-[9px] px-1 py-0 border-border/60">
                                {col.elements?.length || 0} widgets
                              </Badge>
                            </div>

                            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
                              {(col.elements || []).map((el: any, elIdx: number) => (
                                <div key={el.id} className="flex flex-col gap-2 p-2 rounded-lg bg-background border border-border hover:border-primary/20 transition-all text-left">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[10px] uppercase font-bold text-primary font-mono scale-90">
                                        {el.type}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-5 w-5 rounded-md"
                                        disabled={elIdx === 0}
                                        onClick={() => moveElement(activeSection.id, colIdx, elIdx, 'up')}
                                      >
                                        <ArrowUp className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-5 w-5 rounded-md"
                                        disabled={elIdx === col.elements.length - 1}
                                        onClick={() => moveElement(activeSection.id, colIdx, elIdx, 'down')}
                                      >
                                        <ArrowDown className="h-3 w-3" />
                                      </Button>
                                      {(activeSection.columns || []).length > 1 && (
                                        <Button
                                          size="icon"
                                          variant="ghost"
                                          className="h-5 w-5 rounded-md text-muted-foreground hover:bg-muted"
                                          title="Mover a otra columna"
                                          onClick={() => {
                                            const destCol = colIdx === 0 ? 1 : 0;
                                            moveElementToColumn(activeSection.id, colIdx, destCol, elIdx);
                                          }}
                                        >
                                          <Layout className="h-3 w-3" />
                                        </Button>
                                      )}
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-5 w-5 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                        onClick={() => deleteElement(activeSection.id, colIdx, elIdx)}
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>

                                  <div className="grid gap-1 border-t border-border/10 pt-1.5">
                                    {el.type === 'HEADING' && (
                                      <div className="grid grid-cols-[80px_1fr] gap-1.5 items-center">
                                        <Label className="text-[10px] text-muted-foreground">Etiqueta</Label>
                                        <select
                                          value={el.content.level || 'h2'}
                                          onChange={(e) => updateElementProperty(activeSection.id, colIdx, elIdx, 'content', 'level', e.target.value)}
                                          className="h-6 text-[10px] rounded border border-border bg-card px-1"
                                        >
                                          <option value="h1">H1 (Grande)</option>
                                          <option value="h2">H2 (Medio)</option>
                                          <option value="h3">H3 (Subtítulo)</option>
                                          <option value="h4">H4 (Chico)</option>
                                        </select>
                                      </div>
                                    )}
                                    {el.type === 'BUTTON' && (
                                      <div className="grid grid-cols-[80px_1fr] gap-1.5 items-center">
                                        <Label className="text-[10px] text-muted-foreground">Enlace (URL)</Label>
                                        <Input
                                          value={el.content.url || ''}
                                          onChange={(e) => updateElementProperty(activeSection.id, colIdx, elIdx, 'content', 'url', e.target.value)}
                                          className="h-6 text-[10px] px-1.5"
                                          placeholder="#form"
                                        />
                                      </div>
                                    )}
                                    {el.type === 'IMAGE' && (
                                      <div className="grid grid-cols-[80px_1fr] gap-1.5 items-center">
                                        <Label className="text-[10px] text-muted-foreground">Imagen</Label>
                                        <Button
                                          type="button"
                                          variant="outline"
                                          size="sm"
                                          className="h-6 text-[10px] py-0 px-2 flex gap-1"
                                          onClick={() => {
                                            setMediaTarget({ sectionId: activeSection.id, contentKey: `element_image_${el.id}` })
                                            setMediaOpen(true)
                                          }}
                                        >
                                          Elegir Imagen
                                        </Button>
                                      </div>
                                    )}
                                    {el.type === 'VIDEO' && (
                                      <div className="grid grid-cols-[80px_1fr] gap-1.5 items-center">
                                        <Label className="text-[10px] text-muted-foreground">Video URL</Label>
                                        <Input
                                          value={el.content.url || ''}
                                          onChange={(e) => updateElementProperty(activeSection.id, colIdx, elIdx, 'content', 'url', e.target.value)}
                                          className="h-6 text-[10px] px-1.5"
                                          placeholder="https://youtube.com/..."
                                        />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                              {(!col.elements || col.elements.length === 0) && (
                                <div className="text-center py-4 border border-dashed border-border/40 rounded-lg text-muted-foreground text-[10px] italic">
                                  Columna vacía
                                </div>
                              )}
                            </div>

                            <div className="pt-2 border-t border-border/30">
                              <Label className="text-[9px] font-bold text-muted-foreground uppercase block mb-1">
                                + Añadir Widget a Col {colIdx + 1}
                              </Label>
                              <div className="grid grid-cols-3 gap-1">
                                {[
                                  { type: 'HEADING', label: 'Título/H1' },
                                  { type: 'PARAGRAPH', label: 'Texto' },
                                  { type: 'IMAGE', label: 'Imagen' },
                                  { type: 'BUTTON', label: 'Botón' },
                                  { type: 'VIDEO', label: 'Video' },
                                  { type: 'SPACER', label: 'Espacio' }
                                ].map((w) => (
                                  <button
                                    key={w.type}
                                    type="button"
                                    onClick={() => addElement(activeSection.id, colIdx, w.type)}
                                    className="h-6 text-[9px] rounded border border-border hover:bg-muted hover:border-primary/20 transition-all font-medium"
                                  >
                                    {w.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

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
                            placeholder="Ej. #form"
                          />
                        </div>
                      </div>
                      <div className="grid gap-1.5">
                        <Label className="text-xs">Composición del Banner</Label>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant={activeSection.content.layoutDirection === 'left-to-right' ? 'secondary' : 'outline'}
                            size="sm"
                            className="flex-1 text-xs"
                            onClick={() => handleContentChange(activeSection.id, 'layoutDirection', 'left-to-right')}
                          >
                            Texto Izq / Imagen Der
                          </Button>
                          <Button
                            type="button"
                            variant={activeSection.content.layoutDirection === 'right-to-left' ? 'secondary' : 'outline'}
                            size="sm"
                            className="flex-1 text-xs"
                            onClick={() => handleContentChange(activeSection.id, 'layoutDirection', 'right-to-left')}
                          >
                            Imagen Izq / Texto Der
                          </Button>
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

                  {/* Formulario Específico de EMPATHY_SECTION */}
                  {activeSection.type === 'EMPATHY_SECTION' && (
                    <div className="space-y-3">
                      <div className="grid gap-1.5">
                        <Label htmlFor="emp-title" className="text-xs">Título del Dolor</Label>
                        <Input
                          id="emp-title"
                          value={activeSection.content.title || ''}
                          onChange={(e) => handleContentChange(activeSection.id, 'title', e.target.value)}
                        />
                      </div>
                      <div className="grid gap-1.5">
                        <Label htmlFor="emp-desc" className="text-xs">Descripción (Empatía / Dolor)</Label>
                        <Textarea
                          id="emp-desc"
                          rows={4}
                          value={activeSection.content.description || ''}
                          onChange={(e) => handleContentChange(activeSection.id, 'description', e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {/* Formulario Específico de SOLUTION_OFFER */}
                  {activeSection.type === 'SOLUTION_OFFER' && (
                    <div className="space-y-3">
                      <div className="grid gap-1.5">
                        <Label htmlFor="sol-title" className="text-xs">Título de la Oferta</Label>
                        <Input
                          id="sol-title"
                          value={activeSection.content.title || ''}
                          onChange={(e) => handleContentChange(activeSection.id, 'title', e.target.value)}
                        />
                      </div>
                      <div className="grid gap-1.5">
                        <Label htmlFor="sol-desc" className="text-xs">Descripción Persuasiva</Label>
                        <Textarea
                          id="sol-desc"
                          rows={4}
                          value={activeSection.content.description || ''}
                          onChange={(e) => handleContentChange(activeSection.id, 'description', e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="grid gap-1.5">
                          <Label htmlFor="sol-cta" className="text-xs">Texto Botón</Label>
                          <Input
                            id="sol-cta"
                            value={activeSection.content.ctaText || ''}
                            onChange={(e) => handleContentChange(activeSection.id, 'ctaText', e.target.value)}
                          />
                        </div>
                        <div className="grid gap-1.5">
                          <Label htmlFor="sol-ctaUrl" className="text-xs">Enlace Botón (URL)</Label>
                          <Input
                            id="sol-ctaUrl"
                            value={activeSection.content.ctaUrl || ''}
                            onChange={(e) => handleContentChange(activeSection.id, 'ctaUrl', e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="grid gap-1.5">
                        <Label className="text-xs">Composición de la Oferta</Label>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant={activeSection.content.layoutDirection === 'left-to-right' ? 'secondary' : 'outline'}
                            size="sm"
                            className="flex-1 text-xs"
                            onClick={() => handleContentChange(activeSection.id, 'layoutDirection', 'left-to-right')}
                          >
                            Texto Izq / Imagen Der
                          </Button>
                          <Button
                            type="button"
                            variant={activeSection.content.layoutDirection === 'right-to-left' ? 'secondary' : 'outline'}
                            size="sm"
                            className="flex-1 text-xs"
                            onClick={() => handleContentChange(activeSection.id, 'layoutDirection', 'right-to-left')}
                          >
                            Imagen Izq / Texto Der
                          </Button>
                        </div>
                      </div>
                      <div className="grid gap-1.5">
                        <Label className="text-xs">Imagen Destacada</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs flex gap-1.5 w-full"
                          onClick={() => {
                            setMediaTarget({ sectionId: activeSection.id, contentKey: 'imageUrl' })
                            setMediaOpen(true)
                          }}
                        >
                          <ImageIcon className="h-3.5 w-3.5 text-primary" />
                          Seleccionar Imagen
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Formulario Específico de VALUE_PROP */}
                  {activeSection.type === 'VALUE_PROP' && (
                    <div className="space-y-4">
                      <div className="grid gap-1.5">
                        <Label htmlFor="val-title" className="text-xs">Título del Bloque</Label>
                        <Input
                          id="val-title"
                          value={activeSection.content.title || ''}
                          onChange={(e) => handleContentChange(activeSection.id, 'title', e.target.value)}
                        />
                      </div>
                      <div className="grid gap-1.5">
                        <Label className="text-xs">Columnas en Pantalla</Label>
                        <div className="flex gap-1.5">
                          {[2, 3, 4].map((col) => (
                            <Button
                              key={col}
                              type="button"
                              variant={activeSection.content.columns === col ? 'secondary' : 'outline'}
                              size="sm"
                              className="flex-1 text-xs"
                              onClick={() => handleContentChange(activeSection.id, 'columns', col)}
                            >
                              {col} Col
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                          Beneficios / Propuestas de Valor
                        </Label>
                        <div className="grid gap-2">
                          {(activeSection.content.items || []).map((item: any, idx: number) => (
                            <Card key={idx} className="p-3 border border-border bg-background rounded-lg relative group/item">
                              <button
                                type="button"
                                onClick={() => removeListItem(activeSection.id, idx)}
                                className="absolute right-2 top-2 h-5 w-5 flex items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive opacity-0 group-hover/item:opacity-100 transition-all duration-200"
                              >
                                <X className="h-3 w-3" />
                              </button>
                              <div className="grid gap-2">
                                <div className="grid gap-0.5">
                                  <Label className="text-[10px] text-muted-foreground">Título del Beneficio</Label>
                                  <Input
                                    value={item.title || ''}
                                    onChange={(e) => updateListItem(activeSection.id, idx, 'title', e.target.value)}
                                    className="h-7 text-xs"
                                  />
                                </div>
                                <div className="grid gap-0.5">
                                  <Label className="text-[10px] text-muted-foreground">Descripción Corta</Label>
                                  <Textarea
                                    rows={2}
                                    value={item.description || ''}
                                    onChange={(e) => updateListItem(activeSection.id, idx, 'description', e.target.value)}
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
                          className="rounded-lg border border-dashed border-border text-[11px] w-full py-2.5 h-auto"
                          onClick={() => addListItem(activeSection.id, { title: 'Nuevo Beneficio', description: 'Detalle del beneficio.' })}
                        >
                          <Plus className="mr-1 h-3 w-3" /> Agregar Beneficio
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Formulario Específico de HOW_IT_WORKS */}
                  {activeSection.type === 'HOW_IT_WORKS' && (
                    <div className="space-y-4">
                      <div className="grid gap-1.5">
                        <Label htmlFor="how-title" className="text-xs">Título del Proceso</Label>
                        <Input
                          id="how-title"
                          value={activeSection.content.title || ''}
                          onChange={(e) => handleContentChange(activeSection.id, 'title', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                          Pasos del Proceso
                        </Label>
                        <div className="grid gap-2">
                          {(activeSection.content.items || []).map((item: any, idx: number) => (
                            <Card key={idx} className="p-3 border border-border bg-background rounded-lg relative group/item">
                              <button
                                type="button"
                                onClick={() => removeListItem(activeSection.id, idx)}
                                className="absolute right-2 top-2 h-5 w-5 flex items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive opacity-0 group-hover/item:opacity-100 transition-all duration-200"
                              >
                                <X className="h-3 w-3" />
                              </button>
                              <div className="grid gap-2">
                                <div className="grid grid-cols-[50px_1fr] gap-2">
                                  <div className="grid gap-0.5">
                                    <Label className="text-[10px] text-muted-foreground">Paso #</Label>
                                    <Input
                                      value={item.step || ''}
                                      onChange={(e) => updateListItem(activeSection.id, idx, 'step', e.target.value)}
                                      className="h-7 text-xs text-center"
                                    />
                                  </div>
                                  <div className="grid gap-0.5">
                                    <Label className="text-[10px] text-muted-foreground">Título</Label>
                                    <Input
                                      value={item.title || ''}
                                      onChange={(e) => updateListItem(activeSection.id, idx, 'title', e.target.value)}
                                      className="h-7 text-xs"
                                    />
                                  </div>
                                </div>
                                <div className="grid gap-0.5">
                                  <Label className="text-[10px] text-muted-foreground">Detalles del Paso</Label>
                                  <Textarea
                                    rows={2}
                                    value={item.description || ''}
                                    onChange={(e) => updateListItem(activeSection.id, idx, 'description', e.target.value)}
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
                          className="rounded-lg border border-dashed border-border text-[11px] w-full py-2.5 h-auto"
                          onClick={() => addListItem(activeSection.id, { step: `${(activeSection.content.items?.length || 0) + 1}`, title: 'Nuevo Paso', description: 'Detalle de la acción.' })}
                        >
                          <Plus className="mr-1 h-3 w-3" /> Agregar Paso
                        </Button>
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
                        <Label htmlFor="a-desc" className="text-xs">Biografía / Trayectoria</Label>
                        <Textarea
                          id="a-desc"
                          rows={5}
                          value={activeSection.content.description || ''}
                          onChange={(e) => handleContentChange(activeSection.id, 'description', e.target.value)}
                        />
                      </div>
                      <div className="grid gap-1.5">
                        <Label htmlFor="a-signature" className="text-xs">Firma Autoridad (ej. Nombre del fundador / cargo)</Label>
                        <Input
                          id="a-signature"
                          value={activeSection.content.signature || ''}
                          onChange={(e) => handleContentChange(activeSection.id, 'signature', e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {/* Formulario Específico de TESTIMONIALS */}
                  {activeSection.type === 'TESTIMONIALS' && (
                    <div className="space-y-4">
                      <div className="grid gap-1.5">
                        <Label htmlFor="t-title" className="text-xs">Título del Bloque</Label>
                        <Input
                          id="t-title"
                          value={activeSection.content.title || ''}
                          onChange={(e) => handleContentChange(activeSection.id, 'title', e.target.value)}
                        />
                      </div>
                      <div className="grid gap-1.5">
                        <Label className="text-xs">Columnas en Pantalla</Label>
                        <div className="flex gap-1.5">
                          {[2, 3, 4].map((col) => (
                            <Button
                              key={col}
                              type="button"
                              variant={activeSection.content.columns === col ? 'secondary' : 'outline'}
                              size="sm"
                              className="flex-1 text-xs"
                              onClick={() => handleContentChange(activeSection.id, 'columns', col)}
                            >
                              {col} Col
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                          Testimonios Recibidos
                        </Label>
                        <div className="grid gap-2">
                          {(activeSection.content.items || []).map((item: any, idx: number) => (
                            <Card key={idx} className="p-3 border border-border bg-background rounded-lg relative group/item">
                              <button
                                type="button"
                                onClick={() => removeListItem(activeSection.id, idx)}
                                className="absolute right-2 top-2 h-5 w-5 flex items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive opacity-0 group-hover/item:opacity-100 transition-all duration-200"
                              >
                                <X className="h-3 w-3" />
                              </button>
                              <div className="grid gap-2">
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="grid gap-0.5">
                                    <Label className="text-[10px] text-muted-foreground">Nombre</Label>
                                    <Input
                                      value={item.name || ''}
                                      onChange={(e) => updateListItem(activeSection.id, idx, 'name', e.target.value)}
                                      className="h-7 text-xs"
                                    />
                                  </div>
                                  <div className="grid gap-0.5">
                                    <Label className="text-[10px] text-muted-foreground">Cargo / Referencia</Label>
                                    <Input
                                      value={item.role || ''}
                                      onChange={(e) => updateListItem(activeSection.id, idx, 'role', e.target.value)}
                                      className="h-7 text-xs"
                                    />
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="grid gap-0.5">
                                    <Label className="text-[10px] text-muted-foreground">Calificación (1-5)</Label>
                                    <Input
                                      type="number"
                                      min={1}
                                      max={5}
                                      value={item.rating || 5}
                                      onChange={(e) => updateListItem(activeSection.id, idx, 'rating', parseInt(e.target.value) || 5)}
                                      className="h-7 text-xs"
                                    />
                                  </div>
                                  <div className="grid gap-0.5">
                                    <Label className="text-[10px] text-muted-foreground">URL Avatar (Opcional)</Label>
                                    <Input
                                      value={item.avatarUrl || ''}
                                      onChange={(e) => updateListItem(activeSection.id, idx, 'avatarUrl', e.target.value)}
                                      placeholder="https://..."
                                      className="h-7 text-xs"
                                    />
                                  </div>
                                </div>
                                <div className="grid gap-0.5">
                                  <Label className="text-[10px] text-muted-foreground">Comentario</Label>
                                  <Textarea
                                    rows={2}
                                    value={item.comment || ''}
                                    onChange={(e) => updateListItem(activeSection.id, idx, 'comment', e.target.value)}
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
                          className="rounded-lg border border-dashed border-border text-[11px] w-full py-2.5 h-auto"
                          onClick={() => addListItem(activeSection.id, { name: 'Cliente Satisfecho', role: 'Comerciante', comment: 'Excelente servicio.', rating: 5, avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' })}
                        >
                          <Plus className="mr-1 h-3 w-3" /> Agregar Testimonio
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Formulario Específico de CONVERSION_FORM */}
                  {activeSection.type === 'CONVERSION_FORM' && (
                    <div className="space-y-3">
                      <div className="grid gap-1.5">
                        <Label htmlFor="conv-title" className="text-xs">Título del Formulario</Label>
                        <Input
                          id="conv-title"
                          value={activeSection.content.title || ''}
                          onChange={(e) => handleContentChange(activeSection.id, 'title', e.target.value)}
                        />
                      </div>
                      <div className="grid gap-1.5">
                        <Label htmlFor="conv-subtitle" className="text-xs">Subtítulo / Instrucciones</Label>
                        <Textarea
                          id="conv-subtitle"
                          rows={2}
                          value={activeSection.content.subtitle || ''}
                          onChange={(e) => handleContentChange(activeSection.id, 'subtitle', e.target.value)}
                        />
                      </div>
                      <div className="grid gap-1.5">
                        <Label htmlFor="conv-cta" className="text-xs">Texto del Botón CTA</Label>
                        <Input
                          id="conv-cta"
                          value={activeSection.content.ctaText || ''}
                          onChange={(e) => handleContentChange(activeSection.id, 'ctaText', e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {/* Formulario Específico de RISK_REVERSAL */}
                  {activeSection.type === 'RISK_REVERSAL' && (
                    <div className="space-y-3">
                      <div className="grid gap-1.5">
                        <Label htmlFor="risk-title" className="text-xs">Título de Garantía</Label>
                        <Input
                          id="risk-title"
                          value={activeSection.content.title || ''}
                          onChange={(e) => handleContentChange(activeSection.id, 'title', e.target.value)}
                        />
                      </div>
                      <div className="grid gap-1.5">
                        <Label htmlFor="risk-desc" className="text-xs">Descripción del Respaldo</Label>
                        <Textarea
                          id="risk-desc"
                          rows={3}
                          value={activeSection.content.description || ''}
                          onChange={(e) => handleContentChange(activeSection.id, 'description', e.target.value)}
                        />
                      </div>
                      <div className="grid gap-1.5">
                        <Label htmlFor="risk-days" className="text-xs">Días de Garantía</Label>
                        <Input
                          id="risk-days"
                          type="number"
                          value={activeSection.content.days || 30}
                          onChange={(e) => handleContentChange(activeSection.id, 'days', parseInt(e.target.value) || 30)}
                        />
                      </div>
                    </div>
                  )}

                  {/* Formulario Específico de FAQ_ACCORDION */}
                  {activeSection.type === 'FAQ_ACCORDION' && (
                    <div className="space-y-4">
                      <div className="grid gap-1.5">
                        <Label htmlFor="faq-title" className="text-xs">Título</Label>
                        <Input
                          id="faq-title"
                          value={activeSection.content.title || ''}
                          onChange={(e) => handleContentChange(activeSection.id, 'title', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                          Preguntas y Respuestas
                        </Label>
                        <div className="grid gap-2">
                          {(activeSection.content.items || []).map((item: any, idx: number) => (
                            <Card key={idx} className="p-3 border border-border bg-background rounded-lg relative group/item">
                              <button
                                type="button"
                                onClick={() => removeListItem(activeSection.id, idx)}
                                className="absolute right-2 top-2 h-5 w-5 flex items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive opacity-0 group-hover/item:opacity-100 transition-all duration-200"
                              >
                                <X className="h-3 w-3" />
                              </button>
                              <div className="grid gap-2">
                                <div className="grid gap-0.5">
                                  <Label className="text-[10px] text-muted-foreground">Pregunta</Label>
                                  <Input
                                    value={item.question || ''}
                                    onChange={(e) => updateListItem(activeSection.id, idx, 'question', e.target.value)}
                                    className="h-7 text-xs"
                                  />
                                </div>
                                <div className="grid gap-0.5">
                                  <Label className="text-[10px] text-muted-foreground">Respuesta</Label>
                                  <Textarea
                                    rows={2}
                                    value={item.answer || ''}
                                    onChange={(e) => updateListItem(activeSection.id, idx, 'answer', e.target.value)}
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
                          className="rounded-lg border border-dashed border-border text-[11px] w-full py-2.5 h-auto"
                          onClick={() => addListItem(activeSection.id, { question: 'Nueva Pregunta', answer: 'Detalle de la respuesta.' })}
                        >
                          <Plus className="mr-1 h-3 w-3" /> Agregar Pregunta
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Formulario Específico de FOOTER_SECTION */}
                  {activeSection.type === 'FOOTER_SECTION' && (
                    <div className="space-y-3">
                      <div className="grid gap-1.5">
                        <Label htmlFor="foot-copy" className="text-xs">Texto de Copyright</Label>
                        <Input
                          id="foot-copy"
                          value={activeSection.content.copyright || ''}
                          onChange={(e) => handleContentChange(activeSection.id, 'copyright', e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {/* Fallback Legacy: PRODUCTS_LIST */}
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

      {confirmModal && (
        <Dialog open={confirmModal.open} onOpenChange={(val) => !val && setConfirmModal(null)}>
          <DialogContent className="sm:max-w-md bg-card border border-border p-5 rounded-xl shadow-lg">
            <DialogHeader>
              <DialogTitle className="font-serif text-base font-bold text-foreground">
                {confirmModal.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-2">
                {confirmModal.message}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4 flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmModal(null)}
                className="rounded-lg text-xs"
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  confirmModal.onConfirm()
                  setConfirmModal(null)
                }}
                className="rounded-lg text-xs"
              >
                Confirmar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {alertModal && (
        <Dialog open={alertModal.open} onOpenChange={(val) => !val && setAlertModal(null)}>
          <DialogContent className="sm:max-w-md bg-card border border-border p-5 rounded-xl shadow-lg">
            <DialogHeader>
              <DialogTitle className="font-serif text-base font-bold text-foreground">
                {alertModal.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-2">
                {alertModal.message}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4 flex justify-end">
              <Button
                size="sm"
                onClick={() => setAlertModal(null)}
                className="rounded-lg text-xs"
              >
                Aceptar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
