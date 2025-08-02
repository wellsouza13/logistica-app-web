// Exporta o componente principal de rotas
export { AppRoutes } from './index.tsx';

// Exporta as constantes de rotas
export { ROUTES, PUBLIC_ROUTES, PROTECTED_ROUTES } from './constants';
export type { PublicRoute, ProtectedRoute, AppRoute } from './constants';

// Exporta os utilitários
export { isProtectedRoute, isPublicRoute, getDefaultRoute } from './utils'; 