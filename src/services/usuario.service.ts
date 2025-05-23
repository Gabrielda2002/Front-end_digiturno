import api from './api';
import { Usuario } from '../types/api.types';

export const usuarioService = {
  getAllUsuarios: async (): Promise<Usuario[]> => {
    const response = await api.get<Usuario[]>('/usuarios');
    return response.data;
  },

  getUsuarioById: async (id: string): Promise<Usuario> => {
    const response = await api.get<Usuario>(`/usuarios/${id}`);
    return response.data;
  },

  createUsuario: async (usuario: Partial<Usuario> & { password: string }): Promise<Usuario> => {
    const response = await api.post<Usuario>('/usuarios', usuario);
    return response.data;
  },

  updateUsuario: async (id: string, usuario: Partial<Usuario>): Promise<Usuario> => {
    const response = await api.put<Usuario>(`/usuarios/${id}`, usuario);
    return response.data;
  },

  changePassword: async (id: string, passwords: { password?: string; newPassword: string }): Promise<{ message: string }> => {
    const response = await api.put<{ message: string }>(`/usuarios/${id}/password`, passwords);
    return response.data;
  }
};
