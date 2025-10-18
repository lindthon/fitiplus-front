import { IonButton, IonContent, IonIcon, IonPage } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import './RecipeDetail.css';

const RecipeDetail: React.FC = () => {
  const history = useHistory();

  const handleAddToMeal = () => {
    // Aquí puedes agregar la lógica para añadir la receta al plan de comidas
    console.log('Receta añadida al plan de comidas');
    // Opcional: mostrar un toast o mensaje de confirmación
  };

  const handleGoBack = () => {
    history.goBack();
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        {/* Botón flotante de retroceder */}
        <IonButton
          fill="clear"
          onClick={handleGoBack}
          className="floating-back-button"
        >
          <IonIcon icon={arrowBack} />
        </IonButton>

        {/* Hero Image con título */}
        <div className="hero-section">
          <div className="hero-image">
            <div className="hero-overlay">
              <h1 className="recipe-title">Ensalada Cesar con Pollo</h1>
            </div>
          </div>
        </div>

        <div className="recipe-content">
          {/* Aporte nutricional */}
          <div className="nutrition-section">
            <h2 className="section-title">Aporte nutricional</h2>
            <div className="nutrition-card">
              <div className="nutrition-item">
                <div className="nutrition-icon protein">🥩</div>
                <span className="nutrition-value">10g</span>
              </div>
              <div className="nutrition-item">
                <div className="nutrition-icon fat">🧈</div>
                <span className="nutrition-value">20g</span>
              </div>
              <div className="nutrition-item">
                <div className="nutrition-icon carbs">🌾</div>
                <span className="nutrition-value">15</span>
              </div>
            </div>
          </div>

          {/* Ingredientes */}
          <div className="ingredients-section">
            <h2 className="section-title">Ingredientes</h2>
            <div className="ingredients-card">
              <div className="ingredients-column">
                <div className="ingredient-item">
                  <span className="ingredient-bullet">•</span>
                  <span className="ingredient-text">25g de pollo</span>
                </div>
                <div className="ingredient-item">
                  <span className="ingredient-bullet">•</span>
                  <span className="ingredient-text">2 huevos</span>
                </div>
                <div className="ingredient-item">
                  <span className="ingredient-bullet">•</span>
                  <span className="ingredient-text">1 tomate</span>
                </div>
              </div>
              <div className="ingredients-column">
                <div className="ingredient-item">
                  <span className="ingredient-bullet">•</span>
                  <span className="ingredient-text">
                    5 trozos de pan integral
                  </span>
                </div>
                <div className="ingredient-item">
                  <span className="ingredient-bullet">•</span>
                  <span className="ingredient-text">3 trozos de lechuga</span>
                </div>
              </div>
            </div>
          </div>

          {/* Preparación */}
          <div className="preparation-section">
            <h2 className="section-title">Preparación</h2>
            <div className="preparation-steps">
              <div className="preparation-step">
                <span className="step-text">
                  Paso 1: Cortar la berenjena en cuadritos
                </span>
              </div>
              <div className="preparation-step">
                <span className="step-text">
                  Paso 2: Cocinar el fideo por 5 minutos con 5g de sal
                </span>
              </div>
              <div className="preparation-step">
                <span className="step-text">
                  Paso 3: Sazonar la carne con sal y el ajo al gusto
                </span>
              </div>
            </div>
          </div>

          {/* Botón de acción */}
          <div className="action-button-container">
            <IonButton
              className="add-to-meal-button"
              fill="solid"
              onClick={handleAddToMeal}
            >
              Añadir a mi comida de hoy
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default RecipeDetail;
