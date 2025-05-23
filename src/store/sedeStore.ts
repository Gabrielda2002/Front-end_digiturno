import { create } from 'zustand';
import { Sede } from '../types/api.types';
import { sedeService } from '../services/sede.service';

interface SedeState {
  sedes: Sede[];
  currentSede: Sede | null;
  loading: boolean;
  error: string | null;
  fetchSedes: () => Promise<void>;
  setCurrentSede: (sede: Sede) => void;
  createSede: (sede: Partial<Sede>) => Promise<Sede | null>;
  updateSede: (id: string, sede: Partial<Sede>) => Promise<Sede | null>;
  deleteSede: (id: string) => Promise<boolean>;
}

export const useSedeStore = create<SedeState>((set, get) => ({
  sedes: [],
  currentSede: null,
  loading: false,
  error: null,

  fetchSedes: async () => {
    set({ loading: true, error: null });
    try {
      const sedes = await sedeService.getAllSedes();
      set({ sedes, loading: false });
    } catch (error: any) {
      set({ error: error.message || 'Error al cargar sedes', loading: false });
    }
  },

  setCurrentSede: (sede: Sede) => {
    set({ currentSede: sede });
  },

  createSede: async (sede: Partial<Sede>) => {
    set({ loading: true, error: null });
    try {
      const newSede = await sedeService.createSede(sede);
      set((state) => ({ 
        sedes: [...state.sedes, newSede],
        loading: false 
      }));
      return newSede;
    } catch (error: any) {
      set({ error: error.message || 'Error al crear sede', loading: false });
      return null;
    }
  },

  updateSede: async (id: string, sede: Partial<Sede>) => {
    set({ loading: true, error: null });
    try {
      const updatedSede = await sedeService.updateSede(id, sede);
      set((state) => ({ 
        sedes: state.sedes.map(s => s.id === id ? updatedSede : s),
        currentSede: state.currentSede?.id === id ? updatedSede : state.currentSede,
        loading: false 
      }));
      return updatedSede;
    } catch (error: any) {
      set({ error: error.message || 'Error al actualizar sede', loading: false });
      return null;
    }
  },

  deleteSede: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await sedeService.deleteSede(id);
      set((state) => ({ 
        sedes: state.sedes.filter(s => s.id !== id),
        currentSede: state.currentSede?.id === id ? null : state.currentSede,
        loading: false 
      }));
      return true;
    } catch (error: any) {
      set({ error: error.message || 'Error al eliminar sede', loading: false });
      return false;
    }
  }
}));
