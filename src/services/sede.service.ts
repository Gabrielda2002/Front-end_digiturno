import api from './api';
import { Sede } from '../types/api.types';

export const sedeService = {
  getAllSedes: async (): Promise<Sede[]> => {
    const response = await api.get<Sede[]>('/sedes');
    return response.data;
  },

  getSedeById: async (id: string): Promise<Sede> => {
    const response = await api.get<Sede>(`/sedes/${id}`);
    return response.data;
  },

  createSede: async (sede: Partial<Sede>): Promise<Sede> => {
    const response = await api.post<Sede>('/sedes', sede);
    return response.data;
  },

  updateSede: async (id: string, sede: Partial<Sede>): Promise<Sede> => {
    const response = await api.put<Sede>(`/sedes/${id}`, sede);
    return response.data;
  },

  deleteSede: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/sedes/${id}`);
    return response.data;
  }
};
