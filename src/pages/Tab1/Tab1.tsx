import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import ExploreContainer from '../../components/ExploreContainer';
import LogoutButton from '../../components/LogoutButton';
import { authService } from '../../services/AuthService';
import './Tab1.css';

const Tab1: React.FC = () => {
  const currentUser = authService.getCurrentUser();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 1</IonTitle>
          <LogoutButton slot="end" />
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 1</IonTitle>
          </IonToolbar>
        </IonHeader>

        {currentUser && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>¡Bienvenido!</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonText>
                <p>
                  Hola <strong>{currentUser.name}</strong>, has iniciado sesión
                  exitosamente.
                </p>
                <p>Email: {currentUser.email}</p>
              </IonText>
            </IonCardContent>
          </IonCard>
        )}

        <ExploreContainer name="Tab 1 page" />
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
