'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Reveal, RevealStagger } from '@/components/ui/scroll-reveal'
import {
  ArrowRight,
  CheckCircle2,
  Zap,
  Code,
  Search,
  Smartphone,
  AlertCircle,
  Quote,
  Star,
  ShieldCheck,
  Sparkles,
  MapPin,
  Store,
  Eye,
  TrendingUp,
} from 'lucide-react'
import { leadsService } from '@/lib/api/services/leads'

const problemCards = [
  {
    icon: AlertCircle,
    title: 'Desarrollo web costoso',
    desc: 'Un programador o agencia cobra millones por una web sencilla. Dinero que necesitas para invertir en tu mercancía.',
  },
  {
    icon: Code,
    title: 'Dependencia técnica',
    desc: 'Cualquier cambio de precio, foto o número de contacto requiere esperar al programador o pelear con código complejo.',
  },
  {
    icon: Zap,
    title: 'Pérdida de tiempo',
    desc: 'Crear una página web desde cero toma semanas o meses. Tus clientes están listos para comprar hoy mismo.',
  },
]

const benefitCards = [
  {
    icon: Zap,
    title: 'Velocidad Absoluta',
    desc: 'Tu catálogo y landing listos en 10 minutos. Tan rápido como rellenar un formulario.',
  },
  {
    icon: Code,
    title: '100% Sin Código',
    desc: 'Diseño modular tipo Wix pero simplificado. Arrastra, cambia textos, sube fotos y listo.',
  },
  {
    icon: Search,
    title: 'Optimizado para SEO',
    desc: 'Cargada ultra rápida y estructurada para que te encuentren en Google y buscadores locales.',
  },
  {
    icon: Smartphone,
    title: 'Listo para Celulares',
    desc: 'El 90% de tus compradores mayoristas compran desde su celular. Tu web lucirá perfecta en cualquier pantalla.',
  },
]

const testimonials = [
  {
    name: 'Marisol Peña',
    role: 'Tienda El Buen Precio (Pamplona)',
    quote: 'Antes dependía de enviar archivos PDF pesados por WhatsApp. Ahora mis clientes ven el catálogo en línea y elijo qué productos mostrar en tiempo real. ¡Mis ventas aumentaron un 30%!',
    rating: 5,
    avatar: 'MP',
  },
  {
    name: 'Jorge Ramírez',
    role: 'Distribuidora JR (Ocaña)',
    quote: 'No sé nada de programación y en 10 minutos armé mi landing. El soporte local en Cúcuta me ayudó a configurar todo. Recomendadísimo para cualquier mayorista de la región.',
    rating: 5,
    avatar: 'JR',
  },
  {
    name: 'Diana Vega',
    role: 'Almacén La Moda (Cúcuta)',
    quote: 'La velocidad de carga en móvil es increíble. La mayoría de mis clientes compran desde pueblos lejanos con mala señal y aún así pueden ver mis productos al instante.',
    rating: 5,
    avatar: 'DV',
  },
]

export default function HomePage() {
  const router = useRouter()
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  return (
    <div className="overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 md:py-32 bg-linear-to-b from-secondary/30 to-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <Reveal duration={700} yOffset={30}>
              <div className="flex flex-col items-start gap-6 max-w-xl">
                <Badge
                  variant="secondary"
                  className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground flex items-center gap-1.5"
                >
                  <MapPin className="h-3 w-3 text-primary animate-pulse" />
                  Norte de Santander, Colombia
                </Badge>
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">
                  El nido digital donde crecen los{' '}
                  <span className="text-primary italic">mayoristas</span> de la región
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Berçário es la plataforma modular que te permite crear tu propia landing page y catálogo profesional en minutos. Sin programadores, sin costos absurdos y optimizado para vender.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <Button
                    size="lg"
                    onClick={() => router.push('/login?signup=true')}
                    className="rounded-full font-medium text-base shadow-lg hover:shadow-xl transition-all"
                  >
                    Comienza Gratis Ahora
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => router.push('/caracteristicas')}
                    className="rounded-full font-medium text-base bg-transparent"
                  >
                    Ver cómo funciona
                  </Button>
                </div>
                <div className="flex items-center gap-6 mt-4">
                  <div className="flex -space-x-2">
                    <span className="inline-block h-8 w-8 rounded-full bg-accent flex items-center justify-center text-xs font-bold border-2 border-background">MP</span>
                    <span className="inline-block h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold border-2 border-background">JR</span>
                    <span className="inline-block h-8 w-8 rounded-full bg-nest/40 flex items-center justify-center text-xs font-bold border-2 border-background">DV</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Únete a más de <strong className="text-foreground">300 mayoristas</strong> del departamento.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal duration={900} yOffset={50} delay={150}>
              <div className="relative">
                {/* Decorative background shape */}
                <div className="absolute inset-0 bg-accent/25 blur-3xl rounded-full transform translate-x-4 translate-y-4 -z-10" />
                <div className="border border-border rounded-2xl overflow-hidden shadow-2xl bg-card hover:scale-[1.01] transition-transform duration-500">
                  <img
                    src="/images/hero.png"
                    alt="Lienzo de creación modular interactiva en acción"
                    className="w-full object-cover aspect-video lg:aspect-square max-h-[500px]"
                  />
                  <div className="absolute bottom-4 left-4 right-4 bg-background/95 backdrop-blur-sm p-4 rounded-xl border border-border shadow-lg flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Estado</p>
                      <p className="text-sm font-semibold text-foreground">347 Negocios en vivo hoy</p>
                    </div>
                    <span className="flex h-3 w-3 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 2. SECCIÓN DE EMPATÍA O PROBLEMA */}
      <section className="py-20 bg-linear-to-b from-background to-secondary/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="outline" className="rounded-full mb-3 px-3 py-1 text-xs">
              El obstáculo
            </Badge>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
              Crear una web tradicional es frustrante y costoso
            </h2>
            <p className="text-muted-foreground mt-4 text-lg">
              Los mayoristas y emprendedores de hoy necesitan rapidez y control. Las soluciones antiguas ya no sirven.
            </p>
          </div>

          <RevealStagger selector=".problem-card" delay={150}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {problemCards.map((card, i) => {
                const Icon = card.icon
                return (
                  <Card
                    key={i}
                    className="problem-card border-border/80 p-8 shadow-xs hover:border-destructive/40 hover:shadow-md transition-all duration-300 flex flex-col gap-4 bg-card"
                  >
                    <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-serif font-bold text-foreground">{card.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{card.desc}</p>
                  </Card>
                )
              })}
            </div>
          </RevealStagger>
        </div>
      </section>

      {/* 3. PRESENTACIÓN DE LA SOLUCIÓN */}
      <section className="py-20 bg-background border-y border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <Reveal duration={800} yOffset={30}>
              <div className="relative rounded-2xl overflow-hidden border border-border shadow-xl">
                <div className="bg-muted h-10 px-4 flex items-center gap-2 border-b border-border">
                  <div className="h-3 w-3 rounded-full bg-destructive/60" />
                  <div className="h-3 w-3 rounded-full bg-amber-400" />
                  <div className="h-3 w-3 rounded-full bg-emerald-400" />
                  <div className="bg-background text-[10px] text-muted-foreground px-4 py-0.5 rounded-md ml-4 w-48 truncate">
                    bercario.co/tu-negocio
                  </div>
                </div>
                <div className="p-8 bg-card flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <div className="h-6 w-24 bg-secondary rounded-md" />
                    <div className="flex gap-2">
                      <div className="h-6 w-12 bg-secondary rounded-full" />
                      <div className="h-6 w-12 bg-primary/20 rounded-full" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-8 w-3/4 bg-primary/10 rounded-md" />
                    <div className="h-4 w-full bg-muted rounded-md" />
                    <div className="h-4 w-5/6 bg-muted rounded-md" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border border-border p-3 rounded-lg space-y-2">
                      <div className="h-24 bg-muted rounded-md" />
                      <div className="h-4 w-2/3 bg-muted rounded-md" />
                      <div className="h-4 w-1/3 bg-primary/25 rounded-md" />
                    </div>
                    <div className="border border-border p-3 rounded-lg space-y-2">
                      <div className="h-24 bg-muted rounded-md" />
                      <div className="h-4 w-3/4 bg-muted rounded-md" />
                      <div className="h-4 w-1/2 bg-primary/25 rounded-md" />
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal duration={800} yOffset={30} delay={150}>
              <div className="flex flex-col gap-6">
                <Badge variant="outline" className="w-fit rounded-full px-3 py-1 text-xs">
                  La solución
                </Badge>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
                  Diseña tu sitio modular en solo 10 minutos
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Berçário elimina la fricción técnica. Creamos una estructura modular donde solo seleccionas las secciones que deseas (Hero, Catálogo, Quiénes somos, Testimonios, FAQs) y rellenas los campos correspondientes.
                </p>
                <ul className="space-y-4">
                  {[
                    'Edición en vivo ultra simplificada',
                    'Ajustes de paletas y tipografías en un clic',
                    'Integración nativa con tu base de productos y catálogo',
                    'Publicación instantánea bajo tu enlace bercario.co/tu-marca',
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-foreground font-medium text-sm sm:text-base">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-2">
                  <Button onClick={() => router.push('/caracteristicas')} className="rounded-full">
                    Probar editor interactivo gratis
                  </Button>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 4. BENEFICIOS CLAVE */}
      <section className="py-20 bg-secondary/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="outline" className="rounded-full mb-3 px-3 py-1 text-xs">
              Beneficios
            </Badge>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
              Por qué los mayoristas prefieren Berçário
            </h2>
            <p className="text-muted-foreground mt-4 text-lg">
              Diseñado específicamente para las necesidades comerciales de la región.
            </p>
          </div>

          <RevealStagger selector=".benefit-card" delay={150}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefitCards.map((benefit, i) => {
                const Icon = benefit.icon
                return (
                  <Card
                    key={i}
                    className="benefit-card border-border/80 p-6 hover:border-primary/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-card flex flex-col gap-4"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-serif font-semibold text-foreground text-lg">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{benefit.desc}</p>
                  </Card>
                )
              })}
            </div>
          </RevealStagger>
        </div>
      </section>

      {/* 5. PRUEBA SOCIAL (Testimonios) */}
      <section className="py-20 bg-background border-t border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="outline" className="rounded-full mb-3 px-3 py-1 text-xs">
              Historias reales
            </Badge>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
              Mayoristas que ya están vendiendo en línea
            </h2>
            <p className="text-muted-foreground mt-4 text-lg">
              Conoce la experiencia de otros comerciantes del departamento.
            </p>
          </div>

          <RevealStagger selector=".testimonial-card" delay={150}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t, idx) => (
                <Card
                  key={idx}
                  className="testimonial-card border-border/85 p-8 bg-card flex flex-col justify-between gap-6 hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-1">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <Quote className="h-8 w-8 text-primary/15 shrink-0" />
                    <p className="text-sm text-muted-foreground italic leading-relaxed">
                      "{t.quote}"
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center font-bold text-sm text-primary shrink-0">
                      {t.avatar}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">{t.name}</h4>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </RevealStagger>
        </div>
      </section>

      {/* 6. RISK REVERSAL (Garantía) */}
      <section className="py-16 bg-secondary/15 border-y border-border/50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <Reveal duration={700} yOffset={25}>
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
                <ShieldCheck className="h-10 w-10" />
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                Comienza sin riesgos ni tarjetas de crédito
              </h2>
              <p className="text-muted-foreground max-w-xl leading-relaxed text-sm sm:text-base">
                Puedes registrarte, crear tu sitio, cargar tus primeros productos y publicarlo bajo el plan <strong>Free</strong> para siempre. No te pediremos tarjeta de crédito para registrarte ni hay letras pequeñas. Si decides escalar a Premium, cuentas con soporte local inmediato.
              </p>
              <div className="flex items-center gap-6 mt-4 flex-wrap justify-center text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Sin tarjeta de crédito</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Plan Free de por vida</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Soporte local en español</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 7. CTA FINAL (Formulario) */}
      <section className="py-20 bg-background" id="contacto">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Card className="border border-border p-8 sm:p-12 shadow-xl bg-card">
            <div className="text-center max-w-xl mx-auto mb-10">
              <h2 className="font-serif text-3xl font-bold text-foreground">Lleva tu negocio al nido</h2>
              <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                ¿Tienes dudas sobre los planes o quieres que configuremos tu catálogo por ti? Envíanos tus datos y te contactaremos.
              </p>
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
              className="space-y-6"
            >
              {sent ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle2 className="h-14 w-14 text-emerald-500 animate-bounce" />
                  <h3 className="mt-4 font-serif text-xl font-bold text-foreground">¡Solicitud recibida!</h3>
                  <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                    Nuestro equipo del Norte de Santander se pondrá en contacto contigo muy pronto.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-6 rounded-full"
                    onClick={() => setSent(false)}
                  >
                    Enviar otra solicitud
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="empresa">Nombre del negocio / empresa</Label>
                    <Input id="empresa" placeholder="Ej. Calzado La Moda Cúcuta" required />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="correo">Correo electrónico</Label>
                    <Input id="correo" type="email" placeholder="tucorreo@empresa.com" required />
                  </div>
                  <div className="sm:col-span-2 flex flex-col gap-2">
                    <Label htmlFor="ciudad">Ciudad de origen</Label>
                    <Input id="ciudad" placeholder="Ej. Cúcuta" required />
                  </div>
                  <div className="sm:col-span-2 flex flex-col gap-2">
                    <Label htmlFor="mensaje">¿En qué podemos ayudarte?</Label>
                    <Textarea
                      id="mensaje"
                      rows={4}
                      placeholder="Cuéntanos sobre tu negocio, qué vendes al por mayor..."
                      required
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

                  <div className="col-span-full pt-2">
                    <Button type="submit" size="lg" className="w-full rounded-full" disabled={submitting}>
                      {submitting ? 'Enviando...' : 'Enviar solicitud'}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </Card>
        </div>
      </section>
    </div>
  )
}
