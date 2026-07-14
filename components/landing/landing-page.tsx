'use client'

import { Button, buttonVariants } from '@/components/ui/button'
import { BrandLogo } from '@/components/brand-logo'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Store,
  Eye,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  MapPin,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'
import { useState } from 'react'

const stats = [
  { icon: Store, value: '500+', label: 'Mayoristas conectados' },
  { icon: Eye, value: '12.000+', label: 'Vistas de catálogo este mes' },
  { icon: TrendingUp, value: '38%', label: 'Crecimiento en pedidos' },
]

const values = [
  {
    icon: Sparkles,
    title: 'Fase 1 · Visibilidad',
    text: 'Cada negocio recibe una landing profesional generada automáticamente, con catálogo, etiquetas y enlace propio para compartir.',
  },
  {
    icon: ShieldCheck,
    title: 'Fase 2 · Marketplace',
    text: 'Próximamente: ventas en línea, seguimiento de pedidos y pagos integrados directamente desde tu perfil de Berçário.',
  },
  {
    icon: TrendingUp,
    title: 'Fase 3 · Inteligencia',
    text: 'Analítica regional para entender la demanda del Norte de Santander y hacer crecer tu negocio con datos.',
  },
]

import styles from './landing-page.module.scss'
import { useRouter } from 'next/navigation'
import { leadsService } from '@/lib/api/services/leads'

export function LandingPage() {
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const router = useRouter()

  return (
    <main className={styles.landingPage}>
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <BrandLogo />
          <nav className={styles.desktopNav}>
            <a href="#mision" className={styles.navLink}>
              Misión
            </a>
            <a href="#proyecto" className={styles.navLink}>
              El proyecto
            </a>
            <a href="#contacto" className={styles.navLink}>
              Contacto
            </a>
          </nav>
          <Button onClick={() => router.push('/login')} className="rounded-full">
            Iniciar sesión
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section id="mision" className={styles.heroSection}>
        <div className={styles.heroGrid}>
          <div>
            <Badge
              variant="secondary"
              className="mb-5 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground"
            >
              <MapPin className="mr-1 h-3 w-3" /> Norte de Santander, Colombia
            </Badge>
            <h1 className={styles.heroTitle}>
              El nido donde crecen los mayoristas de la región
            </h1>
            <p className={styles.heroSubtitle}>
              Berçário impulsa y da visibilidad a mayoristas y emprendedores del
              Norte de Santander. Creamos tu presencia digital para que más
              comerciantes te encuentren, con la calma y confianza de un buen
              comienzo.
            </p>
            <div className={styles.heroBtnGroup}>
              <Button onClick={() => router.push('/login')} size="lg" className="rounded-full">
                Ingresar a mi perfil
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
              <a
                href="#proyecto"
                className={buttonVariants({
                  size: 'lg',
                  variant: 'outline',
                  className: 'rounded-full bg-transparent',
                })}
              >
                Conocer el proyecto
              </a>
            </div>
          </div>

          <div className={styles.heroImageWrapper}>
            <div className={styles.heroImageCard}>
              <img
                src="/images/hero.png"
                alt="Emprendedores mayoristas colaborando en un showroom moderno"
                className="h-full w-full object-cover"
              />
            </div>
            <div className={styles.heroImageBadge}>
              <p className="text-xs text-muted-foreground">En vivo</p>
              <p className="text-sm font-medium text-foreground">
                347 negocios activos hoy
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className={styles.statsContainer}>
          {stats.map((s) => (
            <Card
              key={s.label}
              className="flex items-center gap-4 border-border p-5 shadow-none"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <s.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-serif text-2xl font-semibold text-foreground">
                  {s.value}
                </p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* About / project */}
      <section id="proyecto" className={styles.projectSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Un proyecto que crece por etapas
          </h2>
          <p className={styles.sectionDesc}>
            Berçário acompaña a cada negocio desde su primera presencia digital
            hasta convertirse en un vendedor completo dentro de un marketplace
            regional.
          </p>
        </div>

        <div className={styles.projectGrid}>
          {values.map((v) => (
            <Card key={v.title} className="border-border p-6 shadow-none">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-foreground">
                <v.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-serif text-lg font-semibold text-foreground">
                {v.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {v.text}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contacto" className={styles.contactSection}>
        <Card className={styles.contactCard}>
          <div>
            <h2 className={styles.sectionTitle}>
              Lleva tu negocio al nido
            </h2>
            <p className={styles.sectionDesc}>
              ¿Eres una empresa regional interesada en Berçário? Cuéntanos sobre
              tu negocio y nuestro equipo de soporte te contactará para
              configurar tu perfil.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              {[
                'Landing profesional sin costo de desarrollo',
                'Enlace propio para compartir con clientes',
                'Soporte local en Cúcuta y toda la región',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-nest-foreground" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <form
            onSubmit={async (e) => {
              e.preventDefault()
              setErrorMsg(null)
              setSubmitting(true)
              const elements = e.currentTarget.elements as any
              const businessName = elements.empresa.value
              const email = elements.correo.value
              const city = elements.ciudad.value
              const message = elements.mensaje.value
              const website = elements.website.value

              try {
                await leadsService.createLead({
                  businessName,
                  email,
                  city,
                  message,
                  website,
                })
                setSent(true)
              } catch (err: any) {
                console.error(err)
                setErrorMsg(err?.message || 'Error al enviar la solicitud. Intenta de nuevo.')
              } finally {
                setSubmitting(false)
              }
            }}
            className={styles.contactForm}
          >
            {sent ? (
              <div className="flex h-full flex-col items-center justify-center py-10 text-center">
                <CheckCircle2 className="h-10 w-10 text-nest-foreground" />
                <p className="mt-3 font-serif text-lg font-semibold text-foreground">
                  ¡Mensaje enviado!
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Nuestro equipo te contactará pronto.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-5 rounded-full bg-transparent"
                  onClick={() => setSent(false)}
                >
                  Enviar otro
                </Button>
              </div>
            ) : (
              <div className={styles.formGrid}>
                <div className={styles.formField}>
                  <Label htmlFor="empresa">Nombre de la empresa</Label>
                  <Input id="empresa" placeholder="Ej. Distribuidora El Progreso" required />
                </div>
                <div className={styles.formField}>
                  <Label htmlFor="correo">Correo electrónico</Label>
                  <Input id="correo" type="email" placeholder="tucorreo@empresa.co" required />
                </div>
                <div className={styles.formField}>
                  <Label htmlFor="ciudad">Ciudad</Label>
                  <Input id="ciudad" placeholder="Cúcuta" required />
                </div>
                <div className={styles.formField}>
                  <Label htmlFor="mensaje">Mensaje</Label>
                  <Textarea
                    id="mensaje"
                    rows={3}
                    placeholder="Cuéntanos sobre tu negocio..."
                  />
                </div>
                {/* Honeypot field (hidden from users to catch spam bots) */}
                <div style={{ display: 'none' }}>
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" tabIndex={-1} autoComplete="off" />
                </div>

                {errorMsg && (
                  <div className="col-span-full rounded-lg bg-destructive/10 p-3 text-xs text-destructive">
                    {errorMsg}
                  </div>
                )}

                <Button type="submit" className="mt-1 w-full rounded-full" disabled={submitting}>
                  {submitting ? 'Enviando...' : 'Enviar solicitud'}
                </Button>
              </div>
            )}
          </form>
        </Card>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <BrandLogo />
          <p>© {new Date().getFullYear()} Berçário · Norte de Santander, Colombia</p>
        </div>
      </footer>
    </main>
  )
}
