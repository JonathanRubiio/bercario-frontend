import { apiClient } from '../client'

export type LeadSubmission = {
  businessName: string
  email: string
  city: string
  message?: string
  website?: string // Honeypot field
}

export type Lead = {
  id: string
  businessName: string
  email: string
  city: string
  message?: string
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
  createdAt: string
  updatedAt: string
}

export const leadsService = {
  /**
   * Envía una solicitud de nuevo negocio (Lead) al backend, incluyendo honeypot contra bots.
   */
  submitLead: async (data: LeadSubmission): Promise<{ success: boolean; leadId?: string }> => {
    return apiClient.post<{ success: boolean; leadId?: string }>('/api/leads', data)
  },

  /**
   * Alias de submitLead para compatibilidad con landing-page.tsx
   */
  createLead: async (data: LeadSubmission): Promise<{ success: boolean; leadId?: string }> => {
    return apiClient.post<{ success: boolean; leadId?: string }>('/api/leads', data)
  },

  /**
   * Obtiene la lista completa de solicitudes (solo para administradores)
   */
  getLeads: async (): Promise<Lead[]> => {
    return apiClient.get<Lead[]>('/api/admin/leads')
  },

  /**
   * Actualiza el estado de una solicitud (aceptar/rechazar)
   */
  updateLeadStatus: async (id: string, status: 'ACCEPTED' | 'REJECTED'): Promise<Lead> => {
    return apiClient.put<Lead>(`/api/admin/leads/${id}`, { status })
  },
}

// Exportar también con el alias en singular para compatibilidad si se requiere
export const leadService = leadsService
