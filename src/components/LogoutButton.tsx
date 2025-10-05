import { IonButton, IonIcon } from '@ionic/react';
import { logOutOutline } from 'ionicons/icons';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { ROUTES } from '../config/routes';
import { authService } from '../services/AuthService';

interface LogoutButtonProps {
  fill?: 'clear' | 'outline' | 'solid';
  expand?: 'full' | 'block';
  size?: 'small' | 'default' | 'large';
  className?: string;
  slot?: 'start' | 'end';
  [key: string]: any; // Permitir otras props de IonButton
}

const LogoutButton: React.FC<LogoutButtonProps> = ({
  fill = 'clear',
  expand,
  size = 'default',
  className,
  slot,
  ...otherProps
}) => {
  const history = useHistory();

  const handleLogout = () => {
    authService.logout();
    history.push(ROUTES.LOGIN);
  };

  return (
    <IonButton
      fill={fill}
      expand={expand}
      size={size}
      onClick={handleLogout}
      className={className}
      slot={slot}
      {...otherProps}
    >
      <IonIcon icon={logOutOutline} slot="start" />
      Cerrar Sesión
    </IonButton>
  );
};

export default LogoutButton;
