import api from './api';
import { Modulo } from '../types/api.types';

export const moduloService = {
  getModulosBySede: async (sedeId: string): Promise<Modulo[]> => {
    const response = await api.get<Modulo[]>(`/modulos/sede/${sedeId}`);
    return response.data;
  },

  getModuloById: async (id: string): Promise<Modulo> => {
    const response = await api.get<Modulo>(`/modulos/${id}`);
    return response.data;
  },

  createModulo: async (modulo: Partial<Modulo>): Promise<Modulo> => {
    const response = await api.post<Modulo>('/modulos', modulo);
    return response.data;
  },

  updateModulo: async (id: string, modulo: Partial<Modulo>): Promise<Modulo> => {
    const response = await api.put<Modulo>(`/modulos/${id}`, modulo);
    return response.data;
  },

  deleteModulo: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/modulos/${id}`);
    return response.data;
  }
};
