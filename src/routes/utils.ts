import { ROUTES } from './constants';

// Função para verificar se uma rota é protegida
export const isProtectedRoute = (path: string): boolean => {
  const protectedPaths = Object.values(ROUTES).filter(route => route !== ROUTES.LOGIN);
  return protectedPaths.includes(path as any);
};

// Função para verificar se uma rota é pública
export const isPublicRoute = (path: string): boolean => {
  return path === ROUTES.LOGIN;
};

// Função para obter a rota padrão baseada no status de autenticação
export const getDefaultRoute = (isAuthenticated: boolean): string => {
  return isAuthenticated ? ROUTES.DASHBOARD : ROUTES.LOGIN;
}; 