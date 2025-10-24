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
} from '@ionic/react';
import {
  eyeOffOutline,
  eyeOutline,
  lockClosedOutline,
  logoFacebook,
  logoGoogle,
  personOutline,
} from 'ionicons/icons';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { API_CONFIG, getApiUrl } from '../../config/api';
import { ROUTES } from '../../config/routes';
import { authService, LoginCredentials } from '../../services/AuthService';
import './Login.css';

interface LoginFormData {
  email: string;
  password: string;
}

interface OnboardingProgress {
  currentStep: number;
  completedSteps: number[];
  isComplete: boolean;
  data: {
    goals?: string[];
    physicalData?: {
      weight: number;
      height: number;
      age: number;
      birthDate: string;
      gender: string;
    };
    medicalConditions?: {
      hasDiabetes: boolean;
      hasHypertension: boolean;
      hasHighCholesterol: boolean;
    };
    allergies?: string[];
  };
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

  const checkOnboardingProgress =
    async (): Promise<OnboardingProgress | null> => {
      try {
        const token = authService.getAuthToken();
        if (!token) {
          console.error('No se encontró el token');
          return null;
        }

        const response = await fetch(
          getApiUrl(API_CONFIG.ENDPOINTS.ONBOARDING_PROGRESS),
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          console.error('Error al consultar el progreso del onboarding');
          return null;
        }

        const data: OnboardingProgress = await response.json();
        return data;
      } catch (error) {
        console.error('Error en checkOnboardingProgress:', error);
        return null;
      }
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
        // Verificar el progreso del onboarding
        const progress = await checkOnboardingProgress();

        if (progress && progress.isComplete) {
          // Si completó el onboarding, ir a la pantalla principal
          history.push(ROUTES.TAB1);
        } else {
          // Si no ha completado el onboarding, ir a la presentación
          history.push(ROUTES.PRESENTATION);
        }
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

  const handleGoogleLogin = () => {
    setAlertMessage('Inicio de sesión con Google próximamente disponible');
    setShowAlert(true);
  };

  const handleFacebookLogin = () => {
    setAlertMessage('Inicio de sesión con Facebook próximamente disponible');
    setShowAlert(true);
  };

  return (
    <IonPage>
      <IonHeader></IonHeader>

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
                    className="login-password-toggle"
                    aria-label={
                      showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                    }
                  >
                    <IonIcon
                      icon={showPassword ? eyeOffOutline : eyeOutline}
                      aria-hidden="true"
                    />
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

              <div className="social-login-container">
                <div className="social-text">
                  <span>o continúa con</span>
                </div>

                <div className="social-buttons">
                  <IonButton
                    expand="block"
                    fill="outline"
                    onClick={handleGoogleLogin}
                    className="social-button google-button"
                  >
                    <IonIcon icon={logoGoogle} slot="start" />
                    Google
                  </IonButton>

                  <IonButton
                    expand="block"
                    fill="outline"
                    onClick={handleFacebookLogin}
                    className="social-button facebook-button"
                  >
                    <IonIcon icon={logoFacebook} slot="start" />
                    Facebook
                  </IonButton>
                </div>
              </div>

              <div className="register-link-container">
                <IonText color="medium">
                  <p>¿No tienes una cuenta?</p>
                </IonText>
                <IonButton
                  fill="clear"
                  onClick={() => history.push(ROUTES.REGISTER)}
                  className="login-register-button"
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
