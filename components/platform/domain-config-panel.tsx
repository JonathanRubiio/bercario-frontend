'use client'

import { useState, useEffect } from 'react'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { domainService } from '../../lib/api/services/domain'
import { animateSelector } from '../../hooks/use-anime'
import { Globe, RefreshCw, CheckCircle2, ShieldAlert, Copy, ExternalLink, Loader2 } from 'lucide-react'

export function DomainConfigPanel() {
  const [customDomain, setCustomDomain] = useState('')
  const [subdomain, setSubdomain] = useState('')
  
  const [config, setConfig] = useState<{
    customDomain: string | null
    subdomain: string | null
    domainVerified: boolean
  } | null>(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // 1. Cargar configuración de dominios al montar
  useEffect(() => {
    fetchDomainConfig()
  }, [])

  async function fetchDomainConfig() {
    try {
      setLoading(true)
      const data = await domainService.getDomainConfig()
      setConfig(data)
      if (data.customDomain) setCustomDomain(data.customDomain)
      if (data.subdomain) setSubdomain(data.subdomain.split('.')[0]) // Mostrar solo la sección editable
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // 2. Guardar dominio o subdominio
  async function handleLinkDomain(e: React.FormEvent) {
    e.preventDefault()
    try {
      setSaving(true)
      setMessage(null)
      const formattedSubdomain = subdomain ? subdomain.trim() : null
      const formattedDomain = customDomain ? customDomain.trim() : null

      const updated = await domainService.linkDomain({
        customDomain: formattedDomain,
        subdomain: formattedSubdomain,
      })

      setConfig(updated)
      setMessage({ type: 'success', text: 'Configuración guardada. Procede a configurar tus registros DNS.' })

      // Animar entrada de las instrucciones DNS
      setTimeout(() => {
        animateSelector('.animate-dns-instructions', {
          opacity: [0, 1],
          translateY: [15, 0],
          duration: 400,
          easing: 'easeOutQuad'
        })
      }, 50)
    } catch (err: any) {
      console.error(err)
      setMessage({ type: 'error', text: err?.message || 'Error al guardar los dominios.' })
    } finally {
      setSaving(false)
    }
  }

  // 3. Trigger verificación de DNS con Animación de Transición Verde Elástica (Anime.js)
  async function handleVerifyDNS() {
    try {
      setVerifying(true)
      setMessage(null)
      const res = await domainService.verifyDomain()

      if (res.success && res.domainVerified) {
        setConfig((prev) => prev ? { ...prev, domainVerified: true } : null)
        setMessage({ type: 'success', text: '¡Excelente! Tu dominio ha sido verificado con éxito y tu certificado SSL se está generando.' })

        // Animación elástica de celebración verde
        animateSelector('#dns-verified-success-box', {
          scale: [0.8, 1.05, 0.98, 1.02, 1],
          borderColor: ['#e2e8f0', '#10b981'],
          backgroundColor: ['rgba(255, 255, 255, 0)', 'rgba(16, 185, 129, 0.04)'],
          duration: 1200,
          easing: 'easeOutElastic(1, .5)',
        })
      } else {
        setMessage({ type: 'error', text: res.message || 'La verificación falló. Revisa que los registros DNS se hayan propagado.' })
      }
    } catch (err: any) {
      console.error(err)
      setMessage({ type: 'error', text: err?.message || 'Error durante la verificación DNS.' })
    } finally {
      setVerifying(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <Card className="max-w-3xl mx-auto p-6 border border-border/50 rounded-2xl shadow-sm bg-card space-y-6">
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <div className="p-2 rounded-xl bg-primary/10 text-primary">
          <Globe className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-serif text-lg font-semibold text-foreground">Dominios y SSL bajo demanda</h2>
          <p className="text-xs text-muted-foreground">Configura un dominio personalizado o subdominio para tu landing page con certificado SSL automático.</p>
        </div>
      </div>

      <form onSubmit={handleLinkDomain} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Subdominio gratuito */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">Subdominio Gratuito</label>
          <div className="flex items-center">
            <Input
              value={subdomain}
              onChange={(e) => setSubdomain(e.target.value)}
              placeholder="mi-marca"
              className="rounded-l-xl border-r-0 rounded-r-none text-xs"
            />
            <span className="bg-secondary border border-input border-l-0 rounded-r-xl px-3 py-2 text-xs text-muted-foreground select-none">
              .bercario.co
            </span>
          </div>
        </div>

        {/* Dominio propio */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">Dominio Personalizado</label>
          <Input
            value={customDomain}
            onChange={(e) => setCustomDomain(e.target.value)}
            placeholder="www.mi-marca.com o mi-marca.com"
            className="rounded-xl text-xs"
          />
        </div>

        <div className="md:col-span-2 flex justify-end">
          <Button type="submit" disabled={saving} className="rounded-full text-xs px-5">
            {saving ? 'Guardando...' : 'Guardar y Configurar DNS'}
          </Button>
        </div>
      </form>

      {message && (
        <div className={`p-3 rounded-xl border text-xs ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-destructive/5 text-destructive border-destructive/20'
        }`}>
          {message.text}
        </div>
      )}

      {/* Instrucciones de Configuración DNS */}
      {config?.customDomain && !config.domainVerified && (
        <Card className="animate-dns-instructions p-4 border border-dashed border-border bg-secondary/15 rounded-xl space-y-4">
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-foreground">Configuración DNS Pendiente</h3>
              <p className="text-[11px] text-muted-foreground">
                Inicia sesión en tu proveedor de dominio (GoDaddy, Namecheap, Cloudflare, etc.) e ingresa el siguiente registro DNS:
              </p>
            </div>
          </div>

          <div className="border border-border rounded-lg overflow-hidden bg-background text-xs">
            <div className="grid grid-cols-3 bg-secondary/50 p-2 border-b border-border font-semibold text-muted-foreground text-[10px] uppercase">
              <div>Tipo</div>
              <div>Host / Nombre</div>
              <div>Valor / Destino</div>
            </div>
            <div className="grid grid-cols-3 p-2 border-b border-border items-center">
              <div className="font-mono text-primary font-bold">
                {config?.customDomain?.startsWith('www.') ? 'CNAME' : 'A'}
              </div>
              <div className="font-mono">
                {config?.customDomain?.startsWith('www.') ? 'www' : '@'}
              </div>
              <div className="font-mono flex items-center justify-between gap-1">
                <span className="truncate">
                  {config?.customDomain?.startsWith('www.') ? 'domains.bercario.co' : '76.76.21.21'}
                </span>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(config?.customDomain?.startsWith('www.') ? 'domains.bercario.co' : '76.76.21.21')}
                  className="p-1 hover:bg-secondary rounded text-muted-foreground"
                >
                  <Copy className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <p className="text-[10px] text-muted-foreground">Nota: La propagación de DNS puede tardar desde unos minutos hasta 24 horas.</p>
            <Button
              type="button"
              onClick={handleVerifyDNS}
              disabled={verifying}
              variant="outline"
              className="rounded-full text-xs flex items-center gap-1.5"
            >
              {verifying ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" /> Verificando...
                </>
              ) : (
                <>
                  <RefreshCw className="h-3 w-3" /> Verificar DNS Ahora
                </>
              )}
            </Button>
          </div>
        </Card>
      )}

      {/* Pantalla de Dominio Activo y Seguro */}
      {config?.customDomain && config.domainVerified && (
        <Card
          id="dns-verified-success-box"
          className="p-5 border border-emerald-500 bg-emerald-500/5 rounded-xl flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-8 w-8 text-emerald-500 shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                Dominio Configurado y Seguro
              </h3>
              <p className="text-xs text-muted-foreground">
                Tu landing page está en vivo en{' '}
                <a
                  href={`https://${config.customDomain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-0.5 font-semibold"
                >
                  {config.customDomain} <ExternalLink className="h-3 w-3" />
                </a>
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 rounded-full">
            SSL ACTIVO
          </span>
        </Card>
      )}
    </Card>
  )
}
