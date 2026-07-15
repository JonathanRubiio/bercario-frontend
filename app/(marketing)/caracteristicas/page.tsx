'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Reveal, RevealStagger } from '@/components/ui/scroll-reveal'
import {
  Palette,
  Type,
  Layout,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Sparkles,
  Layers,
  CheckCircle,
  HelpCircle,
  ShoppingBag,
  Phone,
  Eye,
  ArrowRight,
} from 'lucide-react'

// Color palettes for simulator
const demoPalettes = [
  { id: 'nido', name: 'Nido (Filtro Suave)', bg: 'bg-[#f5f3ef]', text: 'text-[#3a352f]', primary: 'bg-[#3a352f]', primaryText: 'text-[#f5f3ef]', accent: 'bg-[#d9c7a8]/30', border: 'border-[#3a352f]/10' },
  { id: 'arena', name: 'Arena Cálida', bg: 'bg-[#faf6f0]', text: 'text-[#4a3c30]', primary: 'bg-[#e0b088]', primaryText: 'text-[#4a3c30]', accent: 'bg-[#e0b088]/20', border: 'border-[#4a3c30]/10' },
  { id: 'bosque', name: 'Bosque Sereno', bg: 'bg-[#f2f5f1]', text: 'text-[#2f3d2c]', primary: 'bg-[#a7c4a0]', primaryText: 'text-[#2f3d2c]', accent: 'bg-[#a7c4a0]/20', border: 'border-[#2f3d2c]/10' },
  { id: 'pizarra', name: 'Pizarra Elegante', bg: 'bg-[#18181b]', text: 'text-[#f4f4f5]', primary: 'bg-[#a1a1aa]', primaryText: 'text-[#18181b]', accent: 'bg-[#27272a]', border: 'border-[#27272a]' },
  { id: 'neon_cyber', name: 'Cyber Neón', bg: 'bg-[#0f172a]', text: 'text-[#e2e8f0]', primary: 'bg-[#06b6d4]', primaryText: 'text-[#0f172a]', accent: 'bg-[#06b6d4]/10', border: 'border-[#1e293b]' },
]

const blocksInfo = [
  {
    icon: Sparkles,
    name: 'Hero Banner',
    desc: 'El gancho visual de tu web. Incluye tu logo, titular de alto impacto, subtítulo orientado a beneficios, imagen del negocio y botón de conversión.',
  },
  {
    icon: ShoppingBag,
    name: 'Catálogo de Productos',
    desc: 'Muestra tus productos en una grilla interactiva. Tus compradores pueden filtrar por categorías y ver precios mayoristas al instante.',
  },
  {
    icon: Layers,
    name: 'Sección Quiénes Somos',
    desc: 'Cuenta tu historia, tu origen en la región y resalta por qué los clientes deben confiar en tu marca antes que en la competencia.',
  },
  {
    icon: HelpCircle,
    name: 'Preguntas Frecuentes (FAQs)',
    desc: 'Un acordeón interactivo desplegable para resolver dudas sobre despachos nacionales, pedido mínimo, y métodos de pago de forma automática.',
  },
  {
    icon: Phone,
    name: 'Formulario de Contacto',
    desc: 'Formulario seguro y directo que envía las solicitudes de clientes interesados a tu bandeja de entrada o WhatsApp.',
  },
]

export default function FeaturesPage() {
  const router = useRouter()

  // Simulator state
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right'>('center')
  const [activePalette, setActivePalette] = useState('nido')
  const [buttonStyle, setButtonStyle] = useState<'rounded' | 'square' | 'pill'>('rounded')
  const [visibleSections, setVisibleSections] = useState({
    products: true,
    about: false,
    faq: true,
  })

  const currentPalette = demoPalettes.find((p) => p.id === activePalette) || demoPalettes[0]

  const buttonStyleClass =
    buttonStyle === 'rounded'
      ? 'rounded-lg'
      : buttonStyle === 'square'
        ? 'rounded-none'
        : 'rounded-full'

  const alignmentClass =
    alignment === 'left'
      ? 'text-left items-start'
      : alignment === 'right'
        ? 'text-right items-end'
        : 'text-center items-center'

  return (
    <div className="py-12 md:py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Title Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="rounded-full mb-3 px-3 py-1 text-xs">
            Cómo funciona
          </Badge>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Crea tu landing modular sin tocar código
          </h1>
          <p className="text-muted-foreground mt-4 text-base sm:text-lg">
            Olvídate de las interfaces confusas de WordPress. En Berçário construyes usando bloques pre-diseñados y estructurados para optimizar la conversión mayorista.
          </p>
        </div>

        {/* MOCK-UP WIX-STYLE SECTION */}
        <section className="mb-24">
          <Reveal duration={800} yOffset={35}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Simulator Options Panel (Left) */}
              <div className="lg:col-span-4 border border-border rounded-2xl bg-card p-6 flex flex-col justify-between shadow-lg">
                <div className="space-y-6">
                  <div className="flex items-center gap-2 pb-4 border-b border-border">
                    <Palette className="h-5 w-5 text-primary" />
                    <h2 className="font-serif text-lg font-bold text-foreground">Mini Editor Berçário</h2>
                  </div>

                  {/* 1. Alignment Option */}
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Alineación del Héroe</Label>
                    <div className="flex gap-1 bg-secondary/50 p-1 rounded-lg">
                      <Button
                        variant={alignment === 'left' ? 'secondary' : 'ghost'}
                        className="flex-1 rounded-md py-1.5 h-auto text-xs"
                        onClick={() => setAlignment('left')}
                      >
                        <AlignLeft className="h-4 w-4 mr-1" /> Izquierda
                      </Button>
                      <Button
                        variant={alignment === 'center' ? 'secondary' : 'ghost'}
                        className="flex-1 rounded-md py-1.5 h-auto text-xs"
                        onClick={() => setAlignment('center')}
                      >
                        <AlignCenter className="h-4 w-4 mr-1" /> Centro
                      </Button>
                      <Button
                        variant={alignment === 'right' ? 'secondary' : 'ghost'}
                        className="flex-1 rounded-md py-1.5 h-auto text-xs"
                        onClick={() => setAlignment('right')}
                      >
                        <AlignRight className="h-4 w-4 mr-1" /> Derecha
                      </Button>
                    </div>
                  </div>

                  {/* 2. Color Palette */}
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Paleta de Colores</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {demoPalettes.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => setActivePalette(p.id)}
                          className={`flex items-center gap-2 p-2 rounded-lg border text-left text-xs transition-all ${
                            activePalette === p.id
                              ? 'border-primary bg-primary/5 ring-1 ring-primary'
                              : 'border-border bg-transparent hover:bg-secondary/40'
                          }`}
                        >
                          <span className={`w-4 h-4 rounded-full border border-black/10 shrink-0 ${p.bg}`} />
                          <span className="truncate font-medium text-foreground">{p.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 3. Button Styles */}
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Bordes de Botón</Label>
                    <div className="flex gap-1 bg-secondary/50 p-1 rounded-lg">
                      {['rounded', 'square', 'pill'].map((style) => (
                        <Button
                          key={style}
                          variant={buttonStyle === style ? 'secondary' : 'ghost'}
                          className="flex-1 rounded-md py-1.5 h-auto text-xs capitalize"
                          onClick={() => setButtonStyle(style as any)}
                        >
                          {style === 'rounded' ? 'Redondeado' : style === 'square' ? 'Recto' : 'Píldora'}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* 4. Blocks Toggle */}
                  <div className="space-y-3 pt-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Secciones Visibles</Label>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">Catálogo de Productos</span>
                      </div>
                      <Switch
                        checked={visibleSections.products}
                        onCheckedChange={(checked) =>
                          setVisibleSections({ ...visibleSections, products: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Layers className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">Sección Sobre Nosotros</span>
                      </div>
                      <Switch
                        checked={visibleSections.about}
                        onCheckedChange={(checked) =>
                          setVisibleSections({ ...visibleSections, about: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">Preguntas Frecuentes (FAQs)</span>
                      </div>
                      <Switch
                        checked={visibleSections.faq}
                        onCheckedChange={(checked) =>
                          setVisibleSections({ ...visibleSections, faq: checked })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-border mt-6 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Sparkles className="h-4 w-4 text-primary shrink-0" />
                    <span>Esto es una simulación visual ligera. El constructor real te permite cambiar imágenes, productos y textos.</span>
                  </div>
                  <Button
                    onClick={() => router.push('/login?signup=true')}
                    className="w-full rounded-full bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2"
                  >
                    Crear mi sitio real gratis
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Simulator Preview Viewport (Right) */}
              <div className="lg:col-span-8 border border-border rounded-2xl bg-secondary/30 p-4 sm:p-8 flex flex-col justify-start items-center relative overflow-hidden min-h-[500px]">
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs text-muted-foreground border-b border-border pb-2 px-2">
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                    <span>Previsualización en Vivo</span>
                  </div>
                  <span className="font-mono text-[10px] bg-secondary/80 px-2 py-0.5 rounded-md border border-border">
                    bercario.co/calzado-frontera
                  </span>
                </div>

                {/* Simulated Web View */}
                <div
                  className={`w-full mt-10 rounded-xl border shadow-lg transition-colors duration-300 max-w-2xl overflow-hidden flex flex-col ${currentPalette.bg} ${currentPalette.text} ${currentPalette.border}`}
                >
                  {/* Simulated Header */}
                  <div className={`h-12 border-b px-4 flex items-center justify-between text-xs font-semibold ${currentPalette.border}`}>
                    <span>CALZADO LA FRONTERA</span>
                    <span className={`px-3 py-1 rounded-full text-[10px] ${currentPalette.primary} ${currentPalette.primaryText}`}>
                      Catálogo
                    </span>
                  </div>

                  {/* Simulated Hero */}
                  <div className={`py-12 px-6 flex flex-col gap-4 border-b ${currentPalette.border} ${alignmentClass}`}>
                    <h3 className="font-serif text-2xl font-bold tracking-tight max-w-md leading-snug">
                      Catálogo Mayorista de Calzado en Cúcuta
                    </h3>
                    <p className="text-xs opacity-80 max-w-sm">
                      Distribuimos calzado al por mayor a nivel nacional con despachos inmediatos desde el Norte de Santander.
                    </p>
                    <button
                      className={`px-4 py-2 text-xs font-semibold shadow-xs hover:opacity-90 active:scale-[0.98] transition-all ${currentPalette.primary} ${currentPalette.primaryText} ${buttonStyleClass}`}
                    >
                      Ver Catálogo
                    </button>
                  </div>

                  {/* Simulated Products Section */}
                  {visibleSections.products && (
                    <div className={`p-6 border-b ${currentPalette.border}`}>
                      <h4 className="font-serif text-sm font-bold mb-4 uppercase tracking-wider">Productos Destacados</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className={`border rounded-lg p-2 flex flex-col gap-2 bg-card/60 ${currentPalette.border}`}>
                          <div className="bg-secondary/40 aspect-video rounded-md flex items-center justify-center text-[10px] text-muted-foreground font-mono">Tenis Blanco</div>
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold">Tenis Arena</span>
                            <span className="text-[10px] font-bold text-primary">$68.000</span>
                          </div>
                        </div>
                        <div className={`border rounded-lg p-2 flex flex-col gap-2 bg-card/60 ${currentPalette.border}`}>
                          <div className="bg-secondary/40 aspect-video rounded-md flex items-center justify-center text-[10px] text-muted-foreground font-mono">Bolso Cuero</div>
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold">Bolso Camel</span>
                            <span className="text-[10px] font-bold text-primary">$95.000</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Simulated About Section */}
                  {visibleSections.about && (
                    <div className={`p-6 border-b ${currentPalette.border}`}>
                      <h4 className="font-serif text-sm font-bold mb-2 uppercase tracking-wider">Nuestra Empresa</h4>
                      <p className="text-xs opacity-85 leading-relaxed">
                        Somos una empresa familiar con más de 15 años de trayectoria en Cúcuta. Surtimos tiendas de calzado y emprendedores locales con productos 100% colombianos de alta calidad.
                      </p>
                    </div>
                  )}

                  {/* Simulated FAQ Section */}
                  {visibleSections.faq && (
                    <div className="p-6 flex flex-col gap-3">
                      <h4 className="font-serif text-sm font-bold uppercase tracking-wider">Preguntas Frecuentes</h4>
                      <div className={`border rounded-lg p-3 text-xs bg-card/40 ${currentPalette.border}`}>
                        <div className="font-semibold flex justify-between">
                          <span>¿Cuál es el pedido mínimo?</span>
                          <span>+</span>
                        </div>
                        <p className="mt-1 opacity-75 text-[10px]">El pedido mínimo es de 12 unidades surtidas por referencia.</p>
                      </div>
                      <div className={`border rounded-lg p-3 text-xs bg-card/40 ${currentPalette.border}`}>
                        <div className="font-semibold flex justify-between">
                          <span>¿Hacen envíos nacionales?</span>
                          <span>+</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </Reveal>
        </section>

        {/* TECHNICAL CHARACTERISTICS DESCRIPTION */}
        <section>
          <Reveal duration={750} yOffset={25}>
            <div className="text-center max-w-3xl mx-auto mb-12">
              <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">
                Bloques de diseño
              </Badge>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                Todo lo que necesitas para tu presencia comercial
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base mt-2">
                Nuestros bloques modulares cubren cada aspecto de la persuasión digital.
              </p>
            </div>
          </Reveal>

          <RevealStagger selector=".feature-card" delay={120}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blocksInfo.map((block, idx) => {
                const Icon = block.icon
                return (
                  <Card key={idx} className="feature-card border border-border/80 p-6 flex flex-col gap-3 bg-card hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-serif font-bold text-foreground text-base">{block.name}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {block.desc}
                    </p>
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
