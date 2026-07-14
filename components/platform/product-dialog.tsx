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

  useEffect(() => {
    setDraft(product ?? { ...emptyProduct, id: `p-${Date.now()}` })
  }, [product, open])

  function toggleTag(tag: string) {
    setDraft((d) => ({
      ...d,
      tags: d.tags.includes(tag)
        ? d.tags.filter((t) => t !== tag)
        : [...d.tags, tag],
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif">
            {product ? 'Editar producto' : 'Agregar producto'}
          </DialogTitle>
          <DialogDescription>
            Completa la información que verán tus clientes en el catálogo.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-1.5">
            <Label>Imagen</Label>
            <div className="flex flex-wrap gap-2">
              {imageChoices.map((img) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setDraft((d) => ({ ...d, image: img }))}
                  className={cn(
                    'h-16 w-16 overflow-hidden rounded-lg border-2 bg-secondary transition-colors',
                    draft.image === img
                      ? 'border-primary'
                      : 'border-transparent hover:border-border',
                  )}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="p-title">Título</Label>
            <Input
              id="p-title"
              value={draft.title}
              onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
              placeholder="Ej. Tenis urbanos"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="p-price">Precio</Label>
            <Input
              id="p-price"
              value={draft.price}
              onChange={(e) => setDraft((d) => ({ ...d, price: e.target.value }))}
              placeholder="$0.000"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="p-desc">Descripción corta</Label>
            <Textarea
              id="p-desc"
              rows={2}
              value={draft.description}
              onChange={(e) =>
                setDraft((d) => ({ ...d, description: e.target.value }))
              }
              placeholder="Detalles del producto..."
            />
          </div>

          <div className="grid gap-1.5">
            <Label>Etiquetas</Label>
            <div className="flex flex-wrap gap-1.5">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={cn(
                    'rounded-full border px-2.5 py-1 text-xs font-medium transition-colors',
                    draft.tags.includes(tag)
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-secondary text-muted-foreground hover:text-foreground',
                  )}
                >
                  {tag}
                </button>
              ))}
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
      </DialogContent>
    </Dialog>
  )
}
