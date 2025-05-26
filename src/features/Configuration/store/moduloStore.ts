import { moduloService } from "@/services/modulo.service";
import { Modulo } from "@/types/api.types";
import { create } from "zustand";

interface ModuloState {
    modulos: Modulo[];
    currentModulo: Modulo | null;
    loading: boolean;
    error: string | null;
    fetchModulos: () => Promise<void>;
    setCurrentModulo: (modulo: Modulo) => void;
    createModulo: (modulo: Partial<Modulo>) => Promise<Modulo | null>;
    updateModulo: (id: string, modulo: Partial<Modulo>) => Promise<Modulo | null>;
    deleteModulo: (id: string) => Promise<boolean>;
}

export const useModuloStore = create<ModuloState>((set, get) => ({
    modulos: [],
    currentModulo: null,
    loading: false,
    error: null,

    fetchModulos: async () => {
        set({ loading: true, error: null });
        try {
            const modulos = await moduloService.getAllModulos();
            set({ modulos, loading: false });
        } catch (error: any) {
            set({ error: error.message || 'Error al cargar módulos', loading: false });
        }
    
},

setCurrentModulo: async (modulo: Modulo) => {
    set({ currentModulo: modulo });
},

createModulo: async (modulo: Partial<Modulo>) => {
    set({ loading: true, error: null });
    try {
        const newModulo = await moduloService.createModulo(modulo);
        set((state) => ({
            modulos: [...state.modulos, newModulo],
            loading: false
        }));
        return newModulo;
    } catch (error: any) {
        set({ error: error.message || 'Error al crear módulo', loading: false });
        return null;
    }
},

updateModulo: async (id: string, modulo: Partial<Modulo>) => {
    set({ loading: true, error: null });
    try {
        const updatedModulo = await moduloService.updateModulo(id, modulo);
        set((state) => ({
            modulos: state.modulos.map(m => m.id === id ? updatedModulo : m),
            currentModulo: state.currentModulo?.id === id ? updatedModulo : state.currentModulo,
            loading: false
        }));
        return updatedModulo;
    } catch (error: any) {
        set({ error: error.message || 'Error al actualizar módulo', loading: false });
        return null;
    }
},

deleteModulo: async (id: string) => {
    set({ loading: true, error: null });
    try {
        await moduloService.deleteModulo(id);
        set((state) => ({
            modulos: state.modulos.filter(m => m.id !== id),
            currentModulo: state.currentModulo?.id === id ? null : state.currentModulo,
            loading: false
        }));
        return true;
    } catch (error: any) {
        set({ error: error.message || 'Error al eliminar módulo', loading: false });
        return false;
    }
}

}));