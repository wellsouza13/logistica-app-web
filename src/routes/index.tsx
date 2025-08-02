import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '../pages/Login';
import { Dashboard } from '../pages/Dashboard';
import { GestaoEstoque } from '../pages/GestaoEstoque';
import { authService } from '../services/authService';
import { ROUTES } from './constants';

// Componente para proteger rotas
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = authService.isAuthenticated();
  return isAuthenticated ? <>{children}</> : <Navigate to={ROUTES.LOGIN} replace />;
};

// Componente para redirecionar usuários já logados
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = authService.isAuthenticated();
  return isAuthenticated ? <Navigate to={ROUTES.DASHBOARD} replace /> : <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route 
        path={ROUTES.LOGIN} 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />

      {/* Rotas protegidas */}
      <Route 
        path={ROUTES.DASHBOARD} 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path={ROUTES.ESTOQUE} 
        element={
          <ProtectedRoute>
            <GestaoEstoque />
          </ProtectedRoute>
        } 
      />

      {/* Rota padrão - redireciona para login */}
      <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
      
      {/* Rota 404 - redireciona para dashboard se logado, senão para login */}
      <Route 
        path="*" 
        element={
          <ProtectedRoute>
            <Navigate to={ROUTES.DASHBOARD} replace />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}; 