// Cliente API con autenticación integrada
import axios from 'axios';
import { getIdToken } from './auth';

/**
 * Crear una instancia de axios con interceptores para agregar el token de autenticación
 */
const apiClient = axios.create({
  baseURL: typeof window !== 'undefined' ? window.location.origin : '',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token de autenticación a cada request
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await getIdToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error al obtener el token de autenticación:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Si el error es 401 (no autorizado), redirigir al login
    if (error.response?.status === 401) {
      // Limpiar cualquier token almacenado
      if (typeof window !== 'undefined') {
        window.location.href = '/admin';
      }
    }
    
    // Mejorar mensajes de error
    if (error.response?.data?.message) {
      error.message = error.response.data.message;
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;

