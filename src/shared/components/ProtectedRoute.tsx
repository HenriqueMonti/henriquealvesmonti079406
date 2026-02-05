/**
 * ProtectedRoute Component
 * Protege rotas que requerem autenticação
 */

import { Navigate } from 'react-router-dom';
import { authService } from '@/core/facades/auth.facade';
import type { JSX } from 'react';

interface ProtectedRouteProps {
  element: JSX.Element;
}

export function ProtectedRoute({ element }: ProtectedRouteProps) {
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return element;
}
