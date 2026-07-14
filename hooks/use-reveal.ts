import { useEffect, useState, useRef } from 'react'

export function useReveal(threshold = 0.1, rootMargin = '0px 0px -80px 0px', once = false) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<any>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once) {
            observer.unobserve(el)
          }
        } else if (!once) {
          setIsVisible(false)
        }
      },
      {
        threshold,
        rootMargin,
      }
    )

    observer.observe(el)

    return () => {
      if (el) {
        observer.unobserve(el)
      }
    }
  }, [threshold, rootMargin, once])

  return [ref, isVisible] as const
}
