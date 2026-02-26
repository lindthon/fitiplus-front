import {
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonPage,
  IonSpinner,
  IonText,
} from '@ionic/react';
import {
  calendar,
  heart,
  logOut,
  person,
  settings,
  refresh,
  key,
  mail,
} from 'ionicons/icons';
import { useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { authService, User } from '../../services/AuthService';
import './Profile.css';

const Profile: React.FC = () => {
  const history = useHistory();
  const [profile, setProfile] = useState<User | null>(
    authService.getCurrentUser(),
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [changeCurrent, setChangeCurrent] = useState('');
  const [changeNew, setChangeNew] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [actionBusy, setActionBusy] = useState(false);

  const fullName = useMemo(() => {
    if (!profile) return 'Usuario';
    if (profile.name) return profile.name;
    const parts = [profile.firstName, profile.lastName].filter(Boolean);
    return parts.length ? parts.join(' ') : profile.email || 'Usuario';
  }, [profile]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      const res = await authService.getUserProfile();
      if (res.success && res.user) {
        setProfile(res.user);
      } else if (!res.success) {
        setError(res.message || 'No se pudo cargar el perfil');
      }
      setLoading(false);
    };
    load();
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      history.push('/login');
    } catch (e) {
      history.push('/login');
    }
  };

  const handleRefreshSession = async () => {
    setStatusMessage(null);
    const ok = await authService.refreshAuthToken();
    setStatusMessage(ok ? 'Sesión refrescada' : 'No se pudo refrescar la sesión');
  };

  const submitChangePassword = async () => {
    if (!changeCurrent || !changeNew || changeNew.length < 6) {
      setStatusMessage('Completa las contraseñas (mínimo 6 caracteres).');
      return;
    }
    setActionBusy(true);
    const res = await authService.changePassword(changeCurrent, changeNew);
    setActionBusy(false);
    setShowChangeModal(false);
    setChangeCurrent('');
    setChangeNew('');
    setStatusMessage(res.success ? 'Contraseña actualizada' : res.message || 'Error al cambiar contraseña');
  };

  const submitResetPassword = async () => {
    const email = resetEmail || profile?.email || '';
    if (!email) {
      setStatusMessage('Ingresa un correo para resetear.');
      return;
    }
    setActionBusy(true);
    const res = await authService.requestPasswordReset(email);
    setActionBusy(false);
    setShowResetModal(false);
    setResetEmail('');
    setStatusMessage(
      res.success
        ? 'Si el email existe, se enviará un enlace'
        : res.message || 'Error al solicitar reset',
    );
  };

  if (loading) {
    return (
      <IonPage>
        <IonContent fullscreen className="ion-padding profile-content">
          <div className="loading-block">
            <IonSpinner name="crescent" />
            <p>Cargando perfil...</p>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  if (error) {
    return (
      <IonPage>
        <IonContent fullscreen className="ion-padding profile-content">
          <div className="error-block">
            <IonText color="danger">
              <p>{error}</p>
            </IonText>
            <IonButton onClick={() => window.location.reload()}>Reintentar</IonButton>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  const joined = profile?.dateOfBirth
    ? new Date(profile.dateOfBirth).toLocaleDateString()
    : '—';
  const birthDate = profile?.dateOfBirth
    ? new Date(profile.dateOfBirth).toLocaleDateString()
    : '—';
  const orgName =
    (profile as any)?.activeMembership?.organizationName ||
    (profile as any)?.organizations?.[0]?.organizationName ||
    '—';
  const roleLabel =
    (profile as any)?.activeMembership?.role ||
    profile?.role ||
    (profile as any)?.organizations?.[0]?.role ||
    '—';
  const genderLabel =
    profile?.gender === 'male'
      ? 'Masculino'
      : profile?.gender === 'female'
        ? 'Femenino'
        : profile?.gender || '—';

  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding profile-content">
        {/* Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            <IonIcon icon={person} className="avatar-icon" />
          </div>
          <div className="profile-info">
            <h1 className="profile-name">{fullName}</h1>
            <p className="profile-email">{profile?.email}</p>
            <p className="profile-member">Miembro desde {joined}</p>
          </div>
        </div>

        {/* Información básica */}
        <div className="profile-card info-section">
          <h2 className="section-title">Perfil</h2>
          <div className="info-grid">
            <div className="info-item">
              <IonIcon icon={person} className="info-icon" />
              <div className="info-content">
                <span className="info-label">Nombre</span>
                <span className="info-value">{fullName}</span>
              </div>
            </div>
            <div className="info-item">
              <IonIcon icon={person} className="info-icon" />
              <div className="info-content">
                <span className="info-label">Correo</span>
                <span className="info-value">{profile?.email || '—'}</span>
              </div>
            </div>
            <div className="info-item">
              <IonIcon icon={calendar} className="info-icon" />
              <div className="info-content">
                <span className="info-label">Fecha de nacimiento</span>
                <span className="info-value">{birthDate}</span>
              </div>
            </div>
            <div className="info-item">
              <IonIcon icon={calendar} className="info-icon" />
              <div className="info-content">
                <span className="info-label">Género</span>
                <span className="info-value">{genderLabel}</span>
              </div>
            </div>
            <div className="info-item">
              <IonIcon icon={heart} className="info-icon" />
              <div className="info-content">
                <span className="info-label">Estado</span>
                <span className="info-value">{profile?.status || '—'}</span>
              </div>
            </div>
            <div className="info-item">
              <IonIcon icon={person} className="info-icon" />
              <div className="info-content">
                <span className="info-label">Organización</span>
                <span className="info-value">{orgName}</span>
              </div>
            </div>
            <div className="info-item">
              <IonIcon icon={person} className="info-icon" />
              <div className="info-content">
                <span className="info-label">Rol</span>
                <span className="info-value">{roleLabel}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="profile-card actions-section">
          <IonButton className="action-button" fill="solid" onClick={handleRefreshSession}>
            <IonIcon icon={refresh} slot="start" />
            Refrescar sesión
          </IonButton>
          <IonButton
            className="action-button"
            fill="solid"
            onClick={() => setShowChangeModal(true)}
          >
            <IonIcon icon={key} slot="start" />
            Cambiar contraseña
          </IonButton>
          <IonButton
            className="action-button"
            fill="solid"
            onClick={() => {
              setResetEmail(profile?.email || '');
              setShowResetModal(true);
            }}
          >
            <IonIcon icon={mail} slot="start" />
            Resetear contraseña
          </IonButton>
          <IonButton className="action-button logout" fill="solid" onClick={handleLogout}>
            <IonIcon icon={logOut} slot="start" />
            Cerrar Sesión
          </IonButton>
        </div>

        {statusMessage && (
          <div className="profile-card status-message">
            <IonText color="medium">
              <p>{statusMessage}</p>
            </IonText>
          </div>
        )}

        {/* Modal cambiar contraseña */}
        <IonModal isOpen={showChangeModal} onDidDismiss={() => setShowChangeModal(false)}>
          <div className="modal-content">
            <h2>Cambiar contraseña</h2>
            <IonItem>
              <IonLabel position="stacked">Contraseña actual</IonLabel>
              <IonInput
                type="password"
                value={changeCurrent}
                onIonChange={(e) => setChangeCurrent(e.detail.value || '')}
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Nueva contraseña (mín 6)</IonLabel>
              <IonInput
                type="password"
                value={changeNew}
                onIonChange={(e) => setChangeNew(e.detail.value || '')}
              />
            </IonItem>
            <div className="modal-actions">
              <IonButton onClick={() => setShowChangeModal(false)} fill="outline" disabled={actionBusy}>
                Cancelar
              </IonButton>
              <IonButton onClick={submitChangePassword} disabled={actionBusy || changeNew.length < 6}>
                {actionBusy ? <IonSpinner name="crescent" /> : 'Guardar'}
              </IonButton>
            </div>
          </div>
        </IonModal>

        {/* Modal reset contraseña */}
        <IonModal isOpen={showResetModal} onDidDismiss={() => setShowResetModal(false)}>
          <div className="modal-content">
            <h2>Resetear contraseña</h2>
            <IonItem>
              <IonLabel position="stacked">Correo</IonLabel>
              <IonInput
                type="email"
                value={resetEmail}
                onIonChange={(e) => setResetEmail(e.detail.value || '')}
              />
            </IonItem>
            <div className="modal-actions">
              <IonButton onClick={() => setShowResetModal(false)} fill="outline" disabled={actionBusy}>
                Cancelar
              </IonButton>
              <IonButton onClick={submitResetPassword} disabled={actionBusy || !resetEmail}>
                {actionBusy ? <IonSpinner name="crescent" /> : 'Enviar'}
              </IonButton>
            </div>
          </div>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Profile;

