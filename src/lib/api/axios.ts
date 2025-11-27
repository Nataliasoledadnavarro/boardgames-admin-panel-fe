import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.response.use(
  response => response,
  (error: AxiosError<{ message?: string; error?: string; details?: string }>) => {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || error.response.data?.error;
      const details = error.response.data?.details;

      switch (status) {
        case 400:
          toast.error('Datos inválidos', {
            description: message || 'Verifica que todos los campos sean correctos',
          });
          break;
        case 404:
          toast.error('Recurso no encontrado', {
            description: message || 'El elemento que buscas no existe',
          });
          break;
        case 409:
          toast.error('No se puede eliminar', {
            description: 'Esta categoría tiene productos asociados.',
          });
          break;
        case 500:
          toast.error('Error del servidor', {
            description:
              message || details || 'Ocurrió un problema interno. Contacta al administrador.',
          });
          break;
        default:
          toast.error('Error en la operación', {
            description: message || 'Algo salió mal',
          });
      }
    } else if (error.request) {
      toast.error('Sin conexión', {
        description: 'No se pudo conectar con el servidor. Verifica tu conexión',
      });
    } else {
      toast.error('Error', {
        description: error.message || 'Ocurrió un error inesperado',
      });
    }

    return Promise.reject(error);
  }
);

export default api;
