'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Reveal, RevealStagger } from '@/components/ui/scroll-reveal'
import {
  Sparkles,
  MapPin,
  Heart,
  Globe,
  Code2,
  Cpu,
  ShieldAlert,
} from 'lucide-react'

const coreValues = [
  {
    icon: MapPin,
    title: 'Arraigo Local',
    desc: 'Nacimos en Cúcuta y entendemos los retos del comerciante y fabricante de calzado, textil y marroquinería en la frontera.',
  },
  {
    icon: Heart,
    title: 'Calidad Humana',
    desc: 'Acompañamos paso a paso con soporte presencial y chat cercano. Cero contestadores automáticos o robots impersonales.',
  },
  {
    icon: Globe,
    title: 'Visión Nacional',
    desc: 'Conectamos el talento de nuestra región con compradores mayoristas de toda Colombia, digitalizando el canal tradicional.',
  },
]

const engineeringTeam = [
  {
    name: 'Jonathan Rubio',
    role: 'Director de Tecnología & Fundador',
    bio: 'Ingeniero de software cucuteño apasionado por construir tecnología con impacto social en las regiones colombianas.',
    avatar: 'JR',
  },
  {
    name: 'Mateo Cárdenas',
    role: 'Lead Frontend Architect',
    bio: 'Experto en interfaces de usuario y animaciones fluidas. Su misión es hacer la tecnología accesible para todos.',
    avatar: 'MC',
  },
  {
    name: 'Valeria Solano',
    role: 'Full Stack Engineer',
    bio: 'Especialista en sistemas escalables y seguridad de datos. Asegura la estabilidad del catálogo y las APIs.',
    avatar: 'VS',
  },
]

export default function AboutUsPage() {
  return (
    <div className="py-12 md:py-20 bg-background overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Title Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="rounded-full mb-3 px-3 py-1 text-xs">
            Nuestra Historia
          </Badge>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            El nido donde impulsamos el comercio local
          </h1>
          <p className="text-muted-foreground mt-4 text-base sm:text-lg">
            Berçário nació con la convicción de que la tecnología debe ser un puente y no un obstáculo para la berraquera del comerciante tradicional.
          </p>
        </div>

        {/* STORY & MISSION SECTION */}
        <section className="mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Story text (left) */}
            <Reveal duration={800} yOffset={30}>
              <div className="flex flex-col gap-6 max-w-xl">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                  Nuestra Trayectoria
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  En el Norte de Santander, la berraquera y las ganas de salir adelante se ven en cada taller de calzado, cada almacén textil y cada distribuidora. Sin embargo, en el mundo digitalizado de hoy, crear y mantener un sitio web tradicional resulta extremadamente costoso y complejo para los pequeños y medianos mayoristas.
                </p>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Por eso fundamos <strong>Berçário</strong> (que significa "Nido" en portugués). Queremos ser el espacio que acoge, cuida y proyecta el crecimiento digital de los empresarios de nuestra región, entregándoles una herramienta modular intuitiva que les permita estar en línea en 10 minutos con catálogos actualizados y un link propio profesional.
                </p>
                
                {/* Mission / Vision Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                  <div className="border border-border/80 p-5 rounded-xl bg-card">
                    <h3 className="font-serif font-bold text-foreground mb-2 text-sm uppercase tracking-wider">Misión</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Democratizar la digitalización comercial de los mayoristas en las regiones colombianas, eliminando barreras de costo y conocimiento técnico.
                    </p>
                  </div>
                  <div className="border border-border/80 p-5 rounded-xl bg-card">
                    <h3 className="font-serif font-bold text-foreground mb-2 text-sm uppercase tracking-wider">Visión</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Ser la plataforma líder de comercio electrónico regional en Colombia para el año 2028, empoderando a miles de mayoristas de calzado y moda.
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Visual card represent (right) */}
            <Reveal duration={900} yOffset={40} delay={150}>
              <div className="relative p-8 border border-border bg-linear-to-tr from-accent/20 to-secondary/40 rounded-2xl flex flex-col gap-6 justify-center items-start shadow-xl">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-foreground">¿Por qué Berçário?</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  No vendemos software costoso ni plantillas genéricas. Construimos un ecosistema diseñado para las particularidades del comercio mayorista. Nuestra promesa es el soporte local y la simpleza de uso.
                </p>
                <div className="flex flex-col gap-3 w-full border-t border-border/60 pt-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> Creado en Cúcuta para Colombia
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> Soporte uno a uno vía WhatsApp
                  </div>
                </div>
              </div>
            </Reveal>

          </div>
        </section>

        {/* PROPOSE VALUE VALUES */}
        <section className="py-16 bg-secondary/10 border-y border-border/50 mb-24 rounded-2xl">
          <div className="max-w-6xl mx-auto px-6">
            <Reveal duration={700} yOffset={25}>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground text-center mb-12">
                Nuestros Valores Fundamentales
              </h2>
            </Reveal>

            <RevealStagger selector=".value-card" delay={120}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {coreValues.map((val, idx) => {
                  const Icon = val.icon
                  return (
                    <Card
                      key={idx}
                      className="value-card p-6 border-border/80 flex flex-col gap-3 bg-card hover:shadow-md transition-shadow"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-serif font-bold text-foreground text-base">{val.title}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{val.desc}</p>
                    </Card>
                  )
                })}
              </div>
            </RevealStagger>
          </div>
        </section>

        {/* ENGINEERING TEAM SECTION */}
        <section>
          <Reveal duration={750} yOffset={25}>
            <div className="text-center max-w-3xl mx-auto mb-12">
              <Cpu className="h-8 w-8 text-primary mx-auto mb-2" />
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                El Equipo detrás del Nido
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base mt-2">
                Ingenieros e innovadores dedicados a potenciar a los fabricantes de la región.
              </p>
            </div>
          </Reveal>

          <RevealStagger selector=".team-card" delay={150}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {engineeringTeam.map((member, idx) => (
                <Card
                  key={idx}
                  className="team-card border-border/80 p-6 flex flex-col justify-between gap-6 bg-card hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col gap-4">
                    <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center font-bold text-base text-primary shrink-0">
                      {member.avatar}
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-foreground text-base">{member.name}</h3>
                      <p className="text-xs text-primary font-medium">{member.role}</p>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed italic">
                      "{member.bio}"
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground border-t border-border/40 pt-4">
                    <Code2 className="h-4 w-4 text-primary" />
                    <span>Equipo de Ingeniería</span>
                  </div>
                </Card>
              ))}
            </div>
          </RevealStagger>
        </section>

      </div>
    </div>
  )
}
