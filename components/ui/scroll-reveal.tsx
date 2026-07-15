'use client'

import { useEffect, useRef, useState } from 'react'
import { animate, remove } from 'animejs'

interface RevealProps {
  children: React.ReactNode
  duration?: number
  yOffset?: number
  delay?: number
}

export function Reveal({ children, duration = 800, yOffset = 30, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [hasRevealed, setHasRevealed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Set element style initially invisible
    el.style.opacity = '0'
    el.style.transform = `translateY(${yOffset}px)`

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRevealed) {
          setHasRevealed(true)
          animate(el, {
            opacity: [0, 1],
            translateY: [yOffset, 0],
            duration: duration,
            delay: delay,
            easing: 'easeOutCubic'
          })
        }
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -50px 0px'
      }
    )

    observer.observe(el)
    return () => {
      observer.disconnect()
    }
  }, [duration, yOffset, delay, hasRevealed])

  return (
    <div ref={ref}>
      {children}
    </div>
  )
}

interface RevealStaggerProps {
  children: React.ReactNode
  selector: string // e.g. ".stagger-card"
  delay?: number // default 100ms
  duration?: number // default 600ms
  yOffset?: number // default 30
}

export function RevealStagger({
  children,
  selector,
  delay = 100,
  duration = 600,
  yOffset = 30
}: RevealStaggerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hasRevealed, setHasRevealed] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRevealed) {
          setHasRevealed(true)
          
          const targetElements = el.querySelectorAll(selector)
          if (targetElements.length > 0) {
            // Set element styles initially invisible to prevent flash
            targetElements.forEach((target: any) => {
              target.style.opacity = '0'
              target.style.transform = `translateY(${yOffset}px)`
            })

            remove(Array.from(targetElements))
            animate(Array.from(targetElements), {
              opacity: [0, 1],
              translateY: [yOffset, 0],
              delay: (_, i) => i * delay,
              duration: duration,
              easing: 'easeOutQuad'
            })
          }
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    )

    observer.observe(el)
    return () => {
      observer.disconnect()
    }
  }, [selector, delay, duration, yOffset, hasRevealed])

  return (
    <div ref={containerRef}>
      {children}
    </div>
  )
}
