import { IonButton, IonContent, IonIcon, IonPage, IonSpinner } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import { useEffect, useMemo, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { isFeatureEnabled } from '../../config/featureFlags';
import { RecipeDetailData, nutritionService } from '../../services/NutritionService';
import './RecipeDetail.css';

const RecipeDetail: React.FC = () => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<RecipeDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageFailed, setImageFailed] = useState(false);

  const imageSrc = useMemo(() => {
    const url = data?.imageUrl;
    if (!url) return null;
    if (url.startsWith('data:') || url.startsWith('http')) return url;
    // Algunos servicios retornan base64 del data URL completo (base64 de "data:image/jpeg;base64,...")
    try {
      const decoded = atob(url);
      if (decoded.startsWith('data:image')) return decoded;
    } catch {
      // Ignorar error de decode y seguir con prefijo por defecto
    }
    // Asumir base64 de bytes de imagen
    return `data:image/jpeg;base64,${url}`;
  }, [data?.imageUrl]);

  const handleAddToMeal = () => {
    history.push('/tabs/tab1');
  };

  const handleGoBack = () => {
    history.goBack();
  };

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const detail = await nutritionService.getRecipeDetail(id);
        setData(detail);
      } catch (err) {
        console.error('Error obteniendo detalle de receta', err);
        setError('No pudimos cargar la receta.');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonButton
          fill="clear"
          onClick={handleGoBack}
          className="floating-back-button"
        >
          <IonIcon icon={arrowBack} />
        </IonButton>

        {isLoading && (
          <div className="recipe-loading">
            <IonSpinner name="crescent" />
          </div>
        )}

        {!isLoading && error && (
          <div className="recipe-error">
            <p>{error}</p>
          </div>
        )}

        {!isLoading && !error && data && (
          <>
            {/* Hero Image con título */}
            <div className="hero-section">
              <div className="hero-image">
              {imageSrc && !imageFailed ? (
                <img
                  src={imageSrc}
                  alt={data.name}
                  className="hero-background-image"
                  onError={() => setImageFailed(true)}
                />
              ) : (
                <div className="hero-placeholder">Imagen no disponible</div>
              )}
                <div className="hero-overlay">
                  <h1 className="recipe-title">{data.name}</h1>
                  {data.totalCalories && (
                    <p className="recipe-subtitle">{data.totalCalories} kcal</p>
                  )}
                </div>
              </div>
            </div>

            <div className="recipe-content">
              {/* Descripción */}
              {data.description && (
                <div className="description-section">
                  <p>{data.description}</p>
                </div>
              )}

              {/* Aporte nutricional */}
              {data.macros && (
                <div className="nutrition-section">
                  <h2 className="section-title">Aporte nutricional</h2>
                  <div className="nutrition-card">
                    {data.macros.proteins !== undefined && (
                      <div className="nutrition-item">
                        <div className="nutrition-icon protein">🥩</div>
                        <span className="nutrition-value">
                          {data.macros.proteins} g P
                        </span>
                      </div>
                    )}
                    {data.macros.fats !== undefined && (
                      <div className="nutrition-item">
                        <div className="nutrition-icon fat">🧈</div>
                        <span className="nutrition-value">
                          {data.macros.fats} g F
                        </span>
                      </div>
                    )}
                    {data.macros.carbohydrates !== undefined && (
                      <div className="nutrition-item">
                        <div className="nutrition-icon carbs">🌾</div>
                        <span className="nutrition-value">
                          {data.macros.carbohydrates} g C
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Ingredientes */}
              {data.ingredients && data.ingredients.length > 0 && (
                <div className="ingredients-section">
                  <h2 className="section-title">Ingredientes</h2>
                  <div className="ingredients-card">
                    {data.ingredients.map((ingredient, idx) => (
                      <div className="ingredient-item" key={`${ingredient.name}-${idx}`}>
                        <span className="ingredient-bullet">•</span>
                        <span className="ingredient-text">
                          {ingredient.amount ? `${ingredient.amount} ` : ''}
                          {ingredient.unit ? `${ingredient.unit} ` : ''}
                          {ingredient.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Preparación */}
              {data.steps && data.steps.length > 0 && (
                <div className="preparation-section">
                  <h2 className="section-title">Preparación</h2>
                  <div className="preparation-steps">
                    {data.steps.map((step, idx) => (
                      <div className="preparation-step" key={`${idx}-${step}`}>
                        <span className="step-text">Paso {idx + 1}: {step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Botón de acción */}
              {isFeatureEnabled('showAddToMealButton') && (
                <div className="action-button-container">
                  <IonButton
                    className="add-to-meal-button"
                    fill="solid"
                    onClick={handleAddToMeal}
                  >
                    Añadir a mi comida de hoy
                  </IonButton>
                </div>
              )}
            </div>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default RecipeDetail;
