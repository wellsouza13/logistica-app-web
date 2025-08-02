// Rotas públicas
export const PUBLIC_ROUTES = {
  LOGIN: '/login',
} as const;

// Rotas protegidas
export const PROTECTED_ROUTES = {
  DASHBOARD: '/dashboard',
  ESTOQUE: '/estoque',
  MOVIMENTACAO: '/movimentacao',
} as const;

// Todas as rotas
export const ROUTES = {
  ...PUBLIC_ROUTES,
  ...PROTECTED_ROUTES,
} as const;

// Tipos para as rotas
export type PublicRoute = typeof PUBLIC_ROUTES[keyof typeof PUBLIC_ROUTES];
export type ProtectedRoute = typeof PROTECTED_ROUTES[keyof typeof PROTECTED_ROUTES];
export type AppRoute = PublicRoute | ProtectedRoute; 