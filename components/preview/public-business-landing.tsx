'use client'

import { Button } from '@/components/ui/button'
import type { BusinessProfile, LandingSection } from '@/lib/bercario-data'
import { Phone, Mail, MapPin, ShoppingBag } from 'lucide-react'

export function PublicBusinessLanding({
  profile,
  sections,
}: {
  profile: BusinessProfile
  sections: LandingSection[]
}) {
  return (
    <div className="w-full bg-background text-foreground">
      <div className="mx-auto max-w-4xl">
        {sections.map((section) => (
          <PreviewSection key={section.id} id={section.id} profile={profile} />
        ))}

        <footer className="border-t border-border px-6 py-8 text-center text-xs text-muted-foreground">
          Sitio generado con Berçário · {profile.name}
        </footer>
      </div>
    </div>
  )
}

function PreviewSection({
  id,
  profile,
}: {
  id: string
  profile: BusinessProfile
}) {
  if (id === 'banner') {
    return (
      <section className="relative">
        <div className="relative h-56 w-full overflow-hidden sm:h-72">
          <img
            src={profile.banner || '/placeholder.svg'}
            alt="Banner"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent" />
        </div>
        <div className="mx-auto -mt-12 flex max-w-3xl flex-col items-center px-6 text-center">
          <div className="h-20 w-20 overflow-hidden rounded-3xl border-4 border-background bg-card shadow-md">
            <img
              src={profile.logo || '/placeholder.svg'}
              alt={profile.name}
              className="h-full w-full object-cover"
            />
          </div>
          <h1 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-foreground">
            {profile.name}
          </h1>
          <p className="mt-1.5 text-muted-foreground">{profile.tagline}</p>
          <Button className="mt-5 rounded-full">
            <ShoppingBag className="mr-1 h-4 w-4" /> Ver catálogo
          </Button>
        </div>
      </section>
    )
  }

  if (id === 'about') {
    return (
      <section className="mx-auto max-w-3xl px-6 py-12">
        <h2 className="font-serif text-2xl font-semibold text-foreground">
          Quiénes somos
        </h2>
        <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
          {profile.description}
        </p>
      </section>
    )
  }

  if (id === 'products') {
    return (
      <section className="mx-auto max-w-4xl px-6 py-12">
        <h2 className="font-serif text-2xl font-semibold text-foreground">
          Catálogo
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {profile.products.length} productos disponibles al por mayor
        </p>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {profile.products.map((p) => (
            <div
              key={p.id}
              className="group overflow-hidden rounded-xl border border-border bg-card"
            >
              <div className="relative aspect-square overflow-hidden bg-secondary">
                <img
                  src={p.image || '/placeholder.svg'}
                  alt={p.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute left-2 top-2 rounded-full bg-card/90 px-2 py-0.5 text-[11px] font-semibold text-foreground backdrop-blur">
                  {p.price}
                </span>
              </div>
              <div className="p-3">
                <h3 className="truncate text-sm font-medium text-foreground">
                  {p.title}
                </h3>
                <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-muted-foreground">
                  {p.description}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {p.tags?.slice(0, 2).map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-medium text-accent-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (id === 'contact') {
    return (
      <section className="border-t border-border bg-secondary/40 px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-serif text-2xl font-semibold text-foreground">
            Contáctanos
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              { icon: Phone, value: profile.phone },
              { icon: Mail, value: profile.email },
              { icon: MapPin, value: profile.address },
            ].map((c, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 rounded-xl border border-border bg-card p-3.5 text-sm"
              >
                <c.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="truncate text-foreground">{c.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return null
}
