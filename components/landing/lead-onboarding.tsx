'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ImagePlus, Plus, CheckCircle2, Sparkles } from 'lucide-react'

export type LeadData = {
  fullName: string
  businessName: string
  phone: string
  category: string
}

type InitialProduct = { name: string; price: string }

export function LeadOnboarding({
  open,
  onOpenChange,
  lead,
  onFinish,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  lead: LeadData | null
  onFinish: () => void
}) {
  const [description, setDescription] = useState('')
  const [products, setProducts] = useState<InitialProduct[]>([
    { name: '', price: '' },
    { name: '', price: '' },
    { name: '', price: '' },
  ])
  const [done, setDone] = useState(false)

  function updateProduct(i: number, key: keyof InitialProduct, value: string) {
    setProducts((prev) =>
      prev.map((p, idx) => (idx === i ? { ...p, [key]: value } : p)),
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setDone(true)
  }

  function close() {
    onOpenChange(false)
    // reset after the closing animation
    setTimeout(() => {
      setDone(false)
      setDescription('')
      setProducts([
        { name: '', price: '' },
        { name: '', price: '' },
        { name: '', price: '' },
      ])
    }, 250)
  }

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? onOpenChange(o) : close())}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        {done ? (
          <div className="flex flex-col items-center py-6 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <CheckCircle2 className="h-7 w-7" />
            </span>
            <h2 className="mt-4 font-serif text-xl font-semibold text-foreground">
              ¡Bienvenido al nido, {lead?.businessName || 'nuevo negocio'}!
            </h2>
            <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
              Recibimos tu información. Nuestro equipo de soporte en Cúcuta te
              contactará por WhatsApp para activar tu perfil y publicar tu
              landing profesional.
            </p>
            <Button onClick={close} className="mt-6 w-full rounded-full">
              Entendido
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="mb-1 flex items-center gap-2 text-xs font-medium text-nest-foreground">
                <Sparkles className="h-3.5 w-3.5" /> Paso 2 de 2
              </div>
              <DialogTitle className="font-serif text-xl">
                ¡Casi listo! Completa tu perfil inicial
              </DialogTitle>
              <DialogDescription className="text-pretty">
                Estos datos aceleran el proceso para que tu equipo de soporte deje
                tu landing lista más rápido.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="grid gap-5 pt-2">
              <div className="grid gap-1.5">
                <Label>Logo del negocio</Label>
                <button
                  type="button"
                  className="flex items-center gap-3 rounded-xl border-2 border-dashed border-border p-3 text-left transition-colors hover:border-primary/40"
                >
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
                    <ImagePlus className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Subir logo
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG o JPG, fondo claro recomendado
                    </p>
                  </div>
                </button>
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="brand-desc">Descripción de tu marca</Label>
                <Textarea
                  id="brand-desc"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Cuéntanos en pocas líneas qué vende tu negocio y qué lo hace especial..."
                />
              </div>

              <div className="grid gap-2">
                <Label>3 productos iniciales</Label>
                {products.map((p, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      value={p.name}
                      onChange={(e) => updateProduct(i, 'name', e.target.value)}
                      placeholder={`Producto ${i + 1}`}
                      className="flex-1"
                    />
                    <Input
                      value={p.price}
                      onChange={(e) => updateProduct(i, 'price', e.target.value)}
                      placeholder="Precio"
                      className="w-28"
                    />
                  </div>
                ))}
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Plus className="h-3 w-3" /> Podrás agregar más desde tu perfil
                </div>
              </div>

              <Button type="submit" className="w-full rounded-full">
                Finalizar registro
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
