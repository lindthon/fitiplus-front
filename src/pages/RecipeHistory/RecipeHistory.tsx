import {
  IonButton,
  IonContent,
  IonIcon,
  IonPage,
  IonSpinner,
  IonText,
} from '@ionic/react';
import { arrowBack, timeOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  RecipeHistoryItem,
  nutritionService,
} from '../../services/NutritionService';
import './RecipeHistory.css';

const RecipeHistory: React.FC = () => {
  const history = useHistory();
  const [items, setItems] = useState<RecipeHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await nutritionService.getRecipeHistory();
        setItems(data);
      } catch {
        setError('No pudimos cargar tu historial.');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleViewRecipe = (recipeId: string) => {
    history.push(`/recipe/${recipeId}`);
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding recipe-history-content">
        <div className="history-header-bar">
          <IonButton fill="clear" onClick={() => history.goBack()} className="back-btn">
            <IonIcon icon={arrowBack} />
          </IonButton>
          <h1 className="history-page-title">
            <IonIcon icon={timeOutline} className="history-title-icon" />
            Historial de generaciones
          </h1>
        </div>

        {isLoading && (
          <div className="history-status">
            <IonSpinner name="crescent" />
            <IonText color="medium"><p>Cargando historial...</p></IonText>
          </div>
        )}

        {!isLoading && error && (
          <div className="history-status">
            <IonText color="medium"><p>{error}</p></IonText>
          </div>
        )}

        {!isLoading && !error && items.length === 0 && (
          <div className="history-empty">
            <IonIcon icon={timeOutline} className="empty-icon" />
            <h2>Sin historial</h2>
            <p>Aquí aparecerán las recetas que generes.</p>
          </div>
        )}

        <div className="history-list">
          {items.map((item) => (
            <div
              key={item.foodLogId}
              className="history-card"
              onClick={() => handleViewRecipe(item.recipeId)}
            >
              <div
                className="history-card-image"
                style={{
                  backgroundImage: item.imageUrl
                    ? `url(${item.imageUrl})`
                    : undefined,
                }}
              >
                {!item.imageUrl && <span className="history-card-placeholder">🧑‍🍳</span>}
              </div>
              <div className="history-card-info">
                <h3 className="history-card-name">{item.recipeName}</h3>
                <div className="history-card-meta">
                  {item.totalCalories && (
                    <span className="history-card-cal">{item.totalCalories} kcal</span>
                  )}
                  {item.mealTypeName && (
                    <span className="history-card-type">{item.mealTypeName}</span>
                  )}
                </div>
                {item.source && (
                  <span className="history-card-source">{item.source}</span>
                )}
                {item.detectedIngredients && (
                  <span className="history-card-ingredients">
                    {Array.isArray(item.detectedIngredients)
                      ? item.detectedIngredients.slice(0, 3).join(', ') +
                        (item.detectedIngredients.length > 3 ? '...' : '')
                      : String(item.detectedIngredients)}
                  </span>
                )}
                <span className="history-card-date">{formatDate(item.generatedAt)}</span>
              </div>
            </div>
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default RecipeHistory;
