import type { AxiosInstance } from 'axios';

export const setupInterceptors = (api: AxiosInstance) => {
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      console.log('Requisição enviada:', config);
      return config;
    },
    (error) => {
      console.error('Erro na requisição:', error);
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => {
      console.log('Resposta recebida:', response);
      return response;
    },
    (error) => {
      console.error('Erro na resposta:', error);
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      
      return Promise.reject(error);
    }
  );
}; 