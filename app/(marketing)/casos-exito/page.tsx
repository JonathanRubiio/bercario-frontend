'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Reveal, RevealStagger } from '@/components/ui/scroll-reveal'
import { Loader2 } from 'lucide-react'
import {
  TrendingUp,
  Eye,
  ShoppingBag,
  ArrowRight,
  Bookmark,
  Calendar,
  User,
  Quote,
} from 'lucide-react'
import Link from 'next/link'
import { marketingService, type SuccessStory, type BlogPost } from '@/lib/api/services/marketing'

const fallbackSuccessStories = [
  {
    id: '1',
    merchant: 'Calzado La Frontera',
    location: 'Cúcuta',
    owner: 'Héctor Delgado',
    niche: 'Zapatos y Marroquinería',
    metric: '12.000+',
    metricLabel: 'Visitas mensuales al catálogo',
    growth: '+38%',
    growthLabel: 'en pedidos recibidos',
    quote: 'Publicar nuestro catálogo de calzado mayorista en Berçário nos permitió conectar con 500+ tenderos de Pamplona, Ocaña y Bucaramanga sin pagar costosos desarrolladores.',
    avatar: 'CF',
  },
  {
    id: '2',
    merchant: 'Modas El Progreso',
    location: 'Atalaya, Cúcuta',
    owner: 'Rosaura Beltrán',
    niche: 'Confección y Ropa Femenina',
    metric: '4.800+',
    metricLabel: 'Interacciones de WhatsApp',
    growth: '2.5x',
    growthLabel: 'ahorro de tiempo de atención',
    quote: 'Mis clientas de Arauca y Arauquita solían demorarse horas preguntándome precios por WhatsApp. Ahora ven mi link de Berçário y me envían el pedido listo.',
    avatar: 'MP',
  },
  {
    id: '3',
    merchant: 'Marroquinería Santander',
    location: 'Villa del Rosario',
    owner: 'Camilo Jaimes',
    niche: 'Bolsos y Accesorios de Cuero',
    metric: '850+',
    metricLabel: 'Mayoristas registrados',
    growth: '+22%',
    growthLabel: 'de incremento en ticket promedio',
    quote: 'La landing es súper rápida y se ve impecable en móviles. En esta región con señal inestable, la velocidad de carga es crucial para cerrar ventas.',
    avatar: 'MS',
  },
]

const fallbackBlogPosts = [
  {
    id: '1',
    title: 'Cómo digitalizar tu catálogo mayorista sin perder el trato humano',
    excerpt: 'Aprende a estructurar tus categorías de productos y precios al por mayor para facilitar la compra digital manteniendo el contacto directo por WhatsApp.',
    date: 'Julio 10, 2026',
    author: 'Jonathan Rubio',
    readTime: '5 min de lectura',
    category: 'Estrategia',
  },
  {
    id: '2',
    title: '5 claves de SEO Local para que tenderos de todo el país te encuentren en Google',
    excerpt: 'Guía práctica para posicionar tu bodega o fábrica mayorista en Cúcuta en las búsquedas locales. Trucos de palabras clave y optimización técnica.',
    date: 'Julio 02, 2026',
    author: 'Valeria Solano',
    readTime: '7 min de lectura',
    category: 'SEO',
  },
  {
    id: '3',
    title: 'El poder de las Landings Modulares: Por qué no necesitas una web compleja',
    excerpt: 'Descubre por qué las páginas de aterrizaje sencillas y rápidas convierten un 40% más que las tiendas virtuales tradicionales llenas de opciones confusas.',
    date: 'Junio 26, 2026',
    author: 'Mateo Cárdenas',
    readTime: '4 min de lectura',
    category: 'Diseño UX',
  },
]

export default function SuccessStoriesPage() {
  const [successStories, setSuccessStories] = useState<SuccessStory[]>([])
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [storiesData, postsData] = await Promise.all([
          marketingService.getSuccessStories(),
          marketingService.getBlogPosts(),
        ])
        setSuccessStories(storiesData && storiesData.length > 0 ? storiesData : fallbackSuccessStories)
        setBlogPosts(postsData && postsData.length > 0 ? postsData : fallbackBlogPosts)
      } catch (err) {
        console.error('Error fetching marketing data, using fallbacks:', err)
        setSuccessStories(fallbackSuccessStories)
        setBlogPosts(fallbackBlogPosts)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-background gap-3">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <p className="text-xs text-muted-foreground animate-pulse">Cargando casos de éxito y blog...</p>
      </div>
    )
  }

  return (
    <div className="py-12 md:py-20 bg-background overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Title Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="rounded-full mb-3 px-3 py-1 text-xs">
            Casos de Éxito
          </Badge>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            El impacto real de las landings Berçário
          </h1>
          <p className="text-muted-foreground mt-4 text-base sm:text-lg">
            Descubre las historias de los mayoristas y fabricantes locales que han transformado su canal de distribución digital.
          </p>
        </div>

        {/* MERCHANT SUCCESS STORIES SECTION */}
        <section className="mb-24">
          <Reveal duration={750} yOffset={25}>
            <div className="text-center mb-12">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                Métricas de Éxito Regionales
              </h2>
              <p className="text-muted-foreground mt-2 text-sm">
                Resultados obtenidos por comercios reales usando nuestra infraestructura modular.
              </p>
            </div>
          </Reveal>

          <RevealStagger selector=".story-card" delay={150}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {successStories.map((story, idx) => (
                <Card
                  key={idx}
                  className="story-card border border-border/80 bg-card p-6 flex flex-col justify-between gap-6 shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="space-y-4">
                    {/* Header profile info */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center font-bold text-sm text-primary">
                        {story.avatar}
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-foreground text-sm sm:text-base">{story.merchant}</h3>
                        <p className="text-xs text-muted-foreground">{story.location} · {story.owner}</p>
                      </div>
                    </div>

                    <Badge variant="secondary" className="text-[10px] uppercase font-bold py-0.5 px-2 bg-secondary text-secondary-foreground border border-border/50">
                      {story.niche}
                    </Badge>

                    {/* Testimonial Quote */}
                    <div className="relative pt-2 border-t border-border/30">
                      <Quote className="absolute top-1 left-0 h-6 w-6 text-primary/10 -z-10" />
                      <p className="text-xs sm:text-sm text-muted-foreground italic leading-relaxed pl-3">
                        "{story.quote}"
                      </p>
                    </div>
                  </div>

                  {/* Impact Stats */}
                  <div className="grid grid-cols-2 gap-4 bg-secondary/30 p-4 rounded-xl border border-border/40 text-center">
                    <div>
                      <p className="font-serif text-lg sm:text-xl font-bold text-primary flex items-center justify-center gap-1">
                        <Eye className="h-4 w-4 text-primary shrink-0" />
                        {story.metric}
                      </p>
                      <p className="text-[10px] text-muted-foreground leading-tight mt-1">{story.metricLabel}</p>
                    </div>
                    <div>
                      <p className="font-serif text-lg sm:text-xl font-bold text-emerald-600 flex items-center justify-center gap-1">
                        <TrendingUp className="h-4 w-4 text-emerald-600 shrink-0" />
                        {story.growth}
                      </p>
                      <p className="text-[10px] text-muted-foreground leading-tight mt-1">{story.growthLabel}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </RevealStagger>
        </section>

        {/* DIGITAL MARKETING BLOG SECTION */}
        <section className="border-t border-border/60 pt-20">
          <Reveal duration={750} yOffset={25}>
            <div className="text-center mb-12">
              <Bookmark className="h-8 w-8 text-primary mx-auto mb-2" />
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                Blog de Marketing y Digitalización
              </h2>
              <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                Artículos, consejos y guías diseñados para potenciar el canal mayorista.
              </p>
            </div>
          </Reveal>

          <RevealStagger selector=".blog-card" delay={120}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogPosts.map((post, idx) => (
                <Card
                  key={idx}
                  className="blog-card border border-border/80 bg-card hover:border-primary/40 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between h-full"
                >
                  <div className="p-6 space-y-4">
                    {/* Category Label */}
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {post.category}
                    </span>
                    
                    {/* Article title */}
                    <h3 className="font-serif font-bold text-foreground text-base sm:text-lg leading-snug hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    
                    {/* Article excerpt */}
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Metadata and footer link */}
                  <div className="px-6 pb-6 pt-4 border-t border-border/30 flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{post.date}</span>
                    </div>
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
