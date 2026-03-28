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
  mailOutline,
  personOutline,
} from 'ionicons/icons';
import { FC, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import { authService } from '../../services/AuthService';
import './Register.css';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: FC = () => {
  const history = useHistory();
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleInputChange =
    (field: keyof RegisterFormData) => (event: CustomEvent) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.detail.value,
      }));
    };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateForm = (): boolean => {
    if (!formData.firstName.trim()) {
      setAlertMessage('Por favor ingresa tu nombre');
      setShowAlert(true);
      return false;
    }

    if (!formData.lastName.trim()) {
      setAlertMessage('Por favor ingresa tu apellido');
      setShowAlert(true);
      return false;
    }

    if (!formData.email.trim()) {
      setAlertMessage('Por favor ingresa tu correo electrónico');
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

    if (!formData.password.trim()) {
      setAlertMessage('Por favor ingresa una contraseña');
      setShowAlert(true);
      return false;
    }

    if (formData.password.length < 6) {
      setAlertMessage('La contraseña debe tener al menos 6 caracteres');
      setShowAlert(true);
      return false;
    }

    if (!formData.confirmPassword.trim()) {
      setAlertMessage('Por favor confirma tu contraseña');
      setShowAlert(true);
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setAlertMessage('Las contraseñas no coinciden');
      setShowAlert(true);
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      console.log('📝 [REGISTER] Iniciando registro desde componente', {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        timestamp: new Date().toISOString(),
      });

      const result = await authService.register({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      if (result.success) {
        console.log('✅ [REGISTER] Registro exitoso desde componente', {
          userId: result.user?.id,
          userEmail: result.user?.email,
          userName: result.user?.firstName,
        });

        setAlertMessage('¡Cuenta creada exitosamente! Bienvenido a FitiPlus.');
        setShowAlert(true);

        // Redirigir a la presentación después del registro exitoso
        setTimeout(() => {
          history.push(ROUTES.PRESENTATION);
        }, 2000);
      } else {
        console.error('❌ [REGISTER] Error en registro desde componente', {
          error: result.message,
          statusCode: result.statusCode,
        });

        setAlertMessage(
          result.message ||
            'Error al crear la cuenta. Por favor intenta nuevamente.',
        );
        setShowAlert(true);
      }
    } catch (error) {
      console.error(
        '💥 [REGISTER] Error crítico en registro desde componente',
        {
          error: error instanceof Error ? error.message : 'Error desconocido',
          stack: error instanceof Error ? error.stack : undefined,
        },
      );

      setAlertMessage(
        'Error al crear la cuenta. Por favor intenta nuevamente.',
      );
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    history.push(ROUTES.LOGIN);
  };

  const handleGoogleRegister = () => {
    setAlertMessage('Registro con Google próximamente disponible');
    setShowAlert(true);
  };

  const handleFacebookRegister = () => {
    setAlertMessage('Registro con Facebook próximamente disponible');
    setShowAlert(true);
  };

  return (
    <IonPage>
      <IonHeader></IonHeader>

      <IonContent className="register-content">
        <div className="register-container">
          <IonCard className="register-card">
            <IonCardHeader>
              <IonCardTitle className="register-title">
                Únete a FitiPlus
              </IonCardTitle>
              <IonText color="medium">
                <p className="register-subtitle">
                  Crea tu cuenta para comenzar tu experiencia fitness
                </p>
              </IonText>
            </IonCardHeader>

            <IonCardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleRegister();
                }}
              >
                <IonItem className="register-input-item">
                  <IonIcon icon={personOutline} slot="start" />
                  <IonLabel position="stacked">Nombre</IonLabel>
                  <IonInput
                    type="text"
                    value={formData.firstName}
                    onIonInput={handleInputChange('firstName')}
                    placeholder="Tu nombre"
                    required
                  />
                </IonItem>

                <IonItem className="register-input-item">
                  <IonIcon icon={personOutline} slot="start" />
                  <IonLabel position="stacked">Apellido</IonLabel>
                  <IonInput
                    type="text"
                    value={formData.lastName}
                    onIonInput={handleInputChange('lastName')}
                    placeholder="Tu apellido"
                    required
                  />
                </IonItem>

                <IonItem className="register-input-item">
                  <IonIcon icon={mailOutline} slot="start" />
                  <IonLabel position="stacked">Correo Electrónico</IonLabel>
                  <IonInput
                    type="email"
                    value={formData.email}
                    onIonInput={handleInputChange('email')}
                    placeholder="tu@email.com"
                    required
                  />
                </IonItem>

                <IonItem className="register-input-item">
                  <IonIcon icon={lockClosedOutline} slot="start" />
                  <IonLabel position="stacked">Contraseña</IonLabel>
                  <IonInput
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onIonInput={handleInputChange('password')}
                    placeholder="Mínimo 6 caracteres"
                    required
                  />
                  <IonButton
                    fill="clear"
                    slot="end"
                    onClick={togglePasswordVisibility}
                    className="register-password-toggle"
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

                <IonItem className="register-input-item">
                  <IonIcon icon={lockClosedOutline} slot="start" />
                  <IonLabel position="stacked">Confirmar Contraseña</IonLabel>
                  <IonInput
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onIonInput={handleInputChange('confirmPassword')}
                    placeholder="Repite tu contraseña"
                    required
                  />
                  <IonButton
                    fill="clear"
                    slot="end"
                    onClick={toggleConfirmPasswordVisibility}
                    className="register-password-toggle"
                    aria-label={
                      showConfirmPassword
                        ? 'Ocultar confirmación de contraseña'
                        : 'Mostrar confirmación de contraseña'
                    }
                  >
                    <IonIcon
                      icon={showConfirmPassword ? eyeOffOutline : eyeOutline}
                      aria-hidden="true"
                    />
                  </IonButton>
                </IonItem>

                <IonButton
                  expand="block"
                  onClick={handleRegister}
                  disabled={isLoading}
                  className="register-button"
                >
                  {isLoading ? <IonSpinner name="crescent" /> : 'Crear Cuenta'}
                </IonButton>
              </form>

              <div className="social-login-container">
                <div className="divider">
                  <span>o regístrate con</span>
                </div>

                <div className="social-buttons">
                  <IonButton
                    expand="block"
                    fill="outline"
                    onClick={handleGoogleRegister}
                    className="social-button google-button"
                  >
                    <IonIcon icon={logoGoogle} slot="start" />
                    Google
                  </IonButton>

                  <IonButton
                    expand="block"
                    fill="outline"
                    onClick={handleFacebookRegister}
                    className="social-button facebook-button"
                  >
                    <IonIcon icon={logoFacebook} slot="start" />
                    Facebook
                  </IonButton>
                </div>
              </div>

              <div className="login-link-container">
                <IonText color="medium">
                  <p>¿Ya tienes una cuenta?</p>
                </IonText>
                <IonButton
                  fill="clear"
                  onClick={handleBackToLogin}
                  className="register-back-to-login-button"
                >
                  Inicia sesión aquí
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

export default Register;
