'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { animate, remove } from 'animejs'

export function PageTransition({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    if (containerRef.current) {
      remove(containerRef.current)
      
      // Reset layout styles before animating to prevent jumps
      containerRef.current.style.opacity = '0'
      containerRef.current.style.transform = 'translateY(15px)'

      animate(containerRef.current, {
        opacity: [0, 1],
        translateY: [15, 0],
        duration: 400,
        easing: 'easeOutQuad',
      })
    }
  }, [pathname])

  return (
    <div ref={containerRef}>
      {children}
    </div>
  )
}
