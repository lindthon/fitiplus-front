# Servicios conectados al nuevo backend

Registro de endpoints migrados del backend anterior al nuevo backend de FitiPlus.

> **Estado**: ✅ Conectado y validado | ⏳ Conectado, pendiente de validar | ❌ Pendiente

---

## Auth

| # | Servicio | Método | Endpoint anterior | Endpoint nuevo | Estado | Fecha |
|---|----------|--------|-------------------|----------------|--------|-------|
| 1 | Registro | POST | `/auth/register-client` | `/auth/register` | ✅ Conectado y validado | 2026-03-28 |

### Notas de migración

#### 1. Registro (`POST /auth/register`)

**Cambios realizados:**
- `src/config/api.ts` — Endpoint actualizado.
- `src/services/AuthService.ts` — Interfaz `RegisterCredentials` cambiada: `name` → `first_name` + `last_name`. Campos opcionales (`phone`, `dateOfBirth`, `gender`) eliminados del registro.
- `src/services/AuthService.ts` — Respuesta mapeada: `access_token` (snake_case) → `accessToken`, `user.first_name`/`last_name` → `firstName`/`lastName`.
- `src/pages/Register/Register.tsx` — Formulario actualizado con campos separados "Nombre" y "Apellido".

**Request body (nuevo):**
```json
{
  "first_name": "string",
  "last_name": "string",
  "email": "string",
  "password": "string"
}
```

**Response body (nuevo):**
```json
{
  "access_token": "string",
  "user": {
    "id": "string",
    "first_name": "string",
    "last_name": "string",
    "email": "string",
    "roles": ["string"]
  }
}
```

---

## Onboarding

| # | Servicio | Método | Endpoint anterior | Endpoint nuevo | Estado | Fecha |
|---|----------|--------|-------------------|----------------|--------|-------|
| 2 | Onboarding Step 1 | POST | `/onboarding/step-1` | `/onboarding/step-1` | ✅ Conectado y validado | 2026-03-28 |
| 3 | Onboarding Step 2 | POST | `/onboarding/step-2` | `/onboarding/step-2` | ✅ Conectado y validado | 2026-03-28 |
| 4 | Onboarding Step 3 | POST | `/onboarding/step-3` | `/onboarding/step-3` | ✅ Conectado y validado | 2026-03-28 |

### Notas de migración

#### 2-4. Onboarding Steps 1, 2 y 3

Los endpoints mantienen las mismas rutas que el backend anterior. Validados y funcionando correctamente con el nuevo backend (requieren `JwtAuthGuard` / `Bearer` token).

---

## Nutrición

| # | Servicio | Método | Endpoint anterior | Endpoint nuevo | Estado | Fecha |
|---|----------|--------|-------------------|----------------|--------|-------|
| 5 | Recetas random | GET | `/nutrition/recipes/random` | `/nutrition/recipes/random` | ✅ Conectado y validado | 2026-03-28 |
| 6 | Generación receta (imágenes) | POST | `/clients/recipe-generation/only-images` | `/clients/recipe-generation/only-images` | ✅ Conectado y validado | 2026-03-28 |
| 7 | Guardar receta (favoritos) | POST | — (nuevo) | `/clients/recipes/:id/save` | ⏳ Conectado, pendiente de validar | 2026-03-28 |
| 8 | Quitar receta de favoritos | DELETE | — (nuevo) | `/clients/recipes/:id/save` | ⏳ Conectado, pendiente de validar | 2026-03-28 |
| 9 | Listar recetas guardadas | GET | — (nuevo) | `/clients/recipes/saved` | ⏳ Conectado, pendiente de validar | 2026-03-28 |
| 10 | Historial de recetas generadas | GET | — (nuevo) | `/clients/recipes/history` | ✅ Conectado y validado | 2026-03-28 |

### Notas de migración

#### 5. Recetas random (`GET /nutrition/recipes/random`)

Endpoint mantiene la misma ruta. Validado y funcionando con el nuevo backend.

#### 6. Generación de receta por imágenes (`POST /clients/recipe-generation/only-images`)

Endpoint mantiene la misma ruta. Validado y funcionando con el nuevo backend.

#### 7-10. Recetas guardadas y historial de generaciones (nuevos)

**Funcionalidades nuevas implementadas:**
- **Guardar/quitar receta** — Botón flotante de bookmark en `RecipeDetail.tsx`. Al cargar verifica si la receta ya está en favoritos.
- **Página de recetas guardadas** — `src/pages/SavedRecipes/` accesible desde Tab1. Lista con opción de eliminar.
- **Página de historial de generaciones** — `src/pages/RecipeHistory/` accesible desde Tab1. Muestra recetas generadas con fecha, tipo, ingredientes detectados.

**Archivos creados/modificados:**
- `src/config/api.ts` — 3 endpoints nuevos.
- `src/services/NutritionService.ts` — Interfaces `SavedRecipeItem`, `RecipeHistoryItem` + 4 métodos (`saveRecipe`, `unsaveRecipe`, `getSavedRecipes`, `getRecipeHistory`).
- `src/pages/RecipeDetail/RecipeDetail.tsx` — Botón flotante guardar/quitar con toast.
- `src/pages/SavedRecipes/` — Página nueva (componente + CSS + index).
- `src/pages/RecipeHistory/` — Página nueva (componente + CSS + index).
- `src/config/routes.ts` — Rutas `SAVED_RECIPES`, `RECIPE_HISTORY`.
- `src/App.tsx` — Rutas protegidas para las nuevas páginas.
- `src/pages/Tab1/Tab1.tsx` + `Tab1.css` — Accesos rápidos a guardadas e historial.

---

## Endpoints pendientes de migrar

| Servicio | Endpoint actual | Notas |
|----------|----------------|-------|
| Login | `/auth/login` | Por revisar |
| Logout | `/auth/logout` | Por revisar |
| Refresh token | `/auth/refresh` | Por revisar |
| Cambiar contraseña | `/auth/change-password` | Por revisar |
| Reset contraseña | `/auth/reset-password` | Por revisar |
| Perfil usuario | `/user/profile` | Por revisar |
| Welcome cards | `/welcome/cards` | Por revisar |
| Onboarding stages | `/onboarding/stages` | Por revisar |
| Onboarding goals | `/onboarding/goals` | Por revisar |
| Onboarding allergies | `/onboarding/allergies` | Por revisar |
| Onboarding progress | `/onboarding/progress` | Por revisar |
| Detalle receta | `/clients/recipes/detail` | Por revisar |
| Generación receta (texto) | `/clients/recipe-generation/only-text` | Por revisar |
