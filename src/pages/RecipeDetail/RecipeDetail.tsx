import { IonButton, IonContent, IonIcon, IonPage } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import { useHistory, useParams } from 'react-router-dom';
import './RecipeDetail.css';

const RecipeDetail: React.FC = () => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();

  // Determinar si viene del flujo de generación de receta
  const isGeneratedRecipe = id === 'generated-recipe';

  const handleAddToMeal = () => {
    // Aquí puedes agregar la lógica para añadir la receta al plan de comidas
    console.log('Receta añadida al plan de comidas');
    // Redirigir directamente a la pantalla principal
    history.push('/tabs/tab1');
  };

  const handleGoBack = () => {
    history.goBack();
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        {/* Botón flotante de retroceder - solo si NO es receta generada */}
        {!isGeneratedRecipe && (
          <IonButton
            fill="clear"
            onClick={handleGoBack}
            className="floating-back-button"
          >
            <IonIcon icon={arrowBack} />
          </IonButton>
        )}

        {/* Hero Image con título */}
        <div className="hero-section">
          <div className="hero-image">
            <img
              src="https://www.elsabor.com.ec/wp-content/uploads/2022/02/arroz-pollo.jpg"
              alt={isGeneratedRecipe ? 'Arroz con Pollo' : 'Arroz con Pollo'}
              className="hero-background-image"
              onError={(e) => {
                e.currentTarget.src =
                  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1000&h=400&fit=crop&crop=center';
              }}
            />
            <div className="hero-overlay">
              <h1 className="recipe-title">
                {isGeneratedRecipe ? 'Arroz con Pollo' : 'Arroz con Pollo'}
              </h1>
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
                  <span className="ingredient-text">300g de pollo</span>
                </div>
                <div className="ingredient-item">
                  <span className="ingredient-bullet">•</span>
                  <span className="ingredient-text">2 tazas de arroz</span>
                </div>
                <div className="ingredient-item">
                  <span className="ingredient-bullet">•</span>
                  <span className="ingredient-text">1 cebolla</span>
                </div>
              </div>
              <div className="ingredients-column">
                <div className="ingredient-item">
                  <span className="ingredient-bullet">•</span>
                  <span className="ingredient-text">2 dientes de ajo</span>
                </div>
                <div className="ingredient-item">
                  <span className="ingredient-bullet">•</span>
                  <span className="ingredient-text">1 pimiento</span>
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
                  Paso 1: Cortar el pollo en trozos pequeños
                </span>
              </div>
              <div className="preparation-step">
                <span className="step-text">
                  Paso 2: Sofreír la cebolla y el ajo hasta que estén dorados
                </span>
              </div>
              <div className="preparation-step">
                <span className="step-text">
                  Paso 3: Agregar el pollo y cocinar hasta que esté dorado
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
