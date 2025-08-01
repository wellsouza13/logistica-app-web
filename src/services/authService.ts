import { api } from './api';

export interface LoginPayload {
  matricula: string;
  senha: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
}

export interface DecodedToken {
  id: number;
  matricula: string;
  nome?: string;
  cargo?: string;
  iat: number;
  exp: number;
}

export const authService = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', payload);
    return response.data;
  },

  decodeToken(token: string): DecodedToken | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      return null;
    }
  },

  async logout(): Promise<void> {
    try {
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  },

  isAuthenticated(): boolean {
    try {
      const token = localStorage.getItem('token');
      if (!token) return false;
      
      const decodedToken = this.decodeToken(token);
      if (!decodedToken) return false;
      
      const currentTime = Math.floor(Date.now() / 1000);
      if (decodedToken.exp && decodedToken.exp < currentTime) {
        console.log('Token expirado');
        this.logout();
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      return false;
    }
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  getUser() {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      
      const decodedToken = this.decodeToken(token);
      if (!decodedToken) return null;
      
      return {
        id: decodedToken.id,
        matricula: decodedToken.matricula,
        nome: decodedToken.nome || `Usuário ${decodedToken.matricula}`,
        cargo: decodedToken.cargo || 'Funcionário'
      };
    } catch (error) {
      console.error('Erro ao obter dados do usuário:', error);
      return null;
    }
  }
}; 