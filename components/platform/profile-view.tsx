'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ProductDialog } from '@/components/platform/product-dialog'
import { IncomingBadge } from '@/components/platform/incoming-badge'
import { cn } from '@/lib/utils'
import type { BusinessProfile, Product } from '@/lib/bercario-data'
import { uploadService } from '../../lib/api/services/upload'
import { animateSelector } from '../../hooks/use-anime'
import {
  Pencil,
  Check,
  Link2,
  Copy,
  Plus,
  Phone,
  Mail,
  MapPin,
  Eye,
  Trash2,
  BarChart3,
} from 'lucide-react'

function EditableText({
  value,
  onChange,
  as = 'input',
  className,
  label,
}: {
  value: string
  onChange: (v: string) => void
  as?: 'input' | 'textarea'
  className?: string
  label: string
}) {
  const [editing, setEditing] = useState(false)

  if (editing) {
    return (
      <div className="flex items-start gap-2">
        {as === 'textarea' ? (
          <Textarea
            autoFocus
            rows={4}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1"
          />
        ) : (
          <Input
            autoFocus
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1"
          />
        )}
        <Button
          size="icon"
          variant="outline"
          className="shrink-0 rounded-full bg-transparent"
          onClick={() => setEditing(false)}
          aria-label="Guardar"
        >
          <Check className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="group flex items-start gap-1.5">
      <span className={cn('flex-1', className)}>{value}</span>
      <button
        onClick={() => setEditing(true)}
        className="mt-0.5 shrink-0 rounded-md p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-secondary group-hover:opacity-100"
        aria-label={`Editar ${label}`}
      >
        <Pencil className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

export function ProfileView({
  profile,
  onProfileChange,
  onPreview,
}: {
  profile: BusinessProfile
  onProfileChange: (p: BusinessProfile) => void
  onPreview: () => void
}) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [copied, setCopied] = useState(false)
  const [uploadingBanner, setUploadingBanner] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)

  useEffect(() => {
    // Animación de entrada para las tarjetas de la columna izquierda
    animateSelector('.animate-profile-card', {
      opacity: [0, 1],
      translateY: [20, 0],
      delay: (_, i) => i * 80,
      duration: 600,
      easing: 'easeOutExpo',
    })

    // Animación de entrada para el título del catálogo y tarjetas de producto
    animateSelector('.animate-catalog-item', {
      opacity: [0, 1],
      scale: [0.97, 1],
      translateY: [15, 0],
      delay: (_, i) => i * 50,
      duration: 500,
      easing: 'easeOutExpo',
    })
  }, [])

  async function handleBannerUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setUploadingBanner(true)
      const res = await uploadService.uploadImage(file)
      update('banner', res.url)
    } catch (err) {
      console.error('Error al subir banner:', err)
      alert('Error al subir la imagen')
    } finally {
      setUploadingBanner(false)
    }
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setUploadingLogo(true)
      const res = await uploadService.uploadImage(file)
      update('logo', res.url)
    } catch (err) {
      console.error('Error al subir logo:', err)
      alert('Error al subir la imagen')
    } finally {
      setUploadingLogo(false)
    }
  }

  function update<K extends keyof BusinessProfile>(key: K, val: BusinessProfile[K]) {
    onProfileChange({ ...profile, [key]: val })
  }

  function copyLink() {
    const link = `bercario.co/${profile.slug}`
    navigator.clipboard?.writeText(link).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  function saveProduct(p: Product) {
    const exists = profile.products.some((x) => x.id === p.id)
    if (exists) {
      update(
        'products',
        profile.products.map((x) => (x.id === p.id ? p : x)),
      )
    } else if (profile.products.length < 5) {
      update('products', [...profile.products, p])
    }
  }

  function removeProduct(id: string) {
    update(
      'products',
      profile.products.filter((x) => x.id !== id),
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
      {/* Left column */}
      <div className="space-y-6">
        <Card className="overflow-hidden border-border p-0 shadow-none animate-profile-card opacity-0">
          <div className="relative h-28 bg-secondary group">
            <img
              src={profile.banner || '/images/company-banner.png'}
              alt="Banner del negocio"
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/images/company-banner.png'
              }}
            />
            <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-xs font-medium">
              {uploadingBanner ? 'Subiendo...' : 'Cambiar Banner'}
              <input type="file" accept="image/*" className="hidden" onChange={handleBannerUpload} disabled={uploadingBanner} />
            </label>
            <span className="absolute right-2 top-2 rounded-full bg-card/80 px-2 py-0.5 text-[11px] text-muted-foreground backdrop-blur">
              Banner
            </span>
          </div>
          <div className="px-5 pb-5">
            <div className="-mt-8 mb-3 flex items-end justify-between">
              <div className="relative h-16 w-16 overflow-hidden rounded-2xl border-4 border-card bg-card shadow-sm group">
                <img
                  src={profile.logo || '/images/company-logo.png'}
                  alt="Logo del negocio"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/images/company-logo.png'
                  }}
                />
                <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-[10px] text-center font-medium leading-none p-1">
                  {uploadingLogo ? '...' : 'Subir'}
                  <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={uploadingLogo} />
                </label>
              </div>
            </div>
            <EditableText
              label="nombre"
              value={profile.name}
              onChange={(v) => update('name', v)}
              className="font-serif text-lg font-semibold text-foreground"
            />
            <div className="mt-1">
              <EditableText
                label="lema"
                value={profile.tagline}
                onChange={(v) => update('tagline', v)}
                className="text-sm text-muted-foreground"
              />
            </div>

            <Button
              onClick={copyLink}
              className="mt-4 w-full rounded-full"
              variant={copied ? 'secondary' : 'default'}
            >
              {copied ? (
                <>
                  <Check className="mr-1 h-4 w-4" /> Enlace copiado
                </>
              ) : (
                <>
                  <Copy className="mr-1 h-4 w-4" /> Copiar enlace de mi landing
                </>
              )}
            </Button>
            <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-2 text-xs text-muted-foreground">
              <Link2 className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">bercario.co/{profile.slug}</span>
            </div>
            <Button
              onClick={onPreview}
              variant="outline"
              className="mt-2 w-full rounded-full bg-transparent"
            >
              <Eye className="mr-1 h-4 w-4" /> Ver landing generada
            </Button>
          </div>
        </Card>

        <Card className="border-border p-5 shadow-none animate-profile-card opacity-0">
          <h3 className="font-serif text-sm font-semibold text-foreground">
            Quiénes somos
          </h3>
          <Separator className="my-3" />
          <EditableText
            label="descripción"
            as="textarea"
            value={profile.description}
            onChange={(v) => update('description', v)}
            className="text-sm leading-relaxed text-muted-foreground"
          />
        </Card>

        <Card className="border-border p-5 shadow-none animate-profile-card opacity-0">
          <h3 className="font-serif text-sm font-semibold text-foreground">
            Contacto
          </h3>
          <Separator className="my-3" />
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
              <EditableText
                label="teléfono"
                value={profile.phone}
                onChange={(v) => update('phone', v)}
                className="text-foreground"
              />
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
              <EditableText
                label="correo"
                value={profile.email}
                onChange={(v) => update('email', v)}
                className="text-foreground"
              />
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
              <EditableText
                label="dirección"
                value={profile.address}
                onChange={(v) => update('address', v)}
                className="text-foreground"
              />
            </div>
          </div>
        </Card>

        {/* Phase 2 disabled action */}
        <Card className="relative overflow-hidden border-border p-5 shadow-none animate-profile-card opacity-0">
          <div className="flex items-center gap-3 opacity-40">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
              <BarChart3 className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">
                Estadísticas de ventas
              </p>
              <p className="text-xs text-muted-foreground">
                Ingresos, pedidos y clientes
              </p>
            </div>
          </div>
          <div className="mt-4 flex justify-center">
            <IncomingBadge />
          </div>
        </Card>
      </div>

      {/* Right column: catalog */}
      <div>
        <div className="mb-4 flex items-center justify-between animate-catalog-item opacity-0">
          <div>
            <h2 className="font-serif text-xl font-semibold text-foreground">
              Catálogo de productos
            </h2>
            <p className="text-sm text-muted-foreground">
              {profile.products.length} de 5 productos publicados
            </p>
          </div>
          <Button
            className="rounded-full"
            disabled={profile.products.length >= 5}
            onClick={() => {
              setEditingProduct(null)
              setDialogOpen(true)
            }}
          >
            <Plus className="mr-1 h-4 w-4" /> Agregar producto
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {profile.products.map((product) => (
            <Card
              key={product.id}
              className="group overflow-hidden border-border p-0 shadow-none animate-catalog-item opacity-0"
            >
              <div className="relative aspect-square bg-secondary">
                <img
                  src={product.image || '/placeholder.svg'}
                  alt={product.title || (product as any).name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg'
                  }}
                />
                <div className="absolute right-2 top-2 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => {
                      setEditingProduct(product)
                      setDialogOpen(true)
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-card/95 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-card"
                    aria-label="Editar producto"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => removeProduct(product.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-card/95 text-destructive shadow-sm backdrop-blur transition-colors hover:bg-card"
                    aria-label="Eliminar producto"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold leading-tight text-foreground">
                    {product.title || (product as any).name}
                  </h3>
                  <span className="shrink-0 font-serif text-sm font-semibold text-foreground">
                    {product.price}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {product.description || (product as any).desc}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {product.tags?.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-medium text-accent-foreground"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          ))}

          {profile.products.length < 5 && (
            <button
              onClick={() => {
                setEditingProduct(null)
                setDialogOpen(true)
              }}
              className="flex min-h-[220px] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground animate-catalog-item opacity-0"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary">
                <Plus className="h-5 w-5" />
              </span>
              <span className="text-sm font-medium">Agregar producto</span>
            </button>
          )}
        </div>
      </div>

      <ProductDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        product={editingProduct}
        onSave={saveProduct}
      />
    </div>
  )
}
