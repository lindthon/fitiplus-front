// Configuración de API Externa para FitiPlus
export const API_CONFIG = {
  // URL base del API externo
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://api.fitiplus.com',

  // Timeout para las peticiones (en milisegundos)
  TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),

  // Versión del API
  VERSION: import.meta.env.VITE_API_VERSION || 'v1',

  // URLs específicas por entorno
  DEV_URL: import.meta.env.VITE_DEV_API_URL || 'http://localhost:3000/api',
  STAGING_URL:
    import.meta.env.VITE_STAGING_API_URL || 'https://staging-api.fitiplus.com',
  PROD_URL: import.meta.env.VITE_PROD_API_URL || 'https://api.fitiplus.com',

  // Endpoints específicos
  ENDPOINTS: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    CHANGE_PASSWORD: '/auth/change-password',
    RESET_PASSWORD: '/auth/reset-password',
    PROFILE: '/user/profile',
    REGISTER: '/auth/register-client',
    WELCOME_CARDS: '/welcome/cards',
    ONBOARDING_STAGES: '/onboarding/stages',
    ONBOARDING_GOALS: '/onboarding/goals',
    ONBOARDING_ALLERGIES: '/onboarding/allergies',
  },
} as const;

// Función para obtener la URL completa del endpoint
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Función para cambiar la URL base dinámicamente
export const setApiBaseUrl = (url: string): void => {
  // No podemos modificar BASE_URL directamente ya que es una propiedad de solo lectura
  // debido al 'as const'. En su lugar, podríamos:
  console.warn(
    'No se puede modificar BASE_URL ya que es una propiedad de solo lectura',
  );
};
