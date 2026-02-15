import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { ROUTES } from '../config/routes';
import { authService } from '../services/AuthService';

interface SimpleAuthCheckProps {
  children: React.ReactNode;
}

const SimpleAuthCheck: React.FC<SimpleAuthCheckProps> = ({ children }) => {
  useEffect(() => {
    // No limpiar storage aquí; solo asegurarse de que authService se inicialice.
    // authService ya carga desde storage en su constructor.
  }, []);

  // Verificar si hay datos de autenticación vía authService (ya rehidratado)
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    return <Redirect to={ROUTES.LOGIN} />;
  }

  // Si hay datos, mostrar el contenido
  return <>{children}</>;
};

export default SimpleAuthCheck;
