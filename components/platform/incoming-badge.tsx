import { Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

export function IncomingBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-border bg-card/95 px-2.5 py-1 text-[11px] font-medium text-muted-foreground shadow-sm',
        className,
      )}
    >
      <Lock className="h-3 w-3" />
      Incoming (Fase 2) · Marketplace &amp; Sales Tracking
    </span>
  )
}

export function IncomingOverlay({ label }: { label?: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-[inherit] bg-background/55 backdrop-blur-[1px]">
      <IncomingBadge />
      {label && <span className="sr-only">{label}</span>}
    </div>
  )
}
