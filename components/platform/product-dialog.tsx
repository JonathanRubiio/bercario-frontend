'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { availableTags, type Product } from '@/lib/bercario-data'
import { uploadService } from '../../lib/api/services/upload'
import { animateSelector } from '../../hooks/use-anime'
import { X } from 'lucide-react'

const emptyProduct: Product = {
  id: '',
  title: '',
  price: '',
  description: '',
  image: '/images/product-sneakers.png',
  tags: [],
}

const imageChoices = [
  '/images/product-sneakers.png',
  '/images/product-handbag.png',
  '/images/product-boots.png',
  '/images/product-jacket.png',
  '/images/product-watch.png',
]

export function ProductDialog({
  open,
  onOpenChange,
  product,
  onSave,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  product: Product | null
  onSave: (p: Product) => void
}) {
  const [draft, setDraft] = useState<Product>(emptyProduct)
  const [uploadingProductImage, setUploadingProductImage] = useState(false)

  async function handleProductImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setUploadingProductImage(true)
      const res = await uploadService.uploadImage(file, 'catalog')
      setDraft((d) => ({ ...d, image: res.url }))
    } catch (err: any) {
      console.error('Error al subir imagen de producto:', err)
      const msg = err.message || 'Error al subir la imagen. Inténtalo de nuevo.'
      alert(msg)
    } finally {
      setUploadingProductImage(false)
    }
  }

  useEffect(() => {
    const defaultProduct = product ?? { ...emptyProduct, id: `p-${Date.now()}` }
    setDraft({
      ...defaultProduct,
      tags: defaultProduct.tags || [],
    })
  }, [product, open])

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        animateSelector('#product-dialog-inner', {
          opacity: [0, 1],
          scale: [0.95, 1],
          translateY: [12, 0],
          duration: 450,
          easing: 'easeOutBack',
        })
        animateSelector('.animate-form-field', {
          opacity: [0, 1],
          translateY: [15, 0],
          delay: (_, i) => i * 65,
          duration: 500,
          easing: 'easeOutQuad',
        })
      }, 50)
    }
  }, [open])

  const [tagInput, setTagInput] = useState('')

  const addTag = (text: string) => {
    const clean = text.trim()
    if (!clean) return

    // Formatear tag para que empiece con '#' si no lo tiene
    const tag = clean.startsWith('#') ? clean : `#${clean}`

    setDraft((d) => {
      const currentTags = d.tags || []
      if (currentTags.includes(tag)) return d

      // Lanzar la animación elástica después de que React agregue el elemento al DOM
      setTimeout(() => {
        animateSelector('.animate-tag-birth:last-child', {
          scale: [0.3, 1],
          duration: 250,
          easing: 'easeOutBack',
        })
      }, 30)

      return {
        ...d,
        tags: [...currentTags, tag],
      }
    })

    setTagInput('')
  }

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag(tagInput)
    } else if (e.key === ',') {
      e.preventDefault()
      addTag(tagInput)
    }
  }

  const removeTag = (tag: string) => {
    setDraft((d) => ({
      ...d,
      tags: (d.tags || []).filter((t) => t !== tag),
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <div id="product-dialog-inner" className="opacity-0 space-y-4">
          <DialogHeader>
            <DialogTitle className="font-serif">
              {product ? 'Editar producto' : 'Agregar producto'}
            </DialogTitle>
            <DialogDescription>
              Completa la información que verán tus clientes en el catálogo.
            </DialogDescription>
          </DialogHeader>

        <div className="grid gap-5 py-4">
          {/* Campo 1: Imagen (Ancho completo) */}
          <div className="grid gap-2 animate-form-field opacity-0">
            <Label className="text-sm font-medium text-foreground">Imagen del producto</Label>
            <div className="flex flex-wrap gap-2.5">
              {imageChoices.map((img) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setDraft((d) => ({ ...d, image: img }))}
                  className={cn(
                    'h-16 w-16 overflow-hidden rounded-xl border-2 bg-secondary transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm',
                    draft.image === img
                      ? 'border-primary ring-2 ring-primary/20'
                      : 'border-transparent hover:border-border',
                  )}
                >
                  <img
                    src={img}
                    alt=""
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg'
                    }}
                  />
                </button>
              ))}

              {/* Render dynamic choice if a custom image was uploaded */}
              {draft.image && !imageChoices.includes(draft.image) && (
                <button
                  type="button"
                  className="h-16 w-16 overflow-hidden rounded-xl border-2 border-primary ring-2 ring-primary/20 bg-secondary shadow-sm"
                >
                  <img
                    src={draft.image}
                    alt="Imagen de producto subida"
                    className="h-full w-full object-cover"
                  />
                </button>
              )}

              {/* Upload button */}
              <label className={cn(
                'h-16 w-16 flex flex-col items-center justify-center rounded-xl border-2 border-dashed bg-secondary transition-all duration-200 cursor-pointer hover:border-primary/40 hover:bg-secondary/70 hover:scale-105 active:scale-95 text-muted-foreground shadow-sm',
                uploadingProductImage && 'opacity-60 cursor-not-allowed'
              )}>
                <span className="text-[10px] font-medium text-center leading-tight">
                  {uploadingProductImage ? 'Subiendo...' : 'Subir imagen'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProductImageUpload}
                  disabled={uploadingProductImage}
                />
              </label>
            </div>
          </div>

          {/* Campo 2: Fila simétrica de Título y Precio */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-form-field opacity-0">
            <div className="grid gap-1.5">
              <Label htmlFor="p-title" className="text-sm font-medium text-foreground">Título</Label>
              <Input
                id="p-title"
                value={draft.title}
                onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                placeholder="Ej. Tenis urbanos"
                className="transition-all duration-200 focus-visible:ring-primary focus-visible:border-primary hover:border-primary/50 rounded-xl"
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="p-price" className="text-sm font-medium text-foreground">Precio</Label>
              <Input
                id="p-price"
                value={draft.price}
                onChange={(e) => setDraft((d) => ({ ...d, price: e.target.value }))}
                placeholder="$0.000"
                className="transition-all duration-200 focus-visible:ring-primary focus-visible:border-primary hover:border-primary/50 rounded-xl"
              />
            </div>
          </div>

          {/* Campo 3: Descripción (Ancho completo) */}
          <div className="grid gap-1.5 animate-form-field opacity-0">
            <Label htmlFor="p-desc" className="text-sm font-medium text-foreground">Descripción corta</Label>
            <Textarea
              id="p-desc"
              rows={3}
              value={draft.description}
              onChange={(e) =>
                setDraft((d) => ({ ...d, description: e.target.value }))
              }
              placeholder="Detalles del producto..."
              className="transition-all duration-200 focus-visible:ring-primary focus-visible:border-primary hover:border-primary/50 rounded-xl resize-none"
            />
          </div>

          {/* Campo 4: Hashtags Dinámicos (Ancho completo) */}
          <div className="grid gap-2 animate-form-field opacity-0">
            <Label className="text-sm font-medium text-foreground">Hashtags / Etiquetas</Label>
            
            {/* Listado flexwrap de tags con X */}
            <div className="flex flex-wrap gap-2 min-h-[42px] p-2 rounded-xl border border-dashed border-border bg-secondary/20">
              {(draft.tags || []).length === 0 ? (
                <span className="text-xs text-muted-foreground self-center px-1">Sin hashtags. Escribe uno abajo.</span>
              ) : (
                (draft.tags || []).map((tag) => (
                  <span
                    key={tag}
                    className="animate-tag-birth flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground transition-all duration-200 shadow-sm border border-primary"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="rounded-full p-0.5 hover:bg-primary-foreground/20 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                      aria-label={`Eliminar etiqueta ${tag}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))
              )}
            </div>

            {/* Input de Tags Abierto */}
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Escribe una etiqueta y presiona Enter o coma..."
                className="transition-all duration-200 focus-visible:ring-primary focus-visible:border-primary hover:border-primary/50 rounded-xl"
              />
              <Button
                type="button"
                variant="secondary"
                className="rounded-xl px-4"
                onClick={() => addTag(tagInput)}
              >
                Agregar
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            className="rounded-full bg-transparent"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            className="rounded-full"
            onClick={() => {
              if (!draft.title.trim()) return
              onSave(draft)
              onOpenChange(false)
            }}
          >
            Guardar producto
          </Button>
        </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
