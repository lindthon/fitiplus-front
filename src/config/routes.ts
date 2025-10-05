// Configuración centralizada de rutas para FitiPlus
export const ROUTES = {
  // Rutas públicas
  LOGIN: '/login',
  ROOT: '/',

  // Rutas protegidas
  TABS: '/tabs',
  TAB1: '/tabs/tab1',
  TAB2: '/tabs/tab2',
  TAB3: '/tabs/tab3',
} as const;

// Rutas que requieren autenticación
export const PROTECTED_ROUTES = [
  ROUTES.TABS,
  ROUTES.TAB1,
  ROUTES.TAB2,
  ROUTES.TAB3,
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
