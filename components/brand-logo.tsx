import { cn } from '@/lib/utils'

export function BrandLogo({
  className,
  showText = true,
}: {
  className?: string
  showText?: boolean
}) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-nest text-nest-foreground">
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 13c3-4 15-4 18 0" />
          <path d="M4 13c2.5 3.5 13.5 3.5 16 0" />
          <path d="M12 13c0-3 1.5-5 4-6" />
          <circle cx="12" cy="12.5" r="1.4" fill="currentColor" stroke="none" />
        </svg>
      </span>
      {showText && (
        <span className="font-serif text-xl font-semibold tracking-tight text-foreground">
          Berçário
        </span>
      )}
    </div>
  )
}
