'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Search, Upload, Check, ImageIcon, Image as ImageIconLucide } from 'lucide-react'
import { cn } from '@/lib/utils'
import { uploadService } from '@/lib/api/services/upload'
import type { BusinessProfile } from '@/lib/bercario-data'

type MediaManagerProps = {
  open: boolean
  onClose: () => void
  onSelect: (url: string) => void
  profile: BusinessProfile | null
}

// Biblioteca de stock curada con etiquetas de búsqueda en español e inglés
const STOCK_PHOTOS = [
  {
    url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80',
    category: 'Moda',
    tags: ['moda', 'ropa', 'bolsas', 'compras', 'tienda', 'fashion', 'clothing', 'shopping'],
  },
  {
    url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80',
    category: 'Moda',
    tags: ['moda', 'ropa', 'vestidos', 'boutique', 'fashion', 'clothing', 'hanger'],
  },
  {
    url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&auto=format&fit=crop&q=80',
    category: 'Moda',
    tags: ['moda', 'tienda', 'vitrina', 'boutique', 'shop', 'fashion', 'interior'],
  },
  {
    url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    category: 'Calzado',
    tags: ['calzado', 'zapatos', 'tenis', 'rojo', 'sneakers', 'shoes', 'running'],
  },
  {
    url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80',
    category: 'Calzado',
    tags: ['calzado', 'zapatos', 'cuero', 'cafe', 'boots', 'shoes', 'leather'],
  },
  {
    url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80',
    category: 'Calzado',
    tags: ['calzado', 'zapatos', 'colores', 'tenis', 'sneakers', 'shoes', 'style'],
  },
  {
    url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=80',
    category: 'Servicios',
    tags: ['servicios', 'negocios', 'oficina', 'asesoria', 'reunion', 'consulting', 'business', 'office'],
  },
  {
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80',
    category: 'Servicios',
    tags: ['servicios', 'negocios', 'edificio', 'corporativo', 'business', 'corporate', 'office'],
  },
  {
    url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80',
    category: 'Servicios',
    tags: ['servicios', 'negocios', 'asesoria', 'educacion', 'consulting', 'study', 'work'],
  },
  {
    url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&auto=format&fit=crop&q=80',
    category: 'Tecnología',
    tags: ['tecnologia', 'computador', 'programacion', 'desarrollo', 'tech', 'coding', 'developer'],
  },
  {
    url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=80',
    category: 'Tecnología',
    tags: ['tecnologia', 'computador', 'escritorio', 'laptop', 'workplace', 'developer'],
  },
  {
    url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80',
    category: 'Tecnología',
    tags: ['tecnologia', 'seguridad', 'servidores', 'redes', 'tech', 'server', 'security'],
  },
  {
    url: 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=600&auto=format&fit=crop&q=80',
    category: 'Comercio',
    tags: ['comercio', 'tienda', 'cafeteria', 'barista', 'coffee', 'shop', 'retail'],
  },
  {
    url: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=600&auto=format&fit=crop&q=80',
    category: 'Comercio',
    tags: ['comercio', 'tienda', 'supermercado', 'alimentos', 'groceries', 'shop', 'retail'],
  },
]

export function MediaManagerDialog({
  open,
  onClose,
  onSelect,
  profile,
}: MediaManagerProps) {
  const [activeTab, setActiveTab] = useState('mis-imagenes')
  const [selectedUrl, setSelectedUrl] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [uploading, setUploading] = useState(false)
  const [myImages, setMyImages] = useState<string[]>([])

  // Recopilar imágenes asociadas al perfil del usuario
  useEffect(() => {
    if (!profile) return
    const urls: string[] = []
    
    if (profile.logo) urls.push(profile.logo)
    if (profile.banner) urls.push(profile.banner)
    
    if (Array.isArray(profile.gallery)) {
      profile.gallery.forEach((url) => {
        if (url && typeof url === 'string') urls.push(url)
      })
    }
    
    if (Array.isArray(profile.products)) {
      profile.products.forEach((p) => {
        if (p.image) urls.push(p.image)
      })
    }

    // Filtrar imágenes únicas, sin marcadores de posición
    const uniqueUrls = Array.from(new Set(urls)).filter(
      (url) => url && !url.includes('company-banner') && !url.includes('company-logo') && !url.includes('placeholder')
    )
    setMyImages(uniqueUrls)
  }, [profile, open])

  // Filtrar stock de fotos según búsqueda y categoría
  const filteredStock = STOCK_PHOTOS.filter((photo) => {
    if (!searchQuery) return true
    const term = searchQuery.toLowerCase()
    return (
      photo.category.toLowerCase().includes(term) ||
      photo.tags.some((tag) => tag.includes(term))
    )
  })

  // Manejar subida de archivo
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setUploading(true)
      const res = await uploadService.uploadImage(file)
      setSelectedUrl(res.url)
      
      // Añadir la nueva imagen a las imágenes locales de inmediato
      setMyImages((prev) => [res.url, ...prev])
      setActiveTab('mis-imagenes')
    } catch (err) {
      console.error('Error al subir archivo:', err)
      alert('Hubo un error al subir el archivo.')
    } finally {
      setUploading(false)
    }
  }

  function handleConfirm() {
    if (selectedUrl) {
      onSelect(selectedUrl)
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-2xl bg-card border border-border shadow-lg p-5">
        <DialogHeader className="mb-2">
          <DialogTitle className="font-serif text-lg font-bold flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-primary" />
            Selector de Multimedia Centralizado
          </DialogTitle>
          <DialogDescription className="text-xs">
            Selecciona fotos desde tu catálogo, explora la biblioteca de stock o sube nuevos archivos a la nube.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-4">
            <TabsTrigger value="mis-imagenes" className="text-xs">
              Mis Imágenes ({myImages.length})
            </TabsTrigger>
            <TabsTrigger value="stock" className="text-xs">
              Stock de Fotos
            </TabsTrigger>
            <TabsTrigger value="subir" className="text-xs">
              Subir Archivo
            </TabsTrigger>
          </TabsList>

          {/* CONTENIDO: MIS IMÁGENES */}
          <TabsContent value="mis-imagenes" className="space-y-4">
            {myImages.length > 0 ? (
              <div className="grid grid-cols-3 gap-3 max-h-[300px] overflow-y-auto pr-1">
                {myImages.map((url) => (
                  <div
                    key={url}
                    className={cn(
                      "relative aspect-video rounded-lg overflow-hidden border border-border cursor-pointer transition-all hover:scale-[1.02]",
                      selectedUrl === url ? "ring-2 ring-primary border-transparent" : "hover:border-primary/40"
                    )}
                    onClick={() => setSelectedUrl(url)}
                  >
                    <img src={url} alt="Cargada" className="h-full w-full object-cover" />
                    {selectedUrl === url && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <span className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center shadow">
                          <Check className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground border border-dashed border-border rounded-xl">
                <ImageIconLucide className="h-8 w-8 mb-2 opacity-40 text-primary" />
                <p className="text-xs">No hemos detectado imágenes en tu catálogo ni galería.</p>
                <p className="text-[10px] text-muted-foreground mt-1">Sube archivos o busca imágenes en la pestaña de Stock.</p>
              </div>
            )}
          </TabsContent>

          {/* CONTENIDO: STOCK DE FOTOS */}
          <TabsContent value="stock" className="space-y-4">
            <div className="flex items-center gap-2 bg-muted/40 rounded-lg border border-border px-3 py-1.5">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar por tag (ej. moda, calzado, oficina, café)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-7 text-xs border-0 bg-transparent focus-visible:ring-0 p-0"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-[10px] hover:underline text-muted-foreground"
                >
                  Limpiar
                </button>
              )}
            </div>

            {filteredStock.length > 0 ? (
              <div className="grid grid-cols-3 gap-3 max-h-[250px] overflow-y-auto pr-1">
                {filteredStock.map((photo, i) => (
                  <div
                    key={i}
                    className={cn(
                      "relative aspect-video rounded-lg overflow-hidden border border-border cursor-pointer transition-all hover:scale-[1.02]",
                      selectedUrl === photo.url ? "ring-2 ring-primary border-transparent" : "hover:border-primary/40"
                    )}
                    onClick={() => setSelectedUrl(photo.url)}
                  >
                    <img src={photo.url} alt="Stock" className="h-full w-full object-cover" />
                    <span className="absolute bottom-1 right-1 text-[8px] bg-black/60 text-white px-1.5 py-0.5 rounded backdrop-blur">
                      {photo.category}
                    </span>
                    {selectedUrl === photo.url && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <span className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center shadow">
                          <Check className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground border border-dashed border-border rounded-xl">
                <Search className="h-8 w-8 mb-2 opacity-40 text-primary" />
                <p className="text-xs">No se encontraron imágenes de stock para tu búsqueda.</p>
              </div>
            )}
          </TabsContent>

          {/* CONTENIDO: SUBIR ARCHIVO */}
          <TabsContent value="subir" className="space-y-4">
            <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-border hover:border-primary/50 transition-all rounded-xl relative bg-muted/10">
              {uploading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-xs text-muted-foreground">Subiendo imagen al servidor...</p>
                </div>
              ) : (
                <label className="flex flex-col items-center cursor-pointer p-4 w-full">
                  <Upload className="h-8 w-8 text-primary mb-2 animate-bounce" />
                  <span className="text-xs font-semibold text-foreground">Sube una nueva foto</span>
                  <span className="text-[10px] text-muted-foreground mt-0.5">Formatos soportados: JPG, PNG, WEBP. Máx 5MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                </label>
              )}
            </div>
            {selectedUrl && activeTab === 'subir' && (
              <div className="flex items-center gap-3 bg-muted/40 p-2.5 rounded-lg border border-border">
                <div className="h-10 w-16 rounded overflow-hidden shrink-0 border border-border">
                  <img src={selectedUrl} alt="Previsualizar subida" className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 truncate">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Imagen Subida</p>
                  <p className="text-xs text-foreground truncate">{selectedUrl}</p>
                </div>
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4 flex items-center justify-between border-t border-border/40 pt-3">
          <div className="text-left max-w-[320px] truncate hidden sm:block">
            {selectedUrl && (
              <span className="text-[10px] text-muted-foreground">
                Seleccionado: <span className="font-mono">{selectedUrl}</span>
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onClose} className="rounded-lg">
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={handleConfirm}
              disabled={!selectedUrl}
              className="rounded-lg shadow-sm"
            >
              Confirmar Selección
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
