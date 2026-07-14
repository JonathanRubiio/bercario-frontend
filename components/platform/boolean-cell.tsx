'use client'

import { useState } from 'react'
import { useAnimeImperative } from '../../hooks/use-anime'

interface BooleanCellProps {
  initialChecked: boolean
  label: string
  onChange?: (checked: boolean) => void
}

export function BooleanCell({ initialChecked, label, onChange }: BooleanCellProps) {
  const [localChecked, setLocalChecked] = useState(initialChecked)
  
  // Vinculamos el hook imperativo para animar directamente el DOM del botón
  const [checkboxRef, animate] = useAnimeImperative()

  const handleClick = () => {
    const nextChecked = !localChecked
    setLocalChecked(nextChecked)
    if (onChange) onChange(nextChecked)

    // Lanzamos la animación elástica sutil en la escala del elemento
    animate({
      scale: [1, 1.2, 1],
      duration: 250,
      easing: 'easeOutElastic(1, .6)',
    })
  }

  return (
    <button
      ref={checkboxRef}
      type="button"
      onClick={handleClick}
      className={`h-8 px-4 rounded-full border text-xs font-semibold select-none flex items-center justify-center transition-colors cursor-pointer ${
        localChecked
          ? 'bg-primary border-primary text-primary-foreground'
          : 'bg-transparent border-border text-muted-foreground hover:border-muted-foreground/50'
      }`}
    >
      <span>{label}</span>
    </button>
  )
}
