'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { BrandLogo } from '@/components/brand-logo'
import { Button } from '@/components/ui/button'
import { PageTransition } from '@/components/ui/page-transition'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/caracteristicas', label: 'Características' },
  { href: '/precios', label: 'Precios' },
  { href: '/nosotros', label: 'Sobre Nosotros' },
  { href: '/casos-exito', label: 'Casos de Éxito' },
]

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <BrandLogo />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-foreground ${
                    isActive ? 'text-foreground font-semibold' : 'text-muted-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.push('/login')}
              className="rounded-full text-sm font-medium"
            >
              Iniciar sesión
            </Button>
            <Button
              onClick={() => router.push('/login?signup=true')}
              className="rounded-full text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Comenzar gratis
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Panel */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-border bg-background px-4 pt-2 pb-6 space-y-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-2 text-base font-medium transition-colors ${
                    isActive ? 'text-foreground font-semibold' : 'text-muted-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
            <div className="pt-4 border-t border-border flex flex-col gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setMobileMenuOpen(false)
                  router.push('/login')
                }}
                className="w-full rounded-full"
              >
                Iniciar sesión
              </Button>
              <Button
                onClick={() => {
                  setMobileMenuOpen(false)
                  router.push('/login?signup=true')
                }}
                className="w-full rounded-full"
              >
                Comenzar gratis
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content with Transition */}
      <main className="flex-grow">
        <PageTransition>{children}</PageTransition>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/70 bg-background/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2 flex flex-col gap-4">
              <BrandLogo />
              <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                Berçário impulsa y da visibilidad a mayoristas y emprendedores del Norte de Santander, Colombia. Construyendo presencia digital confiable para crecer a nivel nacional.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">Plataforma</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/caracteristicas" className="hover:text-foreground transition-colors">
                    Características
                  </Link>
                </li>
                <li>
                  <Link href="/precios" className="hover:text-foreground transition-colors">
                    Precios
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-foreground transition-colors">
                    Iniciar sesión
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">Compañía</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/nosotros" className="hover:text-foreground transition-colors">
                    Sobre Nosotros
                  </Link>
                </li>
                <li>
                  <Link href="/casos-exito" className="hover:text-foreground transition-colors">
                    Casos de Éxito
                  </Link>
                </li>
                <li>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground font-medium">
                    Cúcuta, CO
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border/55 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Berçário. Todos los derechos reservados.
            </p>
            <p className="text-xs text-muted-foreground">
              Hecho con amor y berraquera en Norte de Santander.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
