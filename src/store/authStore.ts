import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/auth.service';
import type { Usuario } from '../types/api.types';

interface AuthState {
  usuario: Usuario | null;
  token: string | null;
  isAuthenticated: boolean;
  authChecked: boolean;
  error: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
  verifyToken: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({      usuario: null,
      token: null,
      isAuthenticated: false,
      authChecked: false,
      error: null,
      loading: false,

      login: async (username: string, password: string) => {
        set({ loading: true, error: null });
        try {
          const response = await authService.login({ username, password });
          authService.saveUserData(response);
          set({
            usuario: response.usuario,
            token: response.token,
            isAuthenticated: true,
            loading: false,
          });
          return true;
        } catch (error: any) {
          const message = error.response?.data?.message || 'Error al iniciar sesión';
          set({ error: message, loading: false });
          return false;
        }
      },

      logout: () => {
        authService.logout();
        set({ usuario: null, token: null, isAuthenticated: false });
      },      checkAuth: async () => {
        const token = authService.getToken();
        if (!token) {
          set({ isAuthenticated: false, authChecked: true });
          return false;
        }

        set({ loading: true });
        try {
          const { usuario } = await authService.verifyToken();
          set({ 
            usuario, 
            isAuthenticated: true, 
            token, 
            loading: false,
            authChecked: true 
          });
          return true;
        } catch (error) {
          authService.logout();
          set({ 
            usuario: null, 
            token: null, 
            isAuthenticated: false, 
            loading: false,
            authChecked: true 
          });
          return false;
        }
      },
      
      verifyToken: async () => {
        const token = authService.getToken();
        if (!token) {
          set({ isAuthenticated: false });
          return false;
        }

        set({ loading: true });
        try {
          const { usuario } = await authService.verifyToken();
          set({ usuario, isAuthenticated: true, token, loading: false });
          return true;
        } catch (error) {
          authService.logout();
          set({ usuario: null, token: null, isAuthenticated: false, loading: false });
          return false;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        usuario: state.usuario, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
