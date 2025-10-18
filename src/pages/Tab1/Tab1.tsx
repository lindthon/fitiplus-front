import { IonButton, IonContent, IonPage } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import { authService } from '../../services/AuthService';
import './Tab1.css';

const Tab1: React.FC = () => {
  const currentUser = authService.getCurrentUser();
  const userName = currentUser?.name || 'Usuario';
  const history = useHistory();

  const handleViewRecipe = (recipeId: string) => {
    history.push(`/recipe/${recipeId}`);
  };

  const handleGenerateRecipe = () => {
    history.push(ROUTES.INGREDIENT_SELECTION);
  };

  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding tab1-content">
        {/* Saludo */}
        <div className="greeting-section">
          <h1 className="greeting">Hola, {userName} 👋</h1>
          <div className="achievement">
            <span>Felicidades, cumpliste tu objetivo diario!!!</span>
            <span className="trophy">🏆</span>
          </div>
        </div>

        {/* Resumen del día */}
        <div className="daily-summary-card">
          <h3 className="summary-title">Resumen del día</h3>
          <div className="summary-content">
            <div className="calories-section">
              <span className="calories-number">1,230 kcal</span>
            </div>
            <div className="macros">
              <div className="macro-circle protein">
                <div
                  className="circle-fill"
                  style={{
                    background: `conic-gradient(#8B5CF6 0deg 162deg, #E5E7EB 162deg 360deg)`,
                  }}
                >
                  <span className="percentage-text">45%</span>
                </div>
                <span className="macro-label">Proteinas</span>
              </div>
              <div className="macro-circle carbs">
                <div
                  className="circle-fill"
                  style={{
                    background: `conic-gradient(#3B82F6 0deg 108deg, #E5E7EB 108deg 360deg)`,
                  }}
                >
                  <span className="percentage-text">30%</span>
                </div>
                <span className="macro-label">Carbohidratos</span>
              </div>
              <div className="macro-circle fats">
                <div
                  className="circle-fill"
                  style={{
                    background: `conic-gradient(#F59E0B 0deg 90deg, #E5E7EB 90deg 360deg)`,
                  }}
                >
                  <span className="percentage-text">25%</span>
                </div>
                <span className="macro-label">Grasas</span>
              </div>
            </div>
          </div>
          <IonButton
            className="recipe-button"
            fill="solid"
            onClick={handleGenerateRecipe}
          >
            Generar tu receta con una foto
          </IonButton>
        </div>

        {/* Opciones de comida */}
        <div className="meal-options">
          <h2 className="section-title">Opciones de comida de hoy</h2>
          <div className="meal-list">
            <div
              className="meal-item"
              onClick={() => handleViewRecipe('desayuno')}
            >
              <div className="meal-image breakfast"></div>
              <div className="meal-info">
                <div className="meal-header">
                  <h4 className="meal-title">Avena con frutas</h4>
                  <span className="meal-category breakfast">Desayuno</span>
                </div>
                <div className="meal-calories-row">
                  <span className="meal-calories">350 kcal · 10 g P</span>
                </div>
              </div>
            </div>
            <div
              className="meal-item"
              onClick={() => handleViewRecipe('almuerzo')}
            >
              <div className="meal-image lunch"></div>
              <div className="meal-info">
                <div className="meal-header">
                  <h4 className="meal-title">Pollo a la plancha</h4>
                  <span className="meal-category lunch">Almuerzo</span>
                </div>
                <div className="meal-calories-row">
                  <span className="meal-calories">600 kcal · 40 g P</span>
                </div>
              </div>
            </div>
            <div className="meal-item" onClick={() => handleViewRecipe('cena')}>
              <div className="meal-image dinner"></div>
              <div className="meal-info">
                <div className="meal-header">
                  <h4 className="meal-title">Salmón con quinoa</h4>
                  <span className="meal-category dinner">Cena</span>
                </div>
                <div className="meal-calories-row">
                  <span className="meal-calories">500 kcal · 25 g P</span>
                </div>
              </div>
            </div>
            <div
              className="meal-item"
              onClick={() => handleViewRecipe('snacks')}
            >
              <div className="meal-image snacks"></div>
              <div className="meal-info">
                <div className="meal-header">
                  <h4 className="meal-title">Frutos secos</h4>
                  <span className="meal-category snacks">Snacks</span>
                </div>
                <div className="meal-calories-row">
                  <span className="meal-calories">150 kcal · 5 g P</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progreso nutricional */}
        <div className="nutritional-progress">
          <h2 className="section-title">Progreso nutricional</h2>
          <div className="progress-bar">
            <div
              className="progress-segment iron"
              style={{ width: '80%' }}
            ></div>
            <div
              className="progress-segment magnesium"
              style={{ width: '50%' }}
            ></div>
            <div
              className="progress-segment omega3"
              style={{ width: '60%' }}
            ></div>
          </div>
          <div className="progress-labels">
            <div className="progress-label">
              <span className="percentage iron">80%</span>
              <span className="nutrient">Hierro</span>
            </div>
            <div className="progress-label">
              <span className="percentage magnesium">50%</span>
              <span className="nutrient">Magnesio</span>
            </div>
            <div className="progress-label">
              <span className="percentage omega3">60%</span>
              <span className="nutrient">Omega 3</span>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
