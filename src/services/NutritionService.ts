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

export interface SavedRecipeItem {
  id: string;
  name: string;
  description?: string;
  totalCalories?: number;
  imageUrl?: string | null;
  mealTypeName?: string;
  prepTimeMinutes?: number;
  servings?: number;
  savedAt: string;
}

export interface RecipeHistoryItem {
  foodLogId: string;
  recipeId: string;
  recipeName: string;
  totalCalories?: number;
  imageUrl?: string | null;
  mealTypeName?: string;
  source?: string;
  detectedIngredients?: string[];
  generatedAt: string;
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
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('fitiplus_token') || '';
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  /**
   * Guarda una receta en favoritos.
   * Retorna true si se guardó, false si ya estaba guardada (409).
   */
  public async saveRecipe(recipeId: string): Promise<boolean> {
    const url = `${getApiUrl(API_CONFIG.ENDPOINTS.CLIENT_RECIPE_SAVE)}/${recipeId}/save`;
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    if (response.status === 409) return false;
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return true;
  }

  /**
   * Quita una receta de favoritos.
   */
  public async unsaveRecipe(recipeId: string): Promise<void> {
    const url = `${getApiUrl(API_CONFIG.ENDPOINTS.CLIENT_RECIPE_SAVE)}/${recipeId}/save`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok && response.status !== 404) {
      throw new Error(`HTTP ${response.status}`);
    }
  }

  /**
   * Obtiene las recetas guardadas (favoritos) del usuario.
   */
  public async getSavedRecipes(): Promise<SavedRecipeItem[]> {
    const response = await fetch(
      getApiUrl(API_CONFIG.ENDPOINTS.CLIENT_RECIPES_SAVED),
      {
        method: 'GET',
        headers: this.getAuthHeaders(),
      },
    );

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return (await response.json()) as SavedRecipeItem[];
  }

  /**
   * Obtiene el historial de recetas generadas por el usuario.
   */
  public async getRecipeHistory(limit = 20): Promise<RecipeHistoryItem[]> {
    const url = `${getApiUrl(API_CONFIG.ENDPOINTS.CLIENT_RECIPES_HISTORY)}?limit=${limit}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return (await response.json()) as RecipeHistoryItem[];
  }
}

export const nutritionService = new NutritionService();
export default nutritionService;
