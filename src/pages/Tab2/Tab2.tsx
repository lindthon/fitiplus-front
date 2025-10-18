import { IonButton, IonContent, IonPage } from '@ionic/react';
import './Tab2.css';

const Tab2: React.FC = () => {
  // Datos de medallas por mes
  const medalData = [
    { month: 'Septiembre', gold: 5, silver: 3, bronze: 2 },
    { month: 'Agosto', gold: 2, silver: 1, bronze: 0 },
    { month: 'Julio', gold: 1, silver: 0, bronze: 1 },
    { month: 'Junio', gold: 0, silver: 1, bronze: 0 },
    { month: 'Mayo', gold: 0, silver: 1, bronze: 0 },
    { month: 'Abril', gold: 0, silver: 1, bronze: 0 },
    { month: 'Marzo', gold: 0, silver: 1, bronze: 0 },
    { month: 'Febrero', gold: 0, silver: 1, bronze: 0 },
    { month: 'Enero', gold: 0, silver: 1, bronze: 0 },
  ];

  // Totales
  const totalGold = medalData.reduce((sum, month) => sum + month.gold, 0);
  const totalSilver = medalData.reduce((sum, month) => sum + month.silver, 0);
  const totalBronze = medalData.reduce((sum, month) => sum + month.bronze, 0);

  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding tab2-content">
        {/* Header */}
        <div className="medals-header">
          <div className="header-text">
            <h1 className="medals-title">Medallas por mes</h1>
            <p className="medals-subtitle">Revisa tus logros de cada mes</p>
          </div>
          <IonButton className="year-button" fill="solid">
            2025
          </IonButton>
        </div>

        {/* Resumen de medallas */}
        <div className="medal-summary-card">
          <div className="medal-item">
            <span className="medal-icon gold">🥇</span>
            <span className="medal-count">{totalGold}</span>
          </div>
          <div className="medal-item">
            <span className="medal-icon silver">🥈</span>
            <span className="medal-count">{totalSilver}</span>
          </div>
          <div className="medal-item">
            <span className="medal-icon bronze">🥉</span>
            <span className="medal-count">{totalBronze}</span>
          </div>
        </div>

        {/* Tabla de medallas por mes */}
        <div className="medals-table">
          {/* Header de la tabla */}
          <div className="table-header">
            <span className="month-column">Total</span>
            <div className="medal-headers">
              <span className="medal-header gold">🥇</span>
              <span className="medal-header silver">🥈</span>
              <span className="medal-header bronze">🥉</span>
            </div>
          </div>

          {/* Filas de meses */}
          {medalData.map((month, index) => (
            <div key={index} className="table-row">
              <span className="month-name">{month.month}</span>
              <div className="medal-counts">
                <span className="medal-count gold">{month.gold}</span>
                <span className="medal-count silver">{month.silver}</span>
                <span className="medal-count bronze">{month.bronze}</span>
              </div>
            </div>
          ))}
        </div>

      </IonContent>
    </IonPage>
  );
};

export default Tab2;
