'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { leadsService, type Lead } from '@/lib/api/services/leads'
import { CheckCircle2, XCircle, Clock, MapPin, Mail, MessageSquare, ShieldAlert, Sparkles, Loader2 } from 'lucide-react'

export function AdminLeadsView() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [successInfo, setSuccessInfo] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    fetchLeads()
  }, [])

  async function fetchLeads() {
    try {
      setLoading(true)
      const data = await leadsService.getLeads()
      setLeads(data)
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err?.message || 'Error al cargar las solicitudes.')
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusUpdate(id: string, status: 'ACCEPTED' | 'REJECTED', businessName: string, email: string) {
    try {
      setProcessingId(id)
      setErrorMsg(null)
      setSuccessInfo(null)
      await leadsService.updateLeadStatus(id, status)
      
      // Actualizar estado local
      setLeads((prev) =>
        prev.map((l) => (l.id === id ? { ...l, status } : l))
      )

      if (status === 'ACCEPTED') {
        setSuccessInfo(`¡Solicitud de "${businessName}" aprobada! Se ha creado la cuenta para "${email}" con la contraseña temporal "password1234".`)
      } else {
        setSuccessInfo(`Solicitud de "${businessName}" rechazada.`)
      }
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err?.message || 'Ocurrió un error al procesar la solicitud.')
    } finally {
      setProcessingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Cargando solicitudes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="h-7 w-7 text-primary" />
            Solicitudes de Registro
          </h1>
          <p className="text-sm text-muted-foreground">
            Revisa y gestiona los negocios locales que quieren formar parte del nido Berçário.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchLeads} className="rounded-full">
          Actualizar lista
        </Button>
      </div>

      {successInfo && (
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-sm text-emerald-600 flex items-start gap-2">
          <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
          <span>{successInfo}</span>
        </div>
      )}

      {errorMsg && (
        <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive flex items-start gap-2">
          <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {leads.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-2 shadow-none">
          <Clock className="h-10 w-10 text-muted-foreground/60 mb-3" />
          <h3 className="font-serif text-lg font-semibold">No hay solicitudes</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-xs">
            Las nuevas empresas que llenen el formulario aparecerán aquí en tiempo real.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {leads.map((lead) => {
            const dateStr = new Date(lead.createdAt).toLocaleDateString('es-CO', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })

            return (
              <Card key={lead.id} className="p-6 shadow-sm border-border">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="font-serif text-xl font-semibold text-foreground">
                        {lead.businessName}
                      </h3>
                      {lead.status === 'PENDING' && (
                        <Badge variant="secondary" className="bg-amber-500/15 text-amber-700 hover:bg-amber-500/20 rounded-full font-medium text-xs flex items-center gap-1 py-0.5 px-2.5">
                          <Clock className="h-3 w-3" /> Pendiente
                        </Badge>
                      )}
                      {lead.status === 'ACCEPTED' && (
                        <Badge variant="secondary" className="bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/20 rounded-full font-medium text-xs flex items-center gap-1 py-0.5 px-2.5">
                          <CheckCircle2 className="h-3 w-3" /> Aprobado
                        </Badge>
                      )}
                      {lead.status === 'REJECTED' && (
                        <Badge variant="secondary" className="bg-muted text-muted-foreground hover:bg-muted/80 rounded-full font-medium text-xs flex items-center gap-1 py-0.5 px-2.5">
                          <XCircle className="h-3 w-3" /> Rechazado
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground/80" />
                        <span>{lead.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground/80" />
                        <span>{lead.city}</span>
                      </div>
                    </div>

                    {lead.message && (
                      <div className="rounded-lg bg-secondary/40 p-3.5 text-sm text-foreground flex items-start gap-2.5">
                        <MessageSquare className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                        <span className="italic leading-relaxed">"{lead.message}"</span>
                      </div>
                    )}

                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <span>Recibida el:</span>
                      <span className="font-medium">{dateStr}</span>
                    </div>
                  </div>

                  {lead.status === 'PENDING' && (
                    <div className="flex items-center gap-2 shrink-0 self-end md:self-start">
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive border-border"
                        disabled={processingId !== null}
                        onClick={() => handleStatusUpdate(lead.id, 'REJECTED', lead.businessName, lead.email)}
                      >
                        {processingId === lead.id ? 'Procesando...' : 'Rechazar'}
                      </Button>
                      <Button
                        size="sm"
                        className="rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-4"
                        disabled={processingId !== null}
                        onClick={() => handleStatusUpdate(lead.id, 'ACCEPTED', lead.businessName, lead.email)}
                      >
                        {processingId === lead.id ? 'Aprobando...' : 'Aprobar'}
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
