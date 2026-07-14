'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  EyeOff, 
  Save, 
  ChevronRight, 
  Smartphone, 
  Laptop,
  Sparkles,
  Layout,
  RefreshCw,
  Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { landingConfigService, type LandingConfigItem } from '@/lib/api/services/landing-config'
import { animateSelector } from '../../hooks/use-anime'

export function LandingBuilderView() {
  const [config, setConfig] = useState<LandingConfigItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null)
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop')

  useEffect(() => {
    fetchConfig()
  }, [])

  async function fetchConfig() {
    try {
      setLoading(true)
      const data = await landingConfigService.getLandingConfig()
      // Ordenar por el campo order al cargar
      const sorted = [...data].sort((a, b) => a.order - b.order)
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
      const data = await landingConfigService.updateLandingConfig(config)
      setConfig(data)
      alert('Configuración de la landing guardada con éxito.')
    } catch (err: any) {
      console.error('Error al guardar la landing config:', err)
      alert(err.message || 'Error al guardar los cambios.')
    } finally {
      setSaving(false)
    }
  }

  // Animación y lógica para reordenar
  async function moveSection(index: number, direction: 'up' | 'down') {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= config.length) return

    const sectionA = config[index]
    const sectionB = config[targetIndex]

    // IDs de los elementos DOM a animar
    const idA = `#builder-card-${sectionA.id}`
    const idB = `#builder-card-${sectionB.id}`
    const previewIdA = `#preview-section-${sectionA.id}`
    const previewIdB = `#preview-section-${sectionB.id}`

    // Distancia de traslación
    const travelDistance = direction === 'up' ? -76 : 76 // Altura aproximada de la tarjeta
    const previewTravelDistance = direction === 'up' ? -180 : 180

    // Ejecutar animaciones de deslizamiento en paralelo
    await Promise.all([
      animateSelector(idA, {
        translateY: [0, travelDistance],
        duration: 300,
        easing: 'easeInOutQuad',
      }),
      animateSelector(idB, {
        translateY: [0, -travelDistance],
        duration: 300,
        easing: 'easeInOutQuad',
      }),
      animateSelector(previewIdA, {
        translateY: [0, previewTravelDistance],
        duration: 350,
        easing: 'easeInOutQuad',
      }),
      animateSelector(previewIdB, {
        translateY: [0, -previewTravelDistance],
        duration: 350,
        easing: 'easeInOutQuad',
      })
    ])

    // Resetear posiciones en el DOM
    animateSelector(`${idA}, ${idB}, ${previewIdA}, ${previewIdB}`, {
      translateY: 0,
      duration: 0
    })

    // Actualizar el estado
    const newConfig = [...config]
    // Intercambiar orden en el array
    newConfig[index] = { ...sectionB, order: sectionA.order }
    newConfig[targetIndex] = { ...sectionA, order: sectionB.order }

    // Ordenar y setear
    setConfig(newConfig.sort((a, b) => a.order - b.order))
  }

  // Mostrar/Ocultar sección con animación de desvanecimiento
  async function toggleVisibility(id: string, currentVisible: boolean) {
    const targetId = `#preview-section-${id}`

    if (currentVisible) {
      // Animación de ocultado: escala hacia abajo y opacidad cero
      await animateSelector(targetId, {
        opacity: [1, 0],
        scale: [1, 0.94],
        duration: 250,
        easing: 'easeInOutQuad',
      })
    }

    // Actualizar el estado
    setConfig(prev =>
      prev.map(item =>
        item.id === id ? { ...item, visible: !item.visible } : item
      )
    )

    if (!currentVisible) {
      // Esperar a que renderice y aplicar entrada suave
      setTimeout(() => {
        animateSelector(targetId, {
          opacity: [0, 1],
          scale: [0.96, 1],
          duration: 300,
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
                activeSectionId === item.id ? "border-primary/40 ring-1 ring-primary/20" : "hover:border-border-hover"
              )}
              onClick={() => setActiveSectionId(item.id)}
            >
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-mono w-4">
                  {idx + 1}
                </span>
                <span className="text-sm font-medium text-foreground capitalize">
                  {item.id === 'about' ? 'Quiénes somos' : item.id === 'products' ? 'Catálogo' : item.id}
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
                  Editando: {activeSection.id === 'about' ? 'Quiénes somos' : activeSection.id === 'products' ? 'Catálogo' : activeSection.id}
                </Badge>
              </div>

              {/* Formulario Dinámico según Tipo */}
              {activeSection.type === 'banner' && (
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
                      value={activeSection.content.tagline || ''}
                      onChange={(e) => handleContentChange(activeSection.id, 'tagline', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-1.5">
                      <Label htmlFor="b-grad-from">Color de Inicio</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          id="b-grad-from"
                          className="h-9 w-9 p-0 border border-border rounded cursor-pointer"
                          value={activeSection.content.bgGradientFrom || '#ffffff'}
                          onChange={(e) => handleContentChange(activeSection.id, 'bgGradientFrom', e.target.value)}
                        />
                        <Input
                          className="font-mono text-xs h-9"
                          value={activeSection.content.bgGradientFrom || '#ffffff'}
                          onChange={(e) => handleContentChange(activeSection.id, 'bgGradientFrom', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="b-grad-to">Color de Fin</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          id="b-grad-to"
                          className="h-9 w-9 p-0 border border-border rounded cursor-pointer"
                          value={activeSection.content.bgGradientTo || '#f4f4f5'}
                          onChange={(e) => handleContentChange(activeSection.id, 'bgGradientTo', e.target.value)}
                        />
                        <Input
                          className="font-mono text-xs h-9"
                          value={activeSection.content.bgGradientTo || '#f4f4f5'}
                          onChange={(e) => handleContentChange(activeSection.id, 'bgGradientTo', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="b-text-color">Color de Texto</Label>
                    <div className="flex gap-2 w-1/2">
                      <Input
                        type="color"
                        id="b-text-color"
                        className="h-9 w-9 p-0 border border-border rounded cursor-pointer"
                        value={activeSection.content.textColor || '#09090b'}
                        onChange={(e) => handleContentChange(activeSection.id, 'textColor', e.target.value)}
                      />
                      <Input
                        className="font-mono text-xs h-9"
                        value={activeSection.content.textColor || '#09090b'}
                        onChange={(e) => handleContentChange(activeSection.id, 'textColor', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeSection.type === 'about' && (
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
                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-1.5">
                      <Label htmlFor="a-grad-from">Color de Inicio</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          id="a-grad-from"
                          className="h-9 w-9 p-0 border border-border rounded cursor-pointer"
                          value={activeSection.content.bgGradientFrom || '#f4f4f5'}
                          onChange={(e) => handleContentChange(activeSection.id, 'bgGradientFrom', e.target.value)}
                        />
                        <Input
                          className="font-mono text-xs h-9"
                          value={activeSection.content.bgGradientFrom || '#f4f4f5'}
                          onChange={(e) => handleContentChange(activeSection.id, 'bgGradientFrom', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="a-grad-to">Color de Fin</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          id="a-grad-to"
                          className="h-9 w-9 p-0 border border-border rounded cursor-pointer"
                          value={activeSection.content.bgGradientTo || '#ffffff'}
                          onChange={(e) => handleContentChange(activeSection.id, 'bgGradientTo', e.target.value)}
                        />
                        <Input
                          className="font-mono text-xs h-9"
                          value={activeSection.content.bgGradientTo || '#ffffff'}
                          onChange={(e) => handleContentChange(activeSection.id, 'bgGradientTo', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection.type === 'products' && (
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
                    <Label htmlFor="p-btn">Texto del Botón de Compra</Label>
                    <Input
                      id="p-btn"
                      value={activeSection.content.buttonText || ''}
                      onChange={(e) => handleContentChange(activeSection.id, 'buttonText', e.target.value)}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/10">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">Mostrar Precios</Label>
                      <span className="text-xs text-muted-foreground block">
                        Permite a tus compradores ver el precio por mayor.
                      </span>
                    </div>
                    <Switch
                      checked={activeSection.content.showPrice ?? true}
                      onCheckedChange={(val) => handleContentChange(activeSection.id, 'showPrice', val)}
                    />
                  </div>
                </div>
              )}

              {activeSection.type === 'contact' && (
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
                    <Label htmlFor="c-phone">Teléfono de WhatsApp</Label>
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
              "bg-background shadow-md border border-border transition-all duration-300 overflow-y-auto max-h-[85vh]",
              previewDevice === 'desktop' ? "w-full max-w-4xl" : "w-[360px] h-[640px] rounded-3xl border-8 border-zinc-800"
            )}
          >
            {/* Contenido Dinámico de la Landing Preview */}
            <div className="w-full h-full min-h-[450px]">
              {config.map((section) => {
                if (!section.visible) return null;

                return (
                  <div
                    key={section.id}
                    id={`preview-section-${section.id}`}
                    className="relative border-b border-dashed border-border/40 last:border-0"
                  >
                    {/* Indicador de edición */}
                    {activeSectionId === section.id && (
                      <div className="absolute left-2 top-2 z-10">
                        <Badge className="bg-primary/95 text-white text-[9px] shadow-sm backdrop-blur font-mono">
                          Editando
                        </Badge>
                      </div>
                    )}

                    {/* RENDERIZADO RECURSIVO DE CADA SECCIÓN */}
                    {section.type === 'banner' && (
                      <div 
                        className="py-12 px-6 text-center space-y-3 transition-colors duration-300"
                        style={{
                          background: `linear-gradient(135deg, ${section.content.bgGradientFrom || '#ffffff'}, ${section.content.bgGradientTo || '#f4f4f5'})`,
                          color: section.content.textColor || '#09090b'
                        }}
                      >
                        <Badge variant="outline" className="mb-1 rounded-full border-primary/20 bg-primary/5 text-primary text-[10px] uppercase font-bold py-0.5 px-2">
                          Mayorista Destacado
                        </Badge>
                        <h1 className="font-serif text-2xl font-bold tracking-tight md:text-3xl max-w-lg mx-auto leading-tight">
                          {section.content.title || 'Título Principal'}
                        </h1>
                        <p className="text-xs opacity-80 max-w-md mx-auto leading-relaxed">
                          {section.content.tagline || 'Lema o descripción corta del negocio.'}
                        </p>
                      </div>
                    )}

                    {section.type === 'about' && (
                      <div 
                        className="py-10 px-6 space-y-3 transition-colors duration-300"
                        style={{
                          background: `linear-gradient(135deg, ${section.content.bgGradientFrom || '#f4f4f5'}, ${section.content.bgGradientTo || '#ffffff'})`
                        }}
                      >
                        <div className="max-w-lg mx-auto text-center space-y-2">
                          <h2 className="font-serif text-lg font-bold text-foreground">
                            {section.content.title || 'Quiénes somos'}
                          </h2>
                          <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line text-justify">
                            {section.content.description || 'Detalles sobre la trayectoria, misión e historia del negocio regional.'}
                          </p>
                        </div>
                      </div>
                    )}

                    {section.type === 'products' && (
                      <div className="py-10 px-6 bg-card space-y-4">
                        <div className="max-w-lg mx-auto text-center space-y-1">
                          <h2 className="font-serif text-lg font-bold text-foreground">
                            {section.content.title || 'Catálogo de productos'}
                          </h2>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">
                            Colección Mayorista
                          </p>
                        </div>
                        {/* Mock de grilla de catálogo */}
                        <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                          {[1, 2].map((i) => (
                            <div key={i} className="border border-border rounded-lg overflow-hidden bg-muted/10 p-1.5 space-y-1.5 shadow-sm">
                              <div className="aspect-square bg-muted rounded-md flex items-center justify-center text-[10px] text-muted-foreground font-mono">
                                [Foto Producto]
                              </div>
                              <div className="px-1 text-left">
                                <h4 className="text-xs font-semibold truncate">Calzado Demo #{i}</h4>
                                {section.content.showPrice !== false && (
                                  <span className="text-[11px] font-bold text-primary font-mono">$89.900</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="text-center mt-3">
                          <Button size="sm" className="rounded-full h-8 text-xs px-5 shadow-sm bg-primary hover:bg-primary/95 text-white">
                            {section.content.buttonText || 'Hacer Pedido'}
                          </Button>
                        </div>
                      </div>
                    )}

                    {section.type === 'contact' && (
                      <div className="py-10 px-6 bg-muted/30 text-center space-y-4">
                        <h2 className="font-serif text-lg font-bold text-foreground">
                          {section.content.title || 'Contacto'}
                        </h2>
                        <div className="max-w-md mx-auto grid gap-2.5 text-xs text-muted-foreground">
                          {section.content.phone && (
                            <div className="flex items-center justify-center gap-2">
                              <span className="font-semibold text-foreground">WhatsApp:</span> {section.content.phone}
                            </div>
                          )}
                          {section.content.email && (
                            <div className="flex items-center justify-center gap-2">
                              <span className="font-semibold text-foreground">Correo:</span> {section.content.email}
                            </div>
                          )}
                          {section.content.address && (
                            <div className="flex items-center justify-center gap-2">
                              <span className="font-semibold text-foreground">Dirección:</span> {section.content.address}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
