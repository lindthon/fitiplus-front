import { IonSpinner } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import { ROUTES } from '../config/routes';
import { authService } from '../services/AuthService';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Verificar si hay datos de autenticación en localStorage
        const hasStoredAuth = authService.isAuthenticated();

        if (hasStoredAuth) {
          // Verificar si el token sigue siendo válido
          const isTokenValid = authService.isTokenValid();

          if (isTokenValid) {
            setIsAuthenticated(true);
          } else {
            // Intentar renovar el token
            const tokenRefreshed = await authService.refreshToken();

            if (tokenRefreshed) {
              setIsAuthenticated(true);
            } else {
              // Token no válido y no se pudo renovar, limpiar sesión
              authService.logout();
              setIsAuthenticated(false);
            }
          }
        } else {
          // No hay datos de autenticación
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error verificando autenticación:', error);
        // En caso de error, limpiar sesión y redirigir a login
        authService.logout();
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthentication();
  }, [location.pathname]); // Re-evaluar cuando cambie la ruta

  // Mostrar spinner mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <IonSpinner name="crescent" style={{ color: 'white' }} />
      </div>
    );
  }

  // Si no está autenticado, redirigir a login
  if (!isAuthenticated) {
    return <Redirect to={ROUTES.LOGIN} />;
  }

  // Si está autenticado, mostrar el contenido protegido
  return <>{children}</>;
};

export default AuthGuard;
