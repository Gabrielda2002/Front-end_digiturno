import api from './api';
import { Turno, TurnoEstado } from '../types/api.types';

export const turnoService = {
  getActiveTurnosBySede: async (sedeId: string): Promise<Turno[]> => {
    const response = await api.get<Turno[]>(`/turnos/activos/sede/${sedeId}`);
    return response.data;
  },

  getTurnosBySedeAndDate: async (sedeId: string, fecha?: string): Promise<Turno[]> => {
    const query = fecha ? `?fecha=${fecha}` : '';
    const response = await api.get<Turno[]>(`/turnos/sede/${sedeId}${query}`);
    return response.data;
  },

  createTurno: async (turnoData: { sede_id: string; motivo_id: string; cedula: string }): Promise<Turno> => {
    const response = await api.post<Turno>('/turnos', turnoData);
    return response.data;
  },

  updateTurnoStatus: async (id: string, data: { estado: TurnoEstado; modulo_id?: string }): Promise<Turno> => {
    const response = await api.put<Turno>(`/turnos/${id}/estado`, data);
    return response.data;
  }
};
