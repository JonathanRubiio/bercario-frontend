'use client'

import { useEffect, useState } from 'react'
import { useAnimeImperative, animateSelector } from '../../hooks/use-anime'
import { stagger } from 'animejs' // Importación directa de stagger para animejs v4
import { X } from 'lucide-react'

// --- 1. COMPONENTE DE LA TABLA CON EFECTO CASCADA (STAGGER) ---

interface TableRow {
  id: string
  name: string
  months: string[]
}

interface ServicesListTableProps {
  rows: TableRow[]
}

export function ServicesListTable({ rows }: ServicesListTableProps) {
  useEffect(() => {
    if (rows.length === 0) return

    // Cada vez que se monte la tabla o cambie el arreglo, animamos las filas
    animateSelector('.services-list__table-row', {
      opacity: [0, 1],
      translateY: [15, 0],
      delay: stagger(40), // 40ms de retraso secuencial (escala en cascada)
      duration: 350,
      easing: 'easeOutQuad',
    })
  }, [rows])

  return (
    <div className="overflow-x-auto w-full mt-4">
      <table className="w-full text-sm text-left border-collapse">
        <thead>
          <tr className="border-b border-border text-muted-foreground">
            <th className="p-3">Objetivo / Servicio</th>
            <th className="p-3">Meses Cubiertos</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className="services-list__table-row opacity-0 border-b border-border hover:bg-secondary/40 transition-colors"
            >
              <td className="p-3 font-medium text-foreground">{row.name}</td>
              <td className="p-3 text-muted-foreground text-xs">{row.months.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// --- 2. COMPONENTE MODAL PRINCIPAL (services-list__modal-dd) CON CIERRE SINCRONIZADO ---

interface ServicesListModalProps {
  isOpen: boolean
  onClose: () => void
  rows: TableRow[]
  title: string
  children?: React.ReactNode
}

export function ServicesListModal({ isOpen, onClose, rows, title, children }: ServicesListModalProps) {
  // Estado para retrasar el desmontaje físico del DOM
  const [shouldRender, setShouldRender] = useState(isOpen)
  
  // Referencias para animar por separado el fondo y la tarjeta
  const [overlayRef, animateOverlay] = useAnimeImperative()
  const [modalRef, animateModal] = useAnimeImperative()

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)

      // Ejecutar en el siguiente ciclo de render para que los refs existan
      setTimeout(() => {
        // Entrada del Overlay (Fondo oscuro difuminado)
        animateOverlay({
          opacity: [0, 1],
          duration: 200,
          easing: 'linear',
        })

        // Entrada del Modal (Tarjeta escalada hacia el frente)
        animateModal({
          opacity: [0, 1],
          scale: [0.95, 1],
          duration: 300,
          easing: 'easeOutQuad',
        })
      }, 0)
    } else if (shouldRender) {
      // Secuencia de Cierre paralela
      const overlayExit = animateOverlay({
        opacity: [1, 0],
        duration: 200,
        easing: 'linear',
      })

      const modalExit = animateModal({
        opacity: [1, 0],
        scale: [1, 0.97],
        duration: 250,
        easing: 'easeInQuad', // easing solicitado para la salida
      })

      // Esperar a que terminen ambas transiciones antes de remover del DOM
      Promise.all([overlayExit, modalExit]).then(() => {
        setShouldRender(false)
      })
    }
  }, [isOpen])

  if (!shouldRender) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay Oscuro */}
      <div
        ref={overlayRef}
        onClick={onClose}
        className="absolute inset-0 bg-background/80 backdrop-blur-sm opacity-0 cursor-pointer"
      />

      {/* Tarjeta del Modal */}
      <div
        ref={modalRef}
        className="relative z-10 w-full max-w-2xl rounded-xl border border-border bg-card p-6 shadow-xl opacity-0 flex flex-col gap-4"
      >
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h2 className="font-serif text-xl font-semibold text-foreground">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 hover:bg-secondary text-muted-foreground transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tabla interna */}
        <ServicesListTable rows={rows} />

        {children}
      </div>
    </div>
  )
}
