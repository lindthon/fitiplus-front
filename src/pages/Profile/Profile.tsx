import { IonButton, IonContent, IonIcon, IonPage } from '@ionic/react';
import {
  calendar,
  fitness,
  heart,
  logOut,
  person,
  scale,
  settings,
} from 'ionicons/icons';
import './Profile.css';

const Profile: React.FC = () => {
  // Datos del usuario
  const userData = {
    name: 'María González',
    email: 'maria.gonzalez@email.com',
    age: 28,
    height: 165, // cm
    weight: 62, // kg
    goal: 'Mantener peso',
    activityLevel: 'Moderadamente activa',
    joinDate: 'Enero 2024',
  };

  // Objetivos de salud
  const healthGoals = {
    weightGoal: 'Mantener 62 kg',
    calorieGoal: '1800 kcal/día',
    waterGoal: '2.5 L/día',
    exerciseGoal: '4 días/semana',
  };

  // Estadísticas de progreso
  const progressStats = {
    daysActive: 45,
    mealsLogged: 127,
    workoutsCompleted: 18,
    weightLost: 3.2, // kg
    streak: 12, // días consecutivos
  };

  // Logros recientes
  const recentAchievements = [
    { title: 'Primera semana completa', icon: '🏆', date: 'Hace 2 días' },
    { title: 'Meta de agua alcanzada', icon: '💧', date: 'Hace 3 días' },
    { title: '5 entrenamientos seguidos', icon: '💪', date: 'Hace 1 semana' },
  ];

  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding profile-content">
        {/* Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            <IonIcon icon={person} className="avatar-icon" />
          </div>
          <div className="profile-info">
            <h1 className="profile-name">{userData.name}</h1>
            <p className="profile-email">{userData.email}</p>
            <p className="profile-member">Miembro desde {userData.joinDate}</p>
          </div>
        </div>

        {/* Información personal */}
        <div className="info-section">
          <h2 className="section-title">Información Personal</h2>
          <div className="info-grid">
            <div className="info-item">
              <IonIcon icon={calendar} className="info-icon" />
              <div className="info-content">
                <span className="info-label">Edad</span>
                <span className="info-value">{userData.age} años</span>
              </div>
            </div>
            <div className="info-item">
              <IonIcon icon={scale} className="info-icon" />
              <div className="info-content">
                <span className="info-label">Altura</span>
                <span className="info-value">{userData.height} cm</span>
              </div>
            </div>
            <div className="info-item">
              <IonIcon icon={fitness} className="info-icon" />
              <div className="info-content">
                <span className="info-label">Peso actual</span>
                <span className="info-value">{userData.weight} kg</span>
              </div>
            </div>
            <div className="info-item">
              <IonIcon icon={heart} className="info-icon" />
              <div className="info-content">
                <span className="info-label">Objetivo</span>
                <span className="info-value">{userData.goal}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Objetivos de salud */}
        <div className="goals-section">
          <h2 className="section-title">Objetivos de Salud</h2>
          <div className="goals-grid">
            <div className="goal-card">
              <div className="goal-icon">⚖️</div>
              <div className="goal-content">
                <span className="goal-label">Peso objetivo</span>
                <span className="goal-value">{healthGoals.weightGoal}</span>
              </div>
            </div>
            <div className="goal-card">
              <div className="goal-icon">🔥</div>
              <div className="goal-content">
                <span className="goal-label">Calorías diarias</span>
                <span className="goal-value">{healthGoals.calorieGoal}</span>
              </div>
            </div>
            <div className="goal-card">
              <div className="goal-icon">💧</div>
              <div className="goal-content">
                <span className="goal-label">Agua diaria</span>
                <span className="goal-value">{healthGoals.waterGoal}</span>
              </div>
            </div>
            <div className="goal-card">
              <div className="goal-icon">🏃‍♀️</div>
              <div className="goal-content">
                <span className="goal-label">Ejercicio semanal</span>
                <span className="goal-value">{healthGoals.exerciseGoal}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas de progreso */}
        <div className="stats-section">
          <h2 className="section-title">Tu Progreso</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{progressStats.daysActive}</div>
              <div className="stat-label">Días activos</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{progressStats.mealsLogged}</div>
              <div className="stat-label">Comidas registradas</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">
                {progressStats.workoutsCompleted}
              </div>
              <div className="stat-label">Entrenamientos</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{progressStats.weightLost} kg</div>
              <div className="stat-label">Peso perdido</div>
            </div>
            <div className="stat-card streak">
              <div className="stat-number">{progressStats.streak}</div>
              <div className="stat-label">Racha actual</div>
            </div>
          </div>
        </div>

        {/* Logros recientes */}
        <div className="achievements-section">
          <h2 className="section-title">Logros Recientes</h2>
          <div className="achievements-list">
            {recentAchievements.map((achievement, index) => (
              <div key={index} className="achievement-item">
                <div className="achievement-icon">{achievement.icon}</div>
                <div className="achievement-content">
                  <span className="achievement-title">{achievement.title}</span>
                  <span className="achievement-date">{achievement.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Acciones */}
        <div className="actions-section">
          <IonButton className="action-button" fill="outline">
            <IonIcon icon={settings} slot="start" />
            Configuración
          </IonButton>
          <IonButton className="action-button logout" fill="outline">
            <IonIcon icon={logOut} slot="start" />
            Cerrar Sesión
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Profile;

