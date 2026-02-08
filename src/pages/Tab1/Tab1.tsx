import { IonButton, IonContent, IonPage, IonSpinner, IonText } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import { isFeatureEnabled } from '../../config/featureFlags';
import { authService } from '../../services/AuthService';
import {
  MealType,
  RandomRecipesResponse,
  nutritionService,
} from '../../services/NutritionService';
import './Tab1.css';

type MealCard = {
  id: string;
  name: string;
  calories: number;
  proteins?: number;
  type: MealType;
  imageSrc?: string | null;
};

const TYPE_LABEL: Record<MealType, string> = {
  desayuno: 'Desayuno',
  almuerzo: 'Almuerzo',
  cena: 'Cena',
  snacks: 'Snacks',
};

const TYPE_CLASS: Record<MealType, string> = {
  desayuno: 'breakfast',
  almuerzo: 'lunch',
  cena: 'dinner',
  snacks: 'snacks',
};

const Tab1: React.FC = () => {
  const currentUser = authService.getCurrentUser();
  const userName = currentUser?.firstName || currentUser?.name || 'Usuario';
  const history = useHistory();
  const [mealOptions, setMealOptions] = useState<MealCard[]>([]);
  const [isLoadingMeals, setIsLoadingMeals] = useState(false);
  const [mealError, setMealError] = useState<string | null>(null);

  const handleViewRecipe = (recipeId: string) => {
    history.push(`/recipe/${recipeId}`);
  };

  const handleGenerateRecipe = () => {
    history.push(ROUTES.MEAL_REGISTRATION);
  };

  const parseImage = (
    image?: { type: string; data: number[] } | null,
  ): string | null => {
    if (!image?.data?.length) return null;
    try {
      const decoded = new TextDecoder().decode(new Uint8Array(image.data));
      if (decoded.startsWith('data:image')) return decoded;
      return `data:image/jpeg;base64,${decoded}`;
    } catch (error) {
      console.error('Error decodificando imagen de receta', error);
      return null;
    }
  };

  const loadMeals = async () => {
    setIsLoadingMeals(true);
    setMealError(null);
    try {
      const data: RandomRecipesResponse = await nutritionService.getRandomRecipes();
      const mealTypes: MealType[] = ['desayuno', 'almuerzo', 'cena', 'snacks'];
      const mapped: MealCard[] = [];

      mealTypes.forEach((type) => {
        const recipes = data?.[type];
        if (recipes && recipes.length) {
          recipes.forEach((recipe, index) => {
            mapped.push({
              id: recipe.id || `${type}-${index}-${recipe.name}`,
              name: recipe.name,
              calories: recipe.calories,
              proteins: recipe.proteins,
              type,
              imageSrc: parseImage(recipe.image),
            });
          });
        }
      });

      setMealOptions(mapped);
    } catch (error) {
      console.error('Error cargando recetas aleatorias', error);
      setMealError('No pudimos cargar las opciones en este momento.');
      setMealOptions([]);
    } finally {
      setIsLoadingMeals(false);
    }
  };

  useEffect(() => {
    loadMeals();
  }, []);

  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding tab1-content">
        {/* Saludo */}
        <div className="greeting-section">
          <h1 className="greeting">Hola, {userName} 👋</h1>
          {isFeatureEnabled('showAchievement') && (
            <div className="achievement">
              <span>Felicidades, cumpliste tu objetivo diario!!!</span>
              <span className="trophy">🏆</span>
            </div>
          )}
        </div>

        {/* Resumen del día */}
        {isFeatureEnabled('showDailySummary') && (
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
        )}

        {/* Opciones de comida */}
        <div className="meal-options">
          <h2 className="section-title">Opciones de comida de hoy</h2>
          {isLoadingMeals && (
            <div className="meal-status">
              <IonSpinner name="crescent" />
              <IonText color="medium">
                <p>Cargando opciones...</p>
              </IonText>
            </div>
          )}
          {!isLoadingMeals && mealError && (
            <div className="meal-status">
              <IonText color="medium">
                <p>{mealError}</p>
              </IonText>
            </div>
          )}
          {!isLoadingMeals && !mealError && mealOptions.length === 0 && (
            <div className="meal-status">
              <IonText color="medium">
                <p>No hay opciones disponibles por ahora.</p>
              </IonText>
            </div>
          )}
          <div className="meal-list">
            {mealOptions.map((meal) => (
              <div
                key={meal.id}
                className="meal-item"
                onClick={() => handleViewRecipe(meal.id)}
              >
                <div
                  className={`meal-image ${TYPE_CLASS[meal.type]}`}
                  style={{
                    backgroundImage: meal.imageSrc
                      ? `url(${meal.imageSrc})`
                      : 'none',
                    backgroundSize: meal.imageSrc ? 'cover' : undefined,
                    backgroundPosition: meal.imageSrc ? 'center' : undefined,
                  }}
                ></div>
                <div className="meal-info">
                  <div className="meal-header">
                    <h4 className="meal-title">{meal.name}</h4>
                    <span className={`meal-category ${TYPE_CLASS[meal.type]}`}>
                      {TYPE_LABEL[meal.type]}
                    </span>
                  </div>
                  <div className="meal-calories-row">
                    <span className="meal-calories">
                      {meal.calories} kcal
                      {meal.proteins !== undefined
                        ? ` · ${meal.proteins} g P`
                        : ''}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progreso nutricional */}
        {isFeatureEnabled('showNutritionalProgress') && (
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
        )}
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
