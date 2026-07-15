'use client'

import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { useAnimeImperative, animateSelector } from '../../hooks/use-anime'
import { stagger } from 'animejs'
import { X, Plus, Trash2, Check } from 'lucide-react'

// --- DEFINICIÓN DE ESTRUCTURAS ---
interface TableRow {
  id: string
  name: string
  budget: number
  months: string[]
}

// Catálogo de meses para checkboxes
const ALL_MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

// Sugerencias de autocompletar para servicios
const SERVICE_SUGGESTIONS = [
  'Mantenimiento de Servidores',
  'Campaña de Marketing Digital',
  'Consultoría de Negocios',
  'Soporte Técnico 24/7',
  'Diseño UI/UX de Plataforma',
  'Desarrollo de API Rest',
]

// --- HOOK PERSONALIZADO: useRowIsolation ---
function useRowIsolation<T>(
  initialData: T,
  onRowSubmit: (id: string, updatedData: T) => void,
  rowId: string
) {
  const [localState, setLocalState] = useState<T>(initialData)
  const draftRef = useRef<T>(initialData)

  // Sincronizar con cambios externos (por ejemplo, si se carga una nueva lista)
  useEffect(() => {
    draftRef.current = initialData
    setLocalState(initialData)
  }, [initialData])

  const updateField = useCallback((key: keyof T, value: any) => {
    const updated = { ...draftRef.current, [key]: value }
    draftRef.current = updated
    setLocalState(updated) // Renderizado local optimizado a nivel de fila
  }, [])

  const submitRow = useCallback(() => {
    onRowSubmit(rowId, draftRef.current)
  }, [onRowSubmit, rowId])

  return {
    localState,
    updateField,
    submitRow,
  }
}

// --- FILA MEMOIZADA CON AISLAMIENTO DE ESTADO ---
interface IsolatedTableRowProps {
  row: TableRow
  onSave: (id: string, updated: TableRow) => void
  onDelete: (id: string) => void
}

const IsolatedTableRow = React.memo(function IsolatedTableRow({
  row,
  onSave,
  onDelete,
}: IsolatedTableRowProps) {
  const { localState, updateField, submitRow } = useRowIsolation<TableRow>(
    row,
    onSave,
    row.id
  )

  const [showSuggestions, setShowSuggestions] = useState(false)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Filtrar sugerencias de autocompletar localmente
  const filteredSuggestions = useMemo(() => {
    const term = localState.name.toLowerCase().trim()
    if (!term) return []
    return SERVICE_SUGGESTIONS.filter(
      (s) => s.toLowerCase().includes(term) && s.toLowerCase() !== term
    )
  }, [localState.name])

  // Cerrar sugerencias si se hace clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleMonth = (month: string) => {
    const current = localState.months || []
    const updated = current.includes(month)
      ? current.filter((m) => m !== month)
      : [...current, month]
    updateField('months', updated)
    // Guardar cambio inmediatamente al ser checkbox
    onSave(row.id, { ...localState, months: updated })
  }

  return (
    <tr className="services-list__table-row border-b border-border hover:bg-secondary/20 transition-colors">
      {/* Campo 1: Nombre con Autocompletar */}
      <td className="p-3 align-top w-1/3 relative">
        <input
          type="text"
          value={localState.name}
          onChange={(e) => {
            updateField('name', e.target.value)
            setShowSuggestions(true)
          }}
          onBlur={() => {
            // Un retraso pequeño para permitir clics en la sugerencia
            setTimeout(() => {
              submitRow()
              setShowSuggestions(false)
            }, 150)
          }}
          placeholder="Nombre del servicio..."
          className="w-full bg-background border border-input rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
        />
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute z-20 w-[90%] left-3 mt-1 bg-popover text-popover-foreground border border-border rounded-md shadow-lg max-h-40 overflow-y-auto text-xs py-1"
          >
            {filteredSuggestions.map((s) => (
              <button
                key={s}
                type="button"
                onMouseDown={() => {
                  updateField('name', s)
                  onSave(row.id, { ...localState, name: s })
                  setShowSuggestions(false)
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-secondary transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </td>

      {/* Campo 2: Entrada Numérica */}
      <td className="p-3 align-top w-1/4">
        <div className="relative">
          <span className="absolute left-2.5 top-1.5 text-xs text-muted-foreground">$</span>
          <input
            type="number"
            value={localState.budget || ''}
            onChange={(e) => updateField('budget', parseFloat(e.target.value) || 0)}
            onBlur={submitRow}
            placeholder="0"
            className="w-full bg-background border border-input rounded-md pl-5 pr-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </td>

      {/* Campo 3: Checkboxes de Meses */}
      <td className="p-3 align-top">
        <div className="flex flex-wrap gap-1">
          {ALL_MONTHS.map((m) => {
            const isChecked = (localState.months || []).includes(m)
            return (
              <button
                key={m}
                type="button"
                onClick={() => toggleMonth(m)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-medium border transition-all ${
                  isChecked
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-secondary text-secondary-foreground border-border hover:bg-secondary/80'
                }`}
              >
                {m}
              </button>
            )
          })}
        </div>
      </td>

      {/* Acción: Eliminar Fila */}
      <td className="p-3 align-top text-right">
        <button
          type="button"
          onClick={() => onDelete(row.id)}
          className="rounded p-1 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
          title="Eliminar fila"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </td>
    </tr>
  )
})

// --- COMPONENTE DE LA TABLA GENERAL ---
interface ServicesListTableProps {
  rows: TableRow[]
  onRowsChange: (updated: TableRow[]) => void
}

export function ServicesListTable({ rows, onRowsChange }: ServicesListTableProps) {
  useEffect(() => {
    if (rows.length === 0) return
    animateSelector('.services-list__table-row', {
      opacity: [0, 1],
      translateY: [12, 0],
      delay: stagger(30),
      duration: 300,
      easing: 'easeOutQuad',
    })
  }, [rows.length])

  const handleSaveRow = useCallback((id: string, updatedRow: TableRow) => {
    onRowsChange(rows.map((r) => (r.id === id ? updatedRow : r)))
  }, [rows, onRowsChange])

  const handleDeleteRow = useCallback((id: string) => {
    onRowsChange(rows.filter((r) => r.id !== id))
  }, [rows, onRowsChange])

  const addEmptyRow = () => {
    const newRow: TableRow = {
      id: `row-${Date.now()}`,
      name: '',
      budget: 0,
      months: [],
    }
    onRowsChange([...rows, newRow])
  }

  return (
    <div className="w-full mt-4 flex flex-col gap-3">
      <div className="overflow-x-auto border border-border rounded-xl">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-secondary/30 text-muted-foreground font-semibold">
              <th className="p-3">Objetivo / Servicio</th>
              <th className="p-3">Presupuesto ($)</th>
              <th className="p-3">Meses Cubiertos</th>
              <th className="p-3 text-right"></th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-muted-foreground text-xs">
                  No hay servicios configurados. Agrega uno abajo.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <IsolatedTableRow
                  key={row.id}
                  row={row}
                  onSave={handleSaveRow}
                  onDelete={handleDeleteRow}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        onClick={addEmptyRow}
        className="flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl border border-dashed border-primary/30 hover:border-primary text-primary text-xs font-semibold hover:bg-primary/5 transition-all w-full cursor-pointer"
      >
        <Plus className="h-3.5 w-3.5" /> Agregar Servicio
      </button>
    </div>
  )
}

// --- MODAL DE CONTROL PRINCIPAL ---
interface ServicesListModalProps {
  isOpen: boolean
  onClose: () => void
  rows: TableRow[]
  onRowsSave: (updated: TableRow[]) => void
  title: string
  children?: React.ReactNode
}

export function ServicesListModal({
  isOpen,
  onClose,
  rows: initialRows,
  onRowsSave,
  title,
  children,
}: ServicesListModalProps) {
  const [shouldRender, setShouldRender] = useState(isOpen)
  const [localRows, setLocalRows] = useState<TableRow[]>(initialRows)

  const [overlayRef, animateOverlay] = useAnimeImperative()
  const [modalRef, animateModal] = useAnimeImperative()

  // Sincronizar estado local al abrir
  useEffect(() => {
    if (isOpen) {
      setLocalRows(initialRows)
      setShouldRender(true)

      setTimeout(() => {
        animateOverlay({
          opacity: [0, 1],
          duration: 200,
          easing: 'linear',
        })
        animateModal({
          opacity: [0, 1],
          scale: [0.95, 1],
          duration: 300,
          easing: 'easeOutQuad',
        })
      }, 0)
    } else if (shouldRender) {
      const overlayExit = animateOverlay({
        opacity: [1, 0],
        duration: 200,
        easing: 'linear',
      })
      const modalExit = animateModal({
        opacity: [1, 0],
        scale: [1, 0.97],
        duration: 250,
        easing: 'easeInQuad',
      })

      Promise.all([overlayExit, modalExit]).then(() => {
        setShouldRender(false)
      })
    }
  }, [isOpen])

  const handleSaveAll = () => {
    onRowsSave(localRows)
    onClose()
  }

  if (!shouldRender) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Fondo oscuro difuminado */}
      <div
        ref={overlayRef}
        onClick={onClose}
        className="absolute inset-0 bg-background/80 backdrop-blur-sm opacity-0 cursor-pointer"
      />

      {/* Cuerpo del Modal */}
      <div
        ref={modalRef}
        className="relative z-10 w-full max-w-3xl rounded-2xl border border-border bg-card p-6 shadow-xl opacity-0 flex flex-col gap-4 max-h-[85vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h2 className="font-serif text-lg font-semibold text-foreground">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 hover:bg-secondary text-muted-foreground transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tabla optimizada de servicios */}
        <ServicesListTable rows={localRows} onRowsChange={setLocalRows} />

        {children}

        <div className="flex justify-end gap-2 border-t border-border pt-3 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-border bg-transparent px-4 py-2 text-xs font-semibold hover:bg-secondary transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSaveAll}
            className="rounded-full bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Check className="h-3.5 w-3.5" /> Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  )
}
