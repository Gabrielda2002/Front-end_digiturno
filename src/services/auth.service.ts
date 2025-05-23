import type { AuthResponse, LoginCredentials, Usuario } from '../types/api.types';
import api from './api';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  verifyToken: async (): Promise<{ usuario: Usuario }> => {
    const response = await api.get<{ usuario: Usuario; message: string }>('/auth/verify');
    return { usuario: response.data.usuario };
  },

  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  saveUserData: (data: AuthResponse): void => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.usuario));
  },

  getUserData: (): Usuario | null => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }
};
