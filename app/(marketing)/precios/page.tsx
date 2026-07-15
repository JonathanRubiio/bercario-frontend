'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Reveal, RevealStagger } from '@/components/ui/scroll-reveal'
import {
  Check,
  X,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react'

const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    period: 'para siempre',
    desc: 'Ideal para emprendedores que están iniciando su presencia digital.',
    features: [
      { text: 'Límite de 5 imágenes en catálogo', included: true },
      { text: 'Subdominio bercario.co/tu-marca', included: true },
      { text: 'Formulario de contacto básico', included: true },
      { text: 'Soporte vía correo', included: true },
      { text: 'Dominio propio personalizado', included: false },
      { text: 'Estadísticas avanzadas de visitas', included: false },
      { text: 'Prioridad de soporte local', included: false },
    ],
    cta: 'Comenzar Gratis',
    href: '/login?signup=true',
    popular: false,
  },
  {
    name: 'Premium',
    price: '$35.000',
    period: 'al mes',
    desc: 'Perfecto para negocios que quieren crecer y exhibir todo su inventario.',
    features: [
      { text: 'Imágenes ilimitadas en catálogo', included: true },
      { text: 'Subdominio bercario.co/tu-marca', included: true },
      { text: 'Formulario de contacto prioritario', included: true },
      { text: 'Soporte vía WhatsApp y correo', included: true },
      { text: 'Dominio propio personalizado (.com, .co)', included: true },
      { text: 'Estadísticas avanzadas de visitas', included: true },
      { text: 'Prioridad de soporte local', included: false },
    ],
    cta: 'Elegir Plan Premium',
    href: '/login?signup=true&plan=premium',
    popular: true,
  },
  {
    name: 'Corporativo',
    price: '$79.000',
    period: 'al mes',
    desc: 'Diseñado para grandes distribuidoras y bodegas mayoristas en Cúcuta.',
    features: [
      { text: 'Imágenes ilimitadas en catálogo', included: true },
      { text: 'Subdominio bercario.co/tu-marca', included: true },
      { text: 'Formulario de contacto prioritario', included: true },
      { text: 'Soporte VIP telefónico y WhatsApp', included: true },
      { text: 'Dominio propio personalizado (.com, .co)', included: true },
      { text: 'Estadísticas avanzadas de visitas', included: true },
      { text: 'Prioridad de soporte local (24/7)', included: true },
    ],
    cta: 'Contactar Ventas',
    href: '/#contacto',
    popular: false,
  },
]

const faqs = [
  {
    q: '¿El plan Free es verdaderamente gratis?',
    a: 'Sí, puedes usar el plan Free de por vida sin ingresar ninguna tarjeta de crédito. La única limitación es que podrás cargar hasta un máximo de 5 imágenes del catálogo en tu perfil.',
  },
  {
    q: '¿Cómo configuro mi dominio personalizado en el plan Premium?',
    a: 'Una vez adquirido el plan Premium, tendrás una sección en tu panel de control donde podrás ingresar tu dominio (ej. www.tumarca.com). Nuestro equipo de soporte te enviará las instrucciones de DNS o lo configurará por ti sin costo adicional.',
  },
  {
    q: '¿Cuáles son los métodos de pago disponibles?',
    a: 'Aceptamos pagos a través de PSE (Nequi, Daviplata, Bancos nacionales), transferencias bancarias directas y tarjetas de crédito a través de nuestra pasarela de pagos integrada en la plataforma.',
  },
  {
    q: '¿Puedo cambiar de plan o cancelar en cualquier momento?',
    a: 'Sí, no hay contratos de permanencia. Puedes cancelar, subir o bajar de nivel tu suscripción mensual en cualquier momento directamente desde tu panel de usuario.',
  },
  {
    q: '¿Ofrecen soporte presencial en Norte de Santander?',
    a: 'Sí, para el plan Corporativo y comercios Premium en Cúcuta y área metropolitana ofrecemos asistencia de acompañamiento presencial para el montaje inicial de su catálogo en línea.',
  },
]

export default function PricingPage() {
  const router = useRouter()
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index)
  }

  return (
    <div className="py-12 md:py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="rounded-full mb-3 px-3 py-1 text-xs">
            Membresías
          </Badge>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Planes a la medida de tu negocio
          </h1>
          <p className="text-muted-foreground mt-4 text-base sm:text-lg">
            Sube tu catálogo mayorista y empieza a recibir pedidos. Elige la membresía que mejor se adapte a tu escala de distribución.
          </p>
        </div>

        {/* PRICING CARDS */}
        <RevealStagger selector=".pricing-card" delay={120}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start mb-24">
            {pricingPlans.map((plan, idx) => (
              <Card
                key={idx}
                className={`pricing-card p-8 flex flex-col gap-6 relative bg-card transition-all duration-300 ${
                  plan.popular
                    ? 'border-primary ring-2 ring-primary/45 shadow-xl md:-translate-y-2'
                    : 'border-border shadow-md hover:shadow-lg'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider py-1 px-4 rounded-full flex items-center gap-1 shadow-md">
                    <Sparkles className="h-3.5 w-3.5 fill-current" />
                    Más Popular
                  </span>
                )}

                <div>
                  <h3 className="font-serif text-xl font-bold text-foreground">{plan.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1 h-10">{plan.desc}</p>
                </div>

                <div className="flex items-baseline gap-1 py-2 border-y border-border/60">
                  <span className="text-3xl sm:text-4xl font-extrabold font-serif text-foreground">{plan.price}</span>
                  {plan.price !== '$0' && (
                    <span className="text-xs text-muted-foreground">{plan.period}</span>
                  )}
                  {plan.price === '$0' && (
                    <span className="text-xs text-muted-foreground">{plan.period}</span>
                  )}
                </div>

                <ul className="space-y-3 flex-grow">
                  {plan.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                      {feat.included ? (
                        <Check className="h-4 sm:h-5 w-4 sm:w-5 text-emerald-500 shrink-0 mt-0.5" />
                      ) : (
                        <X className="h-4 sm:h-5 w-4 sm:w-5 text-muted-foreground/40 shrink-0 mt-0.5" />
                      )}
                      <span className={feat.included ? 'text-foreground' : 'text-muted-foreground/60'}>
                        {feat.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => {
                    if (plan.href.startsWith('#')) {
                      const el = document.getElementById(plan.href.substring(2))
                      if (el) el.scrollIntoView({ behavior: 'smooth' })
                    } else {
                      router.push(plan.href)
                    }
                  }}
                  className={`w-full rounded-full font-semibold transition-all ${
                    plan.popular
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/80'
                  }`}
                >
                  {plan.cta}
                </Button>
              </Card>
            ))}
          </div>
        </RevealStagger>

        {/* FAQ ACCORDION SECTION */}
        <section className="max-w-3xl mx-auto">
          <Reveal duration={700} yOffset={25}>
            <div className="text-center mb-12">
              <HelpCircle className="h-8 w-8 text-primary mx-auto mb-2" />
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                Dudas sobre el servicio
              </h2>
              <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                Respuestas a las preguntas recurrentes sobre la plataforma de Berçário.
              </p>
            </div>
          </Reveal>

          <RevealStagger selector=".faq-item" delay={100}>
            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index
                return (
                  <Card
                    key={index}
                    className="faq-item border border-border/80 rounded-xl overflow-hidden bg-card transition-all"
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full px-6 py-4 flex items-center justify-between text-left text-foreground hover:bg-secondary/20 transition-colors"
                    >
                      <span className="font-serif font-bold text-sm sm:text-base pr-4">{faq.q}</span>
                      {isOpen ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground shrink-0" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/20">
                        {faq.a}
                      </div>
                    )}
                  </Card>
                )
              })}
            </div>
          </RevealStagger>
        </section>

      </div>
    </div>
  )
}
