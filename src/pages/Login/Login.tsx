import {
  IonAlert,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import {
  eyeOffOutline,
  eyeOutline,
  lockClosedOutline,
  personOutline,
} from 'ionicons/icons';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import { authService, LoginCredentials } from '../../services/AuthService';
import './Login.css';

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const history = useHistory();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleInputChange =
    (field: keyof LoginFormData) => (event: CustomEvent) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.detail.value,
      }));
    };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = (): boolean => {
    if (!formData.email.trim()) {
      setAlertMessage('Por favor ingresa tu correo electrónico');
      setShowAlert(true);
      return false;
    }

    if (!formData.password.trim()) {
      setAlertMessage('Por favor ingresa tu contraseña');
      setShowAlert(true);
      return false;
    }

    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setAlertMessage('Por favor ingresa un correo electrónico válido');
      setShowAlert(true);
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const credentials: LoginCredentials = {
        email: formData.email,
        password: formData.password,
      };

      const response = await authService.login(credentials);

      if (response.success) {
        // Redirigir a la página principal después del login exitoso
        history.push(ROUTES.TAB1);
      } else {
        setAlertMessage(response.message || 'Error al iniciar sesión');
        setShowAlert(true);
      }
    } catch (error) {
      setAlertMessage('Error al iniciar sesión. Por favor intenta nuevamente.');
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setAlertMessage(
      'Funcionalidad de recuperación de contraseña próximamente disponible',
    );
    setShowAlert(true);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Iniciar Sesión</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="login-content">
        <div className="login-container">
          <IonCard className="login-card">
            <IonCardHeader>
              <IonCardTitle className="login-title">
                Bienvenido a FitiPlus
              </IonCardTitle>
              <IonText color="medium">
                <p className="login-subtitle">
                  Inicia sesión para acceder a tu cuenta
                </p>
              </IonText>
            </IonCardHeader>

            <IonCardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLogin();
                }}
              >
                <IonItem className="login-input-item">
                  <IonIcon icon={personOutline} slot="start" />
                  <IonLabel position="stacked">Correo Electrónico</IonLabel>
                  <IonInput
                    type="email"
                    value={formData.email}
                    onIonInput={handleInputChange('email')}
                    placeholder="tu@email.com"
                    required
                  />
                </IonItem>

                <IonItem className="login-input-item">
                  <IonIcon icon={lockClosedOutline} slot="start" />
                  <IonLabel position="stacked">Contraseña</IonLabel>
                  <IonInput
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onIonInput={handleInputChange('password')}
                    placeholder="Tu contraseña"
                    required
                  />
                  <IonButton
                    fill="clear"
                    slot="end"
                    onClick={togglePasswordVisibility}
                    className="password-toggle"
                  >
                    <IonIcon icon={showPassword ? eyeOffOutline : eyeOutline} />
                  </IonButton>
                </IonItem>

                <div className="forgot-password-container">
                  <IonButton
                    fill="clear"
                    size="small"
                    onClick={handleForgotPassword}
                    className="forgot-password-button"
                  >
                    ¿Olvidaste tu contraseña?
                  </IonButton>
                </div>

                <IonButton
                  expand="block"
                  onClick={handleLogin}
                  disabled={isLoading}
                  className="login-button"
                >
                  {isLoading ? (
                    <IonSpinner name="crescent" />
                  ) : (
                    'Iniciar Sesión'
                  )}
                </IonButton>
              </form>

              <div className="register-link-container">
                <IonText color="medium">
                  <p>¿No tienes una cuenta?</p>
                </IonText>
                <IonButton
                  fill="clear"
                  onClick={() => {
                    setAlertMessage(
                      'Funcionalidad de registro próximamente disponible',
                    );
                    setShowAlert(true);
                  }}
                  className="register-button"
                >
                  Regístrate aquí
                </IonButton>
              </div>
            </IonCardContent>
          </IonCard>
        </div>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Información"
          message={alertMessage}
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;
