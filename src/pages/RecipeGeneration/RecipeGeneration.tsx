import { IonContent, IonPage, IonSpinner } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import './RecipeGeneration.css';

const RecipeGeneration: React.FC = () => {
  const history = useHistory();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    'Analizando ingredientes...',
    'Generando receta personalizada...',
    'Calculando valores nutricionales...',
    'Optimizando para tus objetivos...',
    '¡Receta lista!',
  ];

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(stepInterval);
          // Redirigir a RecipeDetail después de completar
          setTimeout(() => {
            history.push('/recipe/generated-recipe');
          }, 2000);
          return prev;
        }
        return prev + 1;
      });
    }, 2000);

    return () => {
      clearInterval(stepInterval);
    };
  }, [history, steps.length]);

  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding recipe-generation-content">
        {/* Header */}
        <div className="generation-header">
          <h1 className="generation-title">Generando tu receta</h1>
          <p className="generation-subtitle">
            Nuestra IA está creando algo especial para ti
          </p>
        </div>

        {/* Loading Animation */}
        <div className="loading-container">
          <div className="spinner-container">
            <IonSpinner name="crescent" className="main-spinner" />
            <div className="spinner-ring"></div>
            <div className="spinner-ring delay-1"></div>
            <div className="spinner-ring delay-2"></div>
          </div>
        </div>

        {/* Current Step */}
        <div className="step-container">
          <div className="step-indicator">
            <div className="step-dots">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`step-dot ${index <= currentStep ? 'active' : ''}`}
                ></div>
              ))}
            </div>
          </div>
          <p className="current-step-text">{steps[currentStep]}</p>
        </div>

        {/* Ingredients Preview */}
        <div className="ingredients-preview">
          <h3 className="preview-title">Ingredientes detectados:</h3>
          <div className="ingredients-grid">
            <div className="ingredient-chip">🍅 Tomate</div>
            <div className="ingredient-chip">🥬 Lechuga</div>
            <div className="ingredient-chip">🥕 Zanahoria</div>
            <div className="ingredient-chip">🐔 Pollo</div>
            <div className="ingredient-chip">🧅 Cebolla</div>
            <div className="ingredient-chip">🧄 Ajo</div>
          </div>
        </div>

        {/* Fun Facts */}
        <div className="fun-facts">
          <div className="fact-card">
            <div className="fact-icon">🧠</div>
            <p className="fact-text">
              Nuestra IA analiza más de 10,000 recetas para crear la perfecta
              para ti
            </p>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default RecipeGeneration;
