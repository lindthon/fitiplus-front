// Configuración centralizada de rutas para FitiPlus
export const ROUTES = {
  // Rutas públicas
  LOGIN: '/login',
  REGISTER: '/register-client',
  PRESENTATION: '/presentation',
  MULTI_STEP_FORM: '/form',
  ROOT: '/',

  // Rutas protegidas
  TABS: '/tabs',
  TAB1: '/tabs/tab1',
  TAB2: '/tabs/tab2',
  TAB3: '/tabs/tab3',
  TAB4: '/tabs/tab4',
  RECIPE_DETAIL: '/recipe/:id',
  INGREDIENT_SELECTION: '/ingredient-selection',
  MEAL_REGISTRATION: '/meal-registration',
  RECIPE_GENERATION: '/recipe-generation',
  PROFILE: '/profile',
} as const;

// Rutas que requieren autenticación
export const PROTECTED_ROUTES = [
  ROUTES.TABS,
  ROUTES.TAB1,
  ROUTES.TAB2,
  ROUTES.TAB3,
  ROUTES.TAB4,
  ROUTES.RECIPE_DETAIL,
  ROUTES.INGREDIENT_SELECTION,
  ROUTES.MEAL_REGISTRATION,
  ROUTES.RECIPE_GENERATION,
  ROUTES.PROFILE,
] as const;

// Rutas públicas (no requieren autenticación)
export const PUBLIC_ROUTES = [ROUTES.LOGIN] as const;

// Función helper para verificar si una ruta es protegida
export const isProtectedRoute = (path: string): boolean => {
  return PROTECTED_ROUTES.some((route) => path.startsWith(route));
};

// Función helper para verificar si una ruta es pública
export const isPublicRoute = (path: string): boolean => {
  return PUBLIC_ROUTES.includes(path as any);
};
