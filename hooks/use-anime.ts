import { useEffect, useRef, useCallback } from 'react'
import { animate, remove, type AnimationParams, type TargetsParam } from 'animejs'

export type AnimeParams = Omit<AnimationParams, 'targets'>

/**
 * Hook declarativo: ejecuta una animación automáticamente sobre el elemento
 * al montarse o cuando cambian las dependencias del arreglo.
 * 
 * @param params Parámetros de animación de Anime.js (excepto targets)
 * @param deps Dependencias para volver a disparar la animación
 */
export function useAnime(params: AnimeParams, deps: any[] = []) {
  const elementRef = useRef<any>(null)
  const animationRef = useRef<any>(null)

  useEffect(() => {
    if (!elementRef.current) return

    // Limpia la animación en cola si existe para evitar saltos o solapamientos
    remove(elementRef.current)

    animationRef.current = animate(elementRef.current, params as any)

    return () => {
      if (elementRef.current) {
        remove(elementRef.current)
      }
    }
  }, deps) // eslint-disable-hooks/exhaustive-deps

  return elementRef
}

/**
 * Hook imperativo: permite disparar animaciones en respuesta a eventos del usuario
 * (click, submit, hover, toggle modal) de forma manual y controlada.
 */
export function useAnimeImperative() {
  const elementRef = useRef<any>(null)
  const animationRef = useRef<any>(null)

  const runAnimation = useCallback((params: AnimeParams) => {
    const target = elementRef.current
    if (!target) return Promise.resolve(null)

    // Detener animaciones activas en este nodo
    remove(target)

    return new Promise<any>((resolve) => {
      animationRef.current = animate(target, {
        ...params,
        complete: (anim) => {
          if (params.complete) params.complete(anim)
          resolve(anim)
        },
      } as any)
    })
  }, [])

  return [elementRef, runAnimation] as const
}

/**
 * Utilidad directa para animar elementos por selector (clases, selectores complejos, grids)
 * útil para efectos staggered (cascada) en listas y tablas.
 */
export const animateSelector = (selector: string, params: AnimeParams) => {
  remove(selector)
  return animate(selector, params as any)
}
