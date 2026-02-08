import { API_CONFIG, getApiUrl } from '../config/api';

export type MealType = 'desayuno' | 'almuerzo' | 'cena' | 'snacks';

export interface RecipeOption {
  id?: string;
  name: string;
  calories: number;
  proteins?: number;
  type: MealType;
  image?: { type: string; data: number[] } | null;
}

export type RandomRecipesResponse = Partial<Record<MealType, RecipeOption[]>>;

export interface RecipeDetailData {
  id: string;
  name: string;
  description?: string;
  totalCalories?: number;
  imageUrl?: string | null;
  mealTypeName?: MealType | string;
  matchPercentage?: number;
  matchedIngredients?: string[];
  macros?: {
    proteins?: number;
    carbohydrates?: number;
    fats?: number;
  };
  ingredients?: Array<{
    name: string;
    amount?: number;
    unit?: string;
  }>;
  steps?: string[];
  servings?: number;
  prepTimeMinutes?: number;
}

class NutritionService {
  /**
   * Obtiene recetas aleatorias para cada tipo de comida.
   */
  public async getRandomRecipes(): Promise<RandomRecipesResponse> {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(
      () => controller.abort(),
      API_CONFIG.TIMEOUT,
    );

    try {
      const token = localStorage.getItem('fitiplus_token') || '';

      const response = await fetch(
        getApiUrl(API_CONFIG.ENDPOINTS.NUTRITION_RANDOM),
        {
          method: 'GET',
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = (await response.json()) as RandomRecipesResponse;
      return data;
    } finally {
      window.clearTimeout(timeoutId);
    }
  }

  /**
   * Obtiene el detalle de una receta por id.
   */
  public async getRecipeDetail(id: string): Promise<RecipeDetailData> {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(
      () => controller.abort(),
      API_CONFIG.TIMEOUT,
    );

    try {
      const token = localStorage.getItem('fitiplus_token') || '';
      const url = `${getApiUrl(API_CONFIG.ENDPOINTS.CLIENT_RECIPE_DETAIL)}?id=${encodeURIComponent(
        id,
      )}`;

      const response = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = (await response.json()) as RecipeDetailData;
      return data;
    } finally {
      window.clearTimeout(timeoutId);
    }
  }
}

export const nutritionService = new NutritionService();
export default nutritionService;
