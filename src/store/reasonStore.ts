import { motivoVisitaService } from "@/services/motivoVisita.service";
import { MotivoVisita } from "@/types/api.types";
import { create } from "zustand";

interface ReasonState {
    reasons: MotivoVisita[];
    currentReason: MotivoVisita | null;
    loading: boolean;
    error : string | null;
    fetchReasons: () => Promise<void>;
    fetchReasonsByHeadquarter: (headquarterId: string) => Promise<void>;
    setCurrentReason: (reason: MotivoVisita) => void;
    createReason: (reason: Partial<MotivoVisita>) => Promise<MotivoVisita | null>;
    updateReason: (id: string, reason: Partial<MotivoVisita>) => Promise<MotivoVisita | null>;
    deleteReason: (id: string) => Promise<boolean>;
}

export const useReasonStore = create<ReasonState>((set, get) => ({
    reasons: [],
    currentReason: null,
    loading: false,
    error: null,

    fetchReasons: async () => {
        set({ loading: true, error: null });
        try {
            const reasons = await motivoVisitaService.getAllMotivos();
            set({ reasons, loading: false });
        } catch (error: any) {
            set({error: error.message || 'Error al cargar motivos de visita', loading: false });
        }
    },

    fetchReasonsByHeadquarter: async (headquarterId: string) => {
        set({ loading: true, error: null });
        try {
            const reasons = await motivoVisitaService.getMotivosBySede(headquarterId);
            set({ reasons, loading: false });
        } catch (error: any) {
            set({ error: error.message || 'Error al cargar motivos de visita por sede', loading: false });
        }
    },

    setCurrentReason: (reason: MotivoVisita) => {
        set({ currentReason: reason });
    },

    createReason: async (reason: Partial<MotivoVisita>) => {
        set({ loading: true, error: null});
        try {
            
            const newReason = await motivoVisitaService.createMotivo(reason);
            set((state) => ({
                reasons: [...state.reasons, newReason],
                loading: false
            }));
            return newReason;
        } catch (error: any) {
            set({ error: error.message || 'Error al crear motivo de visita', loading: false });
            return null;
        }
    },

    updateReason: async (id: string, reason: Partial<MotivoVisita>) => {
        set({ loading: true, error: null});
        try {
            const updatedReason = await motivoVisitaService.updateMotivo(id, reason);
            set((state) => ({
                reasons: state.reasons.map(r => r.id === id ? updatedReason : r),
                currentReason: state.currentReason?.id === id ? updatedReason : state.currentReason,
                loading: false
            }));
            return updatedReason;
        } catch (error: any) {
            set({ error: error.message || 'Error al actualizar motivo de visita', loading: false });
            return null;
        }
    },

    deleteReason: async (id: string) => {
        set({ loading: true, error: null});
        try {
            await motivoVisitaService.deleteMotivo(id);
            set((state) => ({
                reasons: state.reasons.filter(r => r.id !== id),
                currentReason: state.currentReason?.id === id ? null : state.currentReason,
                loading: false
            }));
            return true;
        } catch (error: any) {
            set({ error: error.message || 'Error al eliminar motivo de visita', loading: false });
            return false;
        }
    }

}))