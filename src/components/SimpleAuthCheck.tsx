import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { ROUTES } from '../config/routes';

interface SimpleAuthCheckProps {
  children: React.ReactNode;
}

const SimpleAuthCheck: React.FC<SimpleAuthCheckProps> = ({ children }) => {
  useEffect(() => {
    // Solo verificar localStorage una vez al cargar
    const userData = localStorage.getItem('fitiplus_user');
    const token = localStorage.getItem('fitiplus_token');

    // Si no hay datos, limpiar cualquier dato corrupto
    if (!userData || !token) {
      localStorage.removeItem('fitiplus_user');
      localStorage.removeItem('fitiplus_token');
    }
  }, []);

  // Verificar si hay datos de autenticación
  const userData = localStorage.getItem('fitiplus_user');
  const token = localStorage.getItem('fitiplus_token');

  // Si no hay datos, redirigir a login
  if (!userData || !token) {
    return <Redirect to={ROUTES.LOGIN} />;
  }

  // Si hay datos, mostrar el contenido
  return <>{children}</>;
};

export default SimpleAuthCheck;
