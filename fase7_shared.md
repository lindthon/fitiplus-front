# 📘 Fase 7 — Guía de Integración para Desarrolladores

**Fecha:** 25/02/2026  
**Entorno base:** `http://localhost:3001` (dev) · `https://api.fitiplus.com` (prod)  
**Swagger interactivo:** `{BASE_URL}/api/docs`  
**Dirigido a:** Desarrolladores frontend/mobile que integran con el backend FitiPlus

---

## Índice

1. [Convenciones generales](#1-convenciones-generales)
2. [Autenticación y ciclo de vida del token](#2-autenticación-y-ciclo-de-vida-del-token)
3. [Estructura del JWT y del objeto usuario](#3-estructura-del-jwt-y-del-objeto-usuario)
4. [Endpoints de sesión y contraseña](#4-endpoints-de-sesión-y-contraseña)
   - 4.1 `POST /auth/login`
   - 4.2 `POST /auth/register-client`
   - 4.3 `POST /auth/refresh`
   - 4.4 `POST /auth/logout`
   - 4.5 `POST /auth/change-password`
   - 4.6 `POST /auth/reset-password`
5. [Endpoints de perfil de usuario](#5-endpoints-de-perfil-de-usuario)
   - 5.1 `GET /auth/profile`
   - 5.2 `GET /user/profile`
   - 5.3 `PUT /auth/profile`
6. [Endpoints de nutrición](#6-endpoints-de-nutrición)
   - 6.1 `GET /nutrition/recipes/random`
   - 6.2 `GET /clients/recipes/detail`
   - 6.3 `POST /clients/recipe-generation/only-text`
   - 6.4 `POST /clients/recipe-generation/only-images`
7. [Endpoints de onboarding](#7-endpoints-de-onboarding)
8. [Catálogo de códigos de error](#8-catálogo-de-códigos-de-error)
9. [Campos nulos — comportamiento esperado](#9-campos-nulos--comportamiento-esperado)
10. [Consideraciones de producción](#10-consideraciones-de-producción)

---

## 1. Convenciones generales

| Concepto | Detalle |
|----------|---------|
| **Base URL** | Variable de entorno `VITE_API_BASE_URL`. En prod: `https://api.fitiplus.com` |
| **Content-Type** | `application/json` para todos los endpoints salvo los que indican `multipart/form-data` |
| **Autenticación** | Header `Authorization: Bearer <accessToken>` en todos los endpoints protegidos |
| **Token guardado en cliente** | `localStorage.fitiplus_token` (access token) y `localStorage.fitiplus_refresh_token` (mismo token, usado para refresh) |
| **Expiración del token** | 24 horas (`JWT_EXPIRES_IN=24h`). El cliente debe refrescar antes de expirar |
| **Formato de fechas** | ISO 8601: `YYYY-MM-DD` para fechas, `YYYY-MM-DDTHH:mm:ssZ` para timestamps |
| **UUIDs** | Formato estándar `8-4-4-4-12` hex. La org por defecto usa `ffffffff-0000-0000-0000-000000000001` (UUID no estándar RFC 4122 — ver §3) |

---

## 2. Autenticación y ciclo de vida del token

### Flujo normal

```
1. Usuario hace login → POST /auth/login
   → Recibe { accessToken, user }
   → Guardar en localStorage: fitiplus_token y fitiplus_refresh_token (mismo valor)

2. En cada request protegido:
   → Header: Authorization: Bearer <fitiplus_token>

3. Cuando el token esté a punto de expirar o el guardia detecte error 401:
   → POST /auth/refresh  (con el token actual como Bearer)
   → Recibe nuevo { accessToken }
   → Actualizar fitiplus_token y fitiplus_refresh_token

4. Al cerrar sesión:
   → POST /auth/logout  (con el token como Bearer)
   → Eliminar fitiplus_token, fitiplus_refresh_token, fitiplus_user de localStorage
```

### Restricción importante

> ⚠️ El sistema usa **JWT stateless**. `POST /auth/logout` **no invalida el token en el servidor**. Si el token fue comprometido, el usuario debe esperar a que expire (24 h) o contactar a un admin para que deshabilite la cuenta (`status = suspended`).

---

## 3. Estructura del JWT y del objeto usuario

### Payload del JWT (decodificado)

```json
{
  "sub": "uuid-del-usuario",
  "email": "juan@example.com",
  "organizations": [
    {
      "organizationId": "ffffffff-0000-0000-0000-000000000001",
      "organizationName": "FitiPlus Core",
      "organizationType": "nutrition_center",
      "membershipId": "uuid-de-la-membresia",
      "role": "client",
      "permissions": ["view:profile", "view:recipes"]
    }
  ],
  "activeOrganizationId": "ffffffff-0000-0000-0000-000000000001",
  "iat": 1740484613,
  "exp": 1740571013
}
```

### Objeto `AuthUser` inyectado en `req.user` (backend)

El backend carga datos frescos de la BD en cada request. El frontend NO necesita parsear el JWT; usa los endpoints `/auth/profile` o `/user/profile`.

```typescript
interface AuthUser {
  id: string;                        // alias de sub
  userId: string;                    // mismo que id
  email: string;
  name: string;                      // desde BD, no está en el JWT
  gender?: string | null;            // 'male' | 'female' | 'other' | null
  dateOfBirth?: Date | null;         // fecha ISO
  status: string;                    // 'active' | 'pending' | 'suspended' | 'deleted'
  organizations: OrgMembership[];
  activeOrganizationId: string | null;
  activeMembership: OrgMembership | null;
}
```

### Nota sobre el UUID de la organización por defecto

El ID `ffffffff-0000-0000-0000-000000000001` es un UUID **no estándar RFC 4122** (versión/variante = 0). Los validadores estrictos como `@IsUUID('4')` lo rechazan. En el backend se usa `@Matches(UUID_LOOSE)` para aceptarlo. **El frontend no debe filtrar este valor** — enviarlo tal cual.

---

## 4. Endpoints de sesión y contraseña

---

### 4.1 `POST /auth/login`

**Autenticación:** No requerida  

**Request:**
```json
{
  "email": "juan@example.com",
  "password": "password123"
}
```

**Validaciones:**
| Campo | Regla |
|-------|-------|
| `email` | Email válido, requerido |
| `password` | String, mínimo 6 caracteres, requerido |

**Response `200`:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-del-usuario",
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan@example.com",
    "role": "user"
  }
}
```

> ⚠️ `firstName` y `lastName` son derivados del campo `name` de la BD (split por espacio). Si el nombre es `"Juan"` sin apellido, `lastName` será `""`.

**Errores:**
| HTTP | Condición |
|------|-----------|
| `401` | Email no existe, contraseña incorrecta, o cuenta con `status !== 'active'` |
| `400` | Body inválido (email malformado, password corto) |

---

### 4.2 `POST /auth/register-client`

**Autenticación:** No requerida  

**Request:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123"
}
```

**Validaciones:**
| Campo | Regla |
|-------|-------|
| `name` | String, mínimo 2 caracteres, requerido |
| `email` | Email válido, requerido |
| `password` | String, mínimo 6 caracteres, requerido |

**Response `201`:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-del-usuario",
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan@example.com",
    "role": "user"
  }
}
```

**Errores:**
| HTTP | Condición |
|------|-----------|
| `409` | El email ya está registrado |
| `400` | Body inválido |

**Efecto secundario:** Al registrarse, el usuario queda automáticamente vinculado a la organización por defecto `FitiPlus Core` con el rol `client`.

---

### 4.3 `POST /auth/refresh`

**Autenticación:** Requerida (`Authorization: Bearer <token>`)  
**Body:** Ninguno

**Request:**
```http
POST /auth/refresh
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response `200`:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...<NUEVO_TOKEN>"
}
```

**Comportamiento detallado:**
- Verifica que el token sea válido y no haya expirado.
- Recarga las organizaciones y permisos del usuario desde la BD.
- Emite un nuevo JWT con la misma `activeOrganizationId` que tenía el token anterior.
- El token anterior sigue siendo válido hasta su fecha de expiración original (no hay invalidación).

**Cómo usarlo en el frontend (patrón recomendado):**
```javascript
// authService.refreshAuthToken()
const refreshToken = localStorage.getItem('fitiplus_refresh_token');
const response = await fetch('/auth/refresh', {
  method: 'POST',
  headers: { Authorization: `Bearer ${refreshToken}` }
});
const { accessToken } = await response.json();
localStorage.setItem('fitiplus_token', accessToken);
localStorage.setItem('fitiplus_refresh_token', accessToken);
```

**Errores:**
| HTTP | Condición |
|------|-----------|
| `401` | Token inválido, malformado, expirado, o usuario con status `!= 'active'` |

---

### 4.4 `POST /auth/logout`

**Autenticación:** Requerida (`Authorization: Bearer <token>`)  
**Body:** Ninguno

**Request:**
```http
POST /auth/logout
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response `200`:**
```json
{
  "message": "Sesión cerrada correctamente"
}
```

**Comportamiento:** El servidor registra el evento en el log. El token **NO es invalidado** en el servidor. El cliente **debe** eliminar `fitiplus_token`, `fitiplus_refresh_token` y `fitiplus_user` de `localStorage` inmediatamente tras recibir este 200.

**Errores:**
| HTTP | Condición |
|------|-----------|
| `401` | Token inválido o expirado |

---

### 4.5 `POST /auth/change-password`

**Autenticación:** Requerida (`Authorization: Bearer <token>`)  

**Request:**
```json
{
  "currentPassword": "password123",
  "newPassword": "nuevaPassword456"
}
```

**Validaciones:**
| Campo | Regla |
|-------|-------|
| `currentPassword` | String, mínimo 6 caracteres, requerido |
| `newPassword` | String, mínimo 6 caracteres, requerido |

**Response `200`:**
```json
{
  "message": "Contraseña actualizada correctamente"
}
```

**Errores:**
| HTTP | Condición |
|------|-----------|
| `401` | Token inválido o expirado |
| `401` | `currentPassword` no coincide con la contraseña almacenada |
| `401` | La cuenta fue creada por OAuth (no tiene contraseña local) |
| `404` | Usuario no encontrado en BD |
| `400` | Body inválido (campos faltantes o cortos) |

> ⚠️ **Importante:** Tras cambiar la contraseña, el token actual sigue siendo válido hasta su expiración. Si quieres forzar cierre de sesión en otros dispositivos, haz `POST /auth/logout` y borra el token.

---

### 4.6 `POST /auth/reset-password`

**Autenticación:** No requerida  

**Request:**
```json
{
  "email": "juan@example.com",
  "newPassword": "nuevaPassword123"
}
```

**Validaciones:**
| Campo | Regla |
|-------|-------|
| `email` | Email válido, requerido |
| `newPassword` | String, mínimo 6 caracteres, requerido |

**Response `200` (siempre, independientemente de si el email existe):**
```json
{
  "message": "Si el email está registrado, la contraseña ha sido actualizada"
}
```

**Comportamiento de seguridad:** La respuesta es idéntica tanto si el email existe como si no, para evitar enumeración de usuarios. El cliente **no puede saber** si el reset fue exitoso con certeza.

**Limitación actual (dev):** El reset se aplica **directamente** sin verificación por correo. En producción se debe integrar un flujo de email con token de un solo uso antes de llamar este endpoint.

**Errores:**
| HTTP | Condición |
|------|-----------|
| `400` | Body inválido (email malformado o password corto) |

---

## 5. Endpoints de perfil de usuario

---

### 5.1 `GET /auth/profile`

**Autenticación:** Requerida  

**Response `200`:**
```json
{
  "id": "a3f2b1c4-1234-5678-abcd-ef0123456789",
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "gender": "male",
  "dateOfBirth": "1990-05-15T00:00:00.000Z",
  "status": "active",
  "organizations": [
    {
      "organizationId": "ffffffff-0000-0000-0000-000000000001",
      "organizationName": "FitiPlus Core",
      "organizationType": "nutrition_center",
      "membershipId": "uuid-membresia",
      "role": "client",
      "permissions": []
    }
  ],
  "activeOrganizationId": "ffffffff-0000-0000-0000-000000000001",
  "activeMembership": {
    "organizationId": "ffffffff-0000-0000-0000-000000000001",
    "organizationName": "FitiPlus Core",
    "organizationType": "nutrition_center",
    "membershipId": "uuid-membresia",
    "role": "client",
    "permissions": []
  }
}
```

**Notas sobre los campos:**
| Campo | Tipo | Puede ser null |
|-------|------|----------------|
| `gender` | `'male'` \| `'female'` \| `'other'` | ✅ Si no fue registrado |
| `dateOfBirth` | ISO 8601 timestamp | ✅ Si no fue registrado |
| `organizations` | Array | ❌ Siempre array (puede ser vacío `[]`) |
| `activeOrganizationId` | UUID string | ✅ Si no tiene organizaciones |
| `activeMembership` | Objeto | ✅ Si no tiene org activa |

---

### 5.2 `GET /user/profile`

**Autenticación:** Requerida  
**Alias exacto** de `GET /auth/profile`. Misma respuesta, mismos errores.

> Esta ruta existe porque el frontend la referencia en su configuración de endpoints como `/user/profile`. Ambas rutas funcionan de forma idéntica.

---

### 5.3 `PUT /auth/profile`

**Autenticación:** Requerida  

**Request (todos los campos son opcionales):**
```json
{
  "firstName": "Juan",
  "lastName": "García",
  "email": "nuevo@example.com"
}
```

**Validaciones:**
| Campo | Regla |
|-------|-------|
| `firstName` | String, opcional |
| `lastName` | String, opcional |
| `email` | Email válido, opcional |
| `isActive` | Boolean, opcional |

**Response `200`:** Entidad `User` completa actualizada.

---

## 6. Endpoints de nutrición

---

### 6.1 `GET /nutrition/recipes/random`

**Autenticación:** Requerida  
**Body:** Ninguno  

**Response `200`:**
```json
{
  "desayuno": [
    {
      "id": "uuid-receta",
      "name": "Tostadas francesas",
      "calories": 420,
      "proteins": 18.5,
      "type": "desayuno",
      "image": "https://storage.googleapis.com/fitiplus-dev.appspot.com/recipe/uuid.jpg"
    }
  ],
  "almuerzo": [ ... ],
  "cena": [ ... ],
  "snacks": [ ... ]
}
```

**Notas:**
- Devuelve **una receta aleatoria** por cada tipo de comida.
- Si no hay recetas para un tipo, el array de ese tipo viene **vacío `[]`**.
- El campo `image` es una **URL pública de Firebase Storage** (string) o `null` si la receta no tiene imagen.
- La propiedad `image` NO es un objeto Buffer. Si el frontend tiene código que verifica `image.data`, ese código ya no aplica: comparar directamente como string.

---

### 6.2 `GET /clients/recipes/detail`

**Autenticación:** Requerida  
**Query param:** `id` (UUID de la receta) — **requerido**

**Request:**
```http
GET /clients/recipes/detail?id=a3f2b1c4-1234-5678-abcd-ef0123456789
Authorization: Bearer <token>
```

**Response `200`:**
```json
{
  "id": "uuid-receta",
  "name": "Tostadas francesas",
  "description": "Receta clásica de tostadas francesas.",
  "totalCalories": 420,
  "imageUrl": "https://storage.googleapis.com/fitiplus-dev.appspot.com/recipe/uuid.jpg",
  "mealTypeName": "desayuno",
  "matchPercentage": 0,
  "matchedIngredients": [],
  "macros": {
    "proteins": 18.5,
    "carbohydrates": 42.0,
    "fats": 12.3
  },
  "ingredients": [
    { "name": "huevos", "amount": 2, "unit": "unidad" },
    { "name": "pan blanco", "amount": 60, "unit": "g" }
  ],
  "steps": ["Batir huevos", "Remojar pan", "Cocinar en sartén"],
  "servings": 1,
  "prepTimeMinutes": 15
}
```

**Notas:**
- `imageUrl` es una **URL pública de texto** (string). Ya NO usa `encode(bytea, 'base64')`. El frontend puede usarla directamente en un `<img src>`.
- `matchPercentage` siempre es `0` cuando se consulta por ID directo (solo tiene valor en el flujo de generación de receta).
- `macros` puede contener `0` si la receta no tiene datos nutricionales vinculados en la BD.
- `steps` es un array de strings (puede ser `[]` si no se cargaron).

**Errores:**
| HTTP | Condición |
|------|-----------|
| `404` | No existe receta con ese ID o está inactiva (`is_active = false`) |
| `400` | Parámetro `id` ausente |

---

### 6.3 `POST /clients/recipe-generation/only-text`

**Autenticación:** Requerida  
**Content-Type:** `application/json`

**Request:**
```json
{
  "ingredients": ["huevos", "pan blanco", "canela", "leche"]
}
```

**Validaciones:**
| Campo | Regla |
|-------|-------|
| `ingredients` | Array de strings, no vacío, requerido |

**Response `200`:**
```json
{
  "processId": "uuid-del-proceso",
  "recipeId": "uuid-receta-encontrada",
  "matchedRecipe": {
    "id": "uuid-receta",
    "name": "Tostadas francesas",
    "matchPercentage": 0.75,
    "matchedIngredients": ["huevos", "pan blanco"]
  },
  "status": "completed"
}
```

**Si no hay coincidencia (`recipeId` es null):**
```json
{
  "processId": "uuid-del-proceso",
  "recipeId": null,
  "matchedRecipe": null,
  "status": "completed"
}
```

**Flujo en el frontend:**
1. Guardar `processId` y `recipeId` en `localStorage.generated_recipe_info`.
2. Redirigir a `/recipe-generation` (pantalla de simulación de carga).
3. Pantalla `/recipe-generation` redirige a `/recipe/<recipeId>` si `recipeId` existe, o a `/recipe/generated-recipe` como fallback.
4. En `/recipe/<recipeId>` llamar a `GET /clients/recipes/detail?id=<recipeId>`.

---

### 6.4 `POST /clients/recipe-generation/only-images`

**Autenticación:** Requerida  
**Content-Type:** `multipart/form-data`

**Request:**
```
POST /clients/recipe-generation/only-images
Authorization: Bearer <token>
Content-Type: multipart/form-data

files: [imagen1.jpg, imagen2.jpg]   ← campo "files", múltiples archivos permitidos
```

**Response `200`:** Idéntico a `POST /clients/recipe-generation/only-text`.

**Comportamiento:**
1. El backend llama al servicio de IA en `BACKEND_URL_IA/api/ingredients/detect` con las imágenes.
2. Si el servicio de IA detecta ingredientes, se ejecuta la lógica de matching de recetas.
3. Si el servicio de IA no está disponible o falla, devuelve `400 Bad Request`.

**Errores:**
| HTTP | Condición |
|------|-----------|
| `400` | No se enviaron archivos |
| `400` | El servicio de IA no respondió o falló |

---

## 7. Endpoints de onboarding

Estos endpoints **existen en el backend** pero el frontend aún no los consume activamente (pendientes de conectar).

| Endpoint | Método | Auth | Descripción |
|----------|--------|------|-------------|
| `/welcome/cards` | GET | ✅ | Tarjetas de bienvenida |
| `/onboarding/stages` | GET | ✅ | Etapas del onboarding |
| `/onboarding/goals` | GET | ✅ | Objetivos disponibles |
| `/onboarding/allergies` | GET | ✅ | Alergias disponibles |
| `/onboarding/step-1` | POST | ✅ | Guardar datos básicos (peso, talla, edad) |
| `/onboarding/step-2` | POST | ✅ | Guardar objetivo seleccionado |
| `/onboarding/step-3` | POST | ✅ | Guardar alergias seleccionadas |
| `/onboarding/progress` | GET | ✅ | Estado de avance del onboarding |

> Consultar Swagger para los contratos completos de estos endpoints: `{BASE_URL}/api/docs#/Onboarding`

---

## 8. Catálogo de códigos de error

### Estructura estándar de error

```json
{
  "statusCode": 401,
  "message": "Credenciales inválidas",
  "error": "Unauthorized"
}
```

### Errores de validación `400`

```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be longer than or equal to 6 characters"
  ],
  "error": "Bad Request"
}
```

El campo `message` es un **array de strings** cuando hay múltiples errores de validación.

### Tabla de errores frecuentes

| HTTP | `message` | Causa |
|------|-----------|-------|
| `400` | `"ingredients must be an array"` | Se envió `ingredients` como string en vez de array |
| `400` | `"ingredients should not be empty"` | Array vacío `[]` |
| `400` | `"organizationId must be a valid UUID format"` | UUID con formato inválido |
| `401` | `"Credenciales inválidas"` | Email o contraseña incorrectos |
| `401` | `"Usuario inactivo"` | Cuenta con `status !== 'active'` |
| `401` | `"La contraseña actual es incorrecta"` | `currentPassword` incorrecto en change-password |
| `401` | `"No perteneces a esa organización"` | switch-organization con org a la que no pertenece |
| `401` | `"Usuario no válido o inactivo"` | refresh con token de cuenta suspendida |
| `404` | `"Receta no encontrada"` | ID no existe o receta con `is_active = false` |
| `409` | `"El email ya está registrado"` | Register con email duplicado |

---

## 9. Campos nulos — comportamiento esperado

El frontend debe manejar `null` en los siguientes campos **sin romper el render**:

| Endpoint | Campo | Cuándo es null |
|----------|-------|----------------|
| `GET /auth/profile` | `gender` | Usuario no completó perfil |
| `GET /auth/profile` | `dateOfBirth` | Usuario no completó perfil |
| `GET /auth/profile` | `activeOrganizationId` | Usuario sin organizaciones |
| `GET /auth/profile` | `activeMembership` | Sin org activa asignada |
| `GET /nutrition/recipes/random` | `image` (en cada item) | Receta sin imagen cargada |
| `GET /clients/recipes/detail` | `imageUrl` | Receta sin imagen |
| `GET /clients/recipes/detail` | `description` | Receta sin descripción |
| `GET /clients/recipes/detail` | `servings` | No fue cargado al crear la receta |
| `GET /clients/recipes/detail` | `prepTimeMinutes` | No fue cargado al crear la receta |
| `POST .../only-text` | `recipeId` | No se encontró coincidencia con los ingredientes |
| `POST .../only-text` | `matchedRecipe` | Mismo caso anterior |

---

## 10. Consideraciones de producción

### Variables de entorno del backend relevantes para el frontend

| Variable | Uso |
|----------|-----|
| `JWT_EXPIRES_IN` | Duración del token (actualmente `24h`). El frontend debe refrescar **antes** de este tiempo |
| `FIREBASE_STORAGE_BUCKET` | Bucket donde se almacenan las imágenes — las URLs de imágenes apuntarán a este bucket |
| `BACKEND_URL_IA` | URL del servicio de IA para detección de ingredientes en imágenes |

### Refresh token en producción

El sistema actual **no implementa un refresh token real** (token separado de larga duración). El "refresh token" que el frontend guarda en `fitiplus_refresh_token` es el mismo access token de 24 h.

Para un sistema más robusto en producción se requiere:
- Access token de corta duración (15–30 min)
- Refresh token de larga duración (7–30 días) persistido en BD
- Rotación automática de refresh tokens

### Reset de contraseña en producción

El endpoint `POST /auth/reset-password` **cambia la contraseña directamente** sin verificación por email. Para producción se debe:
1. Implementar `POST /auth/forgot-password` → envía email con token de un solo uso
2. Implementar `POST /auth/reset-password/confirm` → valida el token antes de cambiar contraseña
3. El endpoint actual puede deshabilitarse o reemplazarse

### HTTPS y tokens en móvil

- En producción usar siempre HTTPS. El backend no aceptará peticiones en HTTP con credenciales.
- Android requiere `network_security_config.xml` para tráfico HTTPS en debug. Ver `docs/reporte_app.md §6`.
- `localStorage` es accesible desde JavaScript. Para mayor seguridad en producción considerar almacenamiento seguro nativo (`SecureStorage` en Ionic/Capacitor).
