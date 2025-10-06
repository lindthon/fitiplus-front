import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { ROUTES } from '../config/routes';
import { authService } from '../services/AuthService';

interface LoginGuardProps {
  children: React.ReactNode;
}

const LoginGuard: React.FC<LoginGuardProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    const checkIfAlreadyAuthenticated = () => {
      try {
        // Verificación básica - solo verificar si hay datos de autenticación
        // El backend se encargará de la validación real del token
        const isAuthenticated = authService.isAuthenticated();
        setShouldRedirect(isAuthenticated);
      } catch (error) {
        console.error('Error verificando autenticación en LoginGuard:', error);
        // En caso de error, permitir acceso a login
        setShouldRedirect(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkIfAlreadyAuthenticated();
  }, []);

  // Si está cargando, mostrar nada (o un spinner muy pequeño)
  if (isLoading) {
    return null;
  }

  // Si el usuario ya está autenticado, redirigir a la página principal
  if (shouldRedirect) {
    return <Redirect to={ROUTES.TAB1} />;
  }

  // Si no está autenticado, mostrar la página de login
  return <>{children}</>;
};

export default LoginGuard;
