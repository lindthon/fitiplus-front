import { IonSpinner } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { ROUTES } from '../config/routes';
import { authService } from '../services/AuthService';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verificar si el usuario está autenticado
        const authenticated = authService.isAuthenticated();

        if (authenticated) {
          // Verificar si el token sigue siendo válido
          const tokenValid = authService.isTokenValid();

          if (tokenValid) {
            setIsAuthenticated(true);
          } else {
            // Intentar renovar el token
            const refreshed = await authService.refreshToken();
            setIsAuthenticated(refreshed);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error verificando autenticación:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

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

  if (!isAuthenticated) {
    return <Redirect to={ROUTES.LOGIN} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
