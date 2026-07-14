'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { IncomingBadge } from '@/components/platform/incoming-badge'
import { cn } from '@/lib/utils'
import type { LandingSection } from '@/lib/bercario-data'
import {
  GripVertical,
  ArrowUp,
  ArrowDown,
  Eye,
  Image as ImageIcon,
  FileText,
  LayoutGrid,
  Mail,
  Palette,
  Check,
} from 'lucide-react'

const sectionIcons: Record<string, typeof ImageIcon> = {
  banner: ImageIcon,
  about: FileText,
  products: LayoutGrid,
  contact: Mail,
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

  function move(from: number, to: number) {
    if (to < 0 || to >= sections.length) return
    const next = [...sections]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    onSectionsChange(next)
  }

  function handleDrop(index: number) {
    if (dragIndex === null || dragIndex === index) return
    move(dragIndex, index)
    setDragIndex(null)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl font-semibold text-foreground">
              Configurar mi landing
            </h2>
            <p className="text-sm text-muted-foreground">
              Arrastra para reordenar las secciones de tu página generada.
            </p>
          </div>
          <Button onClick={onPreview} className="rounded-full">
            <Eye className="mr-1 h-4 w-4" /> Vista previa
          </Button>
        </div>

        <div className="space-y-3">
          {sections.map((section, index) => {
            const Icon = sectionIcons[section.id] ?? LayoutGrid
            return (
              <div
                key={section.id}
                draggable
                onDragStart={() => setDragIndex(index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(index)}
                onDragEnd={() => setDragIndex(null)}
                className={cn(
                  'flex items-center gap-3 rounded-xl border bg-card p-4 transition-all',
                  dragIndex === index
                    ? 'border-primary opacity-60 shadow-md'
                    : 'border-border shadow-none hover:border-primary/40',
                )}
              >
                <GripVertical className="h-5 w-5 shrink-0 cursor-grab text-muted-foreground active:cursor-grabbing" />
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {index + 1}. {section.label}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {section.description}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col gap-1">
                  <button
                    onClick={() => move(index, index - 1)}
                    disabled={index === 0}
                    className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-30"
                    aria-label="Subir sección"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => move(index, index + 1)}
                    disabled={index === sections.length - 1}
                    className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-30"
                    aria-label="Bajar sección"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Sidebar: palette + phase 2 */}
      <div className="space-y-6">
        <Card className="border-border p-5 shadow-none">
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

        <Card className="relative border-border p-5 shadow-none">
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
