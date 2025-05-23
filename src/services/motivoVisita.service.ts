import api from './api';
import { MotivoVisita } from '../types/api.types';

export const motivoVisitaService = {
  getMotivosBySede: async (sedeId: string): Promise<MotivoVisita[]> => {
    const response = await api.get<MotivoVisita[]>(`/motivos-visita/sede/${sedeId}`);
    return response.data;
  },

  getMotivoById: async (id: string): Promise<MotivoVisita> => {
    const response = await api.get<MotivoVisita>(`/motivos-visita/${id}`);
    return response.data;
  },

  createMotivo: async (motivo: Partial<MotivoVisita>): Promise<MotivoVisita> => {
    const response = await api.post<MotivoVisita>('/motivos-visita', motivo);
    return response.data;
  },

  updateMotivo: async (id: string, motivo: Partial<MotivoVisita>): Promise<MotivoVisita> => {
    const response = await api.put<MotivoVisita>(`/motivos-visita/${id}`, motivo);
    return response.data;
  },

  deleteMotivo: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/motivos-visita/${id}`);
    return response.data;
  }
};
