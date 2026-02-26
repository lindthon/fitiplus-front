# Reporte de uso de servicios (frontend FitiPlus)

## Variables de entorno relevantes
- `VITE_API_BASE_URL` (usa en runtime `API_CONFIG.BASE_URL`; en prod: `https://api.fitiplus.com`)
- `VITE_API_TIMEOUT` (ms, por defecto 10000)
- `VITE_API_VERSION`, `VITE_DEV_API_URL`, `VITE_STAGING_API_URL`, `VITE_PROD_API_URL` (no consumidos directamente salvo la base)

## Autenticación y sesión
- **Login**: `POST /auth/login` (headers JSON). Guarda en `localStorage`:
  - `fitiplus_user`: JSON de usuario
  - `fitiplus_token`: access token
  - `fitiplus_refresh_token`: refresh token (opcional si lo entrega el backend)
- **Registro**: `POST /auth/register-client` (JSON). Tras éxito redirige a `/presentation`.
- **Refresh token**: método `authService.refreshAuthToken()` → `POST /auth/refresh` (usa `fitiplus_refresh_token` si existe).
- **Logout**: botón dedicado elimina `fitiplus_user`, `fitiplus_token`, `fitiplus_refresh_token`.
- **Guardas**:
  - `SimpleAuthCheck`: bloquea rutas si `authService.isAuthenticated()` es falso.
  - `AuthGuard` / `ProtectedRoute`: validan token y refrescan; si falla, logout.
- **Root redirect**: si hay sesión, `"/"` → `/tabs/tab1`, si no → `/login`.

## Flujos funcionales conectados a API

### 1) Home / Tab1 (Listado de opciones de comida)
- Endpoint: `GET /nutrition/recipes/random`
  - Headers: `Authorization: Bearer <fitiplus_token>` si existe.
  - Respuesta esperada: `{ desayuno: RecipeOption[], almuerzo: [], cena: [], snacks: [] }`
- Uso:
  - Se mapean las primeras recetas de cada tipo y se muestran con nombre/calorías/proteínas.
  - Si una receta tiene `image.data` (Buffer/base64), se pinta como `background-image`.
- CTA “Generar nueva receta”:
  - Navega a `/meal-registration`.

### 2) Detalle de receta
- Rutas: `/recipe/:id`
- Endpoint: `GET /clients/recipes/detail?id=<id>`
  - Headers: `Authorization` opcional.
  - Respuesta esperada: `RecipeDetailData` (macros, ingredientes, pasos, imagen).
- Uso:
  - Muestra nombre, calorías, macros (si vienen), ingredientes y pasos.
  - Soporta `imageUrl` como data URL/base64.
  - Si se navega con `generated-recipe` y existe `generated_recipe_info` en localStorage, usa su `recipeId` como fallback.
  - Limpia `generated_recipe_info` después de cargar.

### 3) Generación de receta (flujo simulación + detalle)
- Pantalla `/meal-registration`:
  - Modo selector:
    - **Subir fotos**: `POST /clients/recipe-generation/only-images`
      - Form-data `files` (una o varias imágenes), `Authorization: Bearer <token>` si existe.
    - **Escribirlos**: `POST /clients/recipe-generation/only-text`
      - Body JSON `{ ingredients: string[] }` (se arma desde el textarea separando por comas).
  - Guarda en `localStorage` `generated_recipe_info` con la respuesta y `recipeId`.
  - Redirige a `/recipe-generation`.
- Pantalla `/recipe-generation`:
  - Simula pasos; al terminar o por fallback timeout, redirige a `/recipe/<recipeId>` si existe, si no a `/recipe/generated-recipe`.
- Pantalla `/recipe/:id` (ver sección anterior) consume `/clients/recipes/detail`.

### 4) Perfil / Tabs / Otros
- Tabs secundarios (historial, medallas, perfil) están tras flags; no se cargan endpoints reales.
- Ruta `/profile`: protegida, sin llamadas activas al backend en el estado actual.

## Feature flags (UI)
Archivo: `src/config/featureFlags.ts`
- `showAchievement`, `showDailySummary`, `showNutritionalProgress`
- Tabs: `showTab2Medals`, `showTab3History`, `showTab4Profile`
- Botones/flows: `showAddToMealButton`, `showMealImageUpload`, `showMealManualInput`, `showMealSubmitButton`, `showGenerateRecipeCTA`

## Endpoints disponibles en configuración (aunque no todos conectados)
- Autenticación: `/auth/login`, `/auth/logout`, `/auth/refresh`, `/auth/change-password`, `/auth/reset-password`
- Registro: `/auth/register-client`
- Perfil: `/user/profile`
- Onboarding (no conectados actualmente): `/welcome/cards`, `/onboarding/stages`, `/onboarding/goals`, `/onboarding/allergies`, `/onboarding/step-1/2/3`, `/onboarding/progress`
- Nutrición:
  - `/nutrition/recipes/random` (usado en Home)
  - `/clients/recipes/detail` (usado en Detalle)
  - `/clients/recipe-generation/only-text` (usado)
  - `/clients/recipe-generation/only-images` (usado)

## Pendientes de conectar / validar con backend
- Onboarding completo (stages, goals, allergies, steps 1-3, progress): UI no implementada con estos endpoints.
- Cambio/Reset de contraseña (`/auth/change-password`, `/auth/reset-password`) y flujo de perfil (`/user/profile`).
- Logout servidor (`/auth/logout`) si requiere invalidar refresh token (hoy solo logout local).
- Validar manejo de refresh token en todas las peticiones críticas (se usa en guardas, pero no en cada fetch de servicios).
- Estados de error UX: mostrar mensajes cuando fallen generación de recetas o random recipes (actualmente solo logs).
- Progreso nutricional y resumen del día: hoy está controlado por flags, sin datos reales del backend.

## Consideraciones de despliegue / mobile
- Usar `VITE_API_BASE_URL` accesible desde el dispositivo (no `localhost`). Ideal: `https://api.fitiplus.com`.
- Si se usa HTTP en dev, requiere `usesCleartextTraffic` y `network_security_config` en Android; en prod usar siempre HTTPS.
- Tokens se guardan en `localStorage`; al refrescar app se rehidratan vía `authService`.
