import {  type FC, type ReactNode } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
  isAuthenticated?: boolean;
  requiredRole?: string;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ 
  children, 
  isAuthenticated: propIsAuthenticated, 
  requiredRole 
}) => {
  // Usamos la autenticación de las props si se proporciona, o del store si no
  const authStore = useAuthStore();
  const isAuthenticated = propIsAuthenticated !== undefined ? propIsAuthenticated : authStore.isAuthenticated;
  const { usuario } = authStore;
  const location = useLocation();

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si se requiere un rol específico, verificar que el usuario lo tenga
  if (requiredRole && usuario && usuario.rol !== requiredRole) {
    // Redirigir al dashboard si no tiene el rol requerido
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
