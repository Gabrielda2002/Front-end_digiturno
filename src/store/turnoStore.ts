import { create } from 'zustand';
import { Turno } from '../types/api.types';
import { turnoService } from '../services/turno.service';

interface TurnoState {
  activeTurnos: Turno[];
  historialTurnos: Turno[];
  currentTurno: Turno | null;
  loading: boolean;
  error: string | null;
  fetchActiveTurnos: (sedeId: string) => Promise<void>;
  fetchTurnos: (sedeId: string, fecha?: string) => Promise<void>;
  createTurno: (turnoData: { sede_id: string; motivo_id: string; cedula: string }) => Promise<Turno | null>;
  updateTurnoStatus: (id: string, data: { estado: 'esperando' | 'llamando' | 'atendido' | 'cancelado' | 'derivado'; modulo_id?: string }) => Promise<Turno | null>;
  setCurrentTurno: (turno: Turno | null) => void;
}

export const useTurnoStore = create<TurnoState>((set, get) => ({
  activeTurnos: [],
  historialTurnos: [],
  currentTurno: null,
  loading: false,
  error: null,

  fetchActiveTurnos: async (sedeId: string) => {
    set({ loading: true, error: null });
    try {
      const turnos = await turnoService.getActiveTurnosBySede(sedeId);
      set({ activeTurnos: turnos, loading: false });
    } catch (error: any) {
      set({ error: error.message || 'Error al cargar turnos activos', loading: false });
    }
  },

  fetchTurnos: async (sedeId: string, fecha?: string) => {
    set({ loading: true, error: null });
    try {
      const turnos = await turnoService.getTurnosBySedeAndDate(sedeId, fecha);
      set({ historialTurnos: turnos, loading: false });
    } catch (error: any) {
      set({ error: error.message || 'Error al cargar historial de turnos', loading: false });
    }
  },

  createTurno: async (turnoData) => {
    set({ loading: true, error: null });
    try {
      const newTurno = await turnoService.createTurno(turnoData);
      set((state) => ({
        activeTurnos: [...state.activeTurnos, newTurno],
        loading: false,
      }));
      return newTurno;
    } catch (error: any) {
      set({ error: error.message || 'Error al crear turno', loading: false });
      return null;
    }
  },

  updateTurnoStatus: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const updatedTurno = await turnoService.updateTurnoStatus(id, data);
      
      // Actualizar en la lista de turnos activos o quitarlo si ya fue atendido o cancelado
      set((state) => {
        const isFinished = ['atendido', 'cancelado'].includes(updatedTurno.estado);
        
        return {
          activeTurnos: isFinished 
            ? state.activeTurnos.filter(t => t.id !== id)
            : state.activeTurnos.map(t => t.id === id ? updatedTurno : t),
          currentTurno: state.currentTurno?.id === id ? updatedTurno : state.currentTurno,
          historialTurnos: state.historialTurnos.map(t => t.id === id ? updatedTurno : t),
          loading: false,
        };
      });
      
      return updatedTurno;
    } catch (error: any) {
      set({ error: error.message || 'Error al actualizar estado del turno', loading: false });
      return null;
    }
  },

  setCurrentTurno: (turno) => {
    set({ currentTurno: turno });
  },
}));
