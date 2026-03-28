import {
  IonButton,
  IonContent,
  IonIcon,
  IonPage,
  IonSpinner,
  IonText,
} from '@ionic/react';
import { arrowBack, bookmark, trashOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  SavedRecipeItem,
  nutritionService,
} from '../../services/NutritionService';
import './SavedRecipes.css';

const SavedRecipes: React.FC = () => {
  const history = useHistory();
  const [recipes, setRecipes] = useState<SavedRecipeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const loadSaved = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await nutritionService.getSavedRecipes();
      setRecipes(data);
    } catch {
      setError('No pudimos cargar tus recetas guardadas.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSaved();
  }, []);

  const handleRemove = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRemovingId(id);
    try {
      await nutritionService.unsaveRecipe(id);
      setRecipes((prev) => prev.filter((r) => r.id !== id));
    } catch {
      // silently fail
    } finally {
      setRemovingId(null);
    }
  };

  const handleViewRecipe = (id: string) => {
    history.push(`/recipe/${id}`);
  };

  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding saved-recipes-content">
        <div className="saved-header">
          <IonButton fill="clear" onClick={() => history.goBack()} className="back-btn">
            <IonIcon icon={arrowBack} />
          </IonButton>
          <h1 className="saved-title">
            <IonIcon icon={bookmark} className="saved-title-icon" />
            Recetas guardadas
          </h1>
        </div>

        {isLoading && (
          <div className="saved-status">
            <IonSpinner name="crescent" />
            <IonText color="medium"><p>Cargando recetas...</p></IonText>
          </div>
        )}

        {!isLoading && error && (
          <div className="saved-status">
            <IonText color="medium"><p>{error}</p></IonText>
          </div>
        )}

        {!isLoading && !error && recipes.length === 0 && (
          <div className="saved-empty">
            <IonIcon icon={bookmark} className="empty-icon" />
            <h2>Sin recetas guardadas</h2>
            <p>Guarda recetas desde el detalle para verlas aquí.</p>
          </div>
        )}

        <div className="saved-list">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="saved-card"
              onClick={() => handleViewRecipe(recipe.id)}
            >
              <div
                className="saved-card-image"
                style={{
                  backgroundImage: recipe.imageUrl
                    ? `url(${recipe.imageUrl})`
                    : undefined,
                }}
              >
                {!recipe.imageUrl && <span className="saved-card-placeholder">🍽️</span>}
              </div>
              <div className="saved-card-info">
                <h3 className="saved-card-name">{recipe.name}</h3>
                {recipe.totalCalories && (
                  <span className="saved-card-cal">{recipe.totalCalories} kcal</span>
                )}
                {recipe.mealTypeName && (
                  <span className="saved-card-type">{recipe.mealTypeName}</span>
                )}
                {recipe.prepTimeMinutes && (
                  <span className="saved-card-time">{recipe.prepTimeMinutes} min</span>
                )}
              </div>
              <IonButton
                fill="clear"
                className="saved-card-remove"
                onClick={(e) => handleRemove(recipe.id, e)}
                disabled={removingId === recipe.id}
              >
                {removingId === recipe.id ? (
                  <IonSpinner name="crescent" />
                ) : (
                  <IonIcon icon={trashOutline} />
                )}
              </IonButton>
            </div>
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SavedRecipes;
