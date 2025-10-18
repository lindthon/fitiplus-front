import { IonButton, IonContent, IonPage } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './Tab3.css';

const Tab3: React.FC = () => {
  const history = useHistory();

  // Función para navegar al detalle de la receta
  const handleViewRecipe = (mealId: string) => {
    history.push(`/recipe/${mealId}`);
  };

  // Datos de comidas del día
  const mealHistory = [
    {
      id: 'arroz-pollo',
      name: 'Arroz con pollo',
      proteinas: 20,
      carbohidratos: 10,
      grasas: 30,
    },
    {
      id: 'pollo-champinones',
      name: 'Pollo con champiñones',
      proteinas: 14,
      carbohidratos: 58,
      grasas: 30,
    },
    {
      id: 'pollo-naranja',
      name: 'Pollo a la naranja',
      proteinas: 20,
      carbohidratos: 20,
      grasas: 20,
    },
    {
      id: 'lomo-cerdo',
      name: 'Lomo de cerdo',
      proteinas: 50,
      carbohidratos: 80,
      grasas: 55,
    },
  ];

  const nutrients = [
    { label: 'Proteinas', color: '#8b5cf6' },
    { label: 'Carbohidratos', color: '#3b82f6' },
    { label: 'Grasas', color: '#f59e0b' },
  ];

  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding tab3-content">
        {/* Header */}
        <div className="history-header">
          <h1 className="history-title">Historial de comidas</h1>
        </div>

        {/* Indicadores de color de nutrientes */}
        <div className="nutrient-indicators">
          {nutrients.map((nutrient, index) => (
            <div key={index} className="nutrient-indicator">
              <span className="nutrient-label">{nutrient.label}</span>
              <div
                className="nutrient-color-line"
                style={{ backgroundColor: nutrient.color }}
              ></div>
            </div>
          ))}
        </div>

        {/* Sección del día */}
        <div className="day-section">
          <h2 className="day-title">Hoy</h2>
        </div>

        {/* Lista de comidas */}
        <div className="meal-list">
          {mealHistory.map((meal, index) => (
            <div
              key={index}
              className="meal-card"
              onClick={() => handleViewRecipe(meal.id)}
            >
              <div className="meal-icon">
                <span className="meal-icon-symbol">🍲</span>
              </div>
              <div className="meal-info">
                <h3 className="meal-name">{meal.name}</h3>
                <div className="nutrient-badges">
                  <div
                    className="nutrient-badge proteinas"
                    style={{ backgroundColor: '#8b5cf6' }}
                  >
                    {meal.proteinas}g
                  </div>
                  <div
                    className="nutrient-badge carbohidratos"
                    style={{ backgroundColor: '#3b82f6' }}
                  >
                    {meal.carbohidratos}g
                  </div>
                  <div
                    className="nutrient-badge grasas"
                    style={{ backgroundColor: '#f59e0b' }}
                  >
                    {meal.grasas}g
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Botón día anterior */}
        <div className="previous-day-container">
          <IonButton className="previous-day-button" fill="solid">
            Día anterior
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
