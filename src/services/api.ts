import axios from 'axios';

// Configura la URL base para todas las peticiones
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Crea una instancia de axios con configuración predeterminada
const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a las peticiones
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el error es 401 (no autorizado), limpiamos el token y redirigimos al login
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
