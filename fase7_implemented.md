# ✅ Fase 7 — Implementada: Auditoría y Completado de API del Frontend Móvil

**Fecha:** 25/02/2026  
**Módulos afectados:** `auth`, `client`  
**Base de referencia:** `docs/reporte_app.md`

---

## Objetivo

Auditar los servicios API que consume el frontend móvil FitiPlus (reportados en `docs/reporte_app.md`), implementar los endpoints faltantes y corregir el bug de `imageUrl` detectado en el endpoint de detalle de receta.

---

## 1. Análisis de Cobertura Previa

Se cruzaron todos los endpoints del reporte contra los controladores existentes:

| Endpoint | Usado por el frontend | Estado previo | Resultado |
|----------|----------------------|---------------|-----------|
| `POST /auth/login` | ✅ | ✅ Existía | Sin cambios |
| `POST /auth/register-client` | ✅ | ✅ Existía | Sin cambios |
| `POST /auth/refresh` | ✅ | ❌ Faltaba | ✅ Implementado |
| `POST /auth/logout` | Config (no conectado) | ❌ Faltaba | ✅ Implementado |
| `POST /auth/change-password` | Config (no conectado) | ❌ Faltaba | ✅ Implementado |
| `POST /auth/reset-password` | Config (no conectado) | ❌ Faltaba | ✅ Implementado |
| `GET /auth/profile` | ✅ | ✅ Existía | Sin cambios |
| `GET /user/profile` | Config (`/user/profile`) | ❌ Faltaba | ✅ Implementado |
| `GET /nutrition/recipes/random` | ✅ | ✅ Existía, formato correcto | Sin cambios |
| `GET /clients/recipes/detail?id=` | ✅ | ✅ Existía, bug en imageUrl | ✅ Bug corregido |
| `POST /clients/recipe-generation/only-text` | ✅ | ✅ Existía | Sin cambios |
| `POST /clients/recipe-generation/only-images` | ✅ | ✅ Existía | Sin cambios |

---

## 2. Endpoints Implementados

### 2.1 `POST /auth/refresh`

**Propósito:** Emite un nuevo JWT fresco para el usuario autenticado, manteniendo la misma organización activa.  
**Autenticación:** Requiere `Authorization: Bearer <token>` (el mismo access token o el refresh token guardado en `fitiplus_refresh_token`).

**Request:**
```http
POST /auth/refresh
Authorization: Bearer <access_token>
```

**Response `200`:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Notas:**
- El sistema usa JWT stateless; el "refresh token" del cliente es en realidad el mismo access token de larga duración (`JWT_EXPIRES_IN=24h`).
- Este endpoint permite al guardia `AuthGuard` del frontend renovar el token sin forzar un nuevo login.

---

### 2.2 `POST /auth/logout`

**Propósito:** Registra el cierre de sesión en el servidor. Con JWT stateless no existe invalidación real; el cliente debe eliminar `fitiplus_token` y `fitiplus_refresh_token` de `localStorage`.  
**Autenticación:** Requiere `Authorization: Bearer <token>`.

**Request:**
```http
POST /auth/logout
Authorization: Bearer <access_token>
```

**Response `200`:**
```json
{
  "message": "Sesión cerrada correctamente"
}
```

---

### 2.3 `POST /auth/change-password`

**Propósito:** Permite al usuario autenticado cambiar su contraseña proporcionando la contraseña actual para confirmar identidad.  
**Autenticación:** Requiere `Authorization: Bearer <token>`.

**Request:**
```http
POST /auth/change-password
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "currentPassword": "password123",
  "newPassword": "nuevaPassword456"
}
```

**Response `200`:**
```json
{
  "message": "Contraseña actualizada correctamente"
}
```

**Errores:**
| HTTP | Descripción |
|------|-------------|
| `401` | Contraseña actual incorrecta |
| `401` | Cuenta no tiene contraseña local (ej: OAuth) |
| `404` | Usuario no encontrado |

---

### 2.4 `POST /auth/reset-password`

**Propósito:** Restablece la contraseña de un usuario usando su email. No requiere autenticación.  
> ⚠️ **Nota para producción:** Este endpoint realiza el cambio directamente sin verificación por correo. Para producción se debe integrar un paso previo de envío de código/token por email antes de permitir el cambio.

**Request:**
```http
POST /auth/reset-password
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "newPassword": "nuevaPassword123"
}
```

**Response `200` (siempre, por seguridad):**
```json
{
  "message": "Si el email está registrado, la contraseña ha sido actualizada"
}
```

**Seguridad:** La respuesta no revela si el email existe o no, para evitar enumeración de usuarios.

---

### 2.5 `GET /user/profile`

**Propósito:** Alias de `GET /auth/profile`, expuesto en la ruta `/user/profile` que consume el frontend según su configuración de endpoints (`/user/profile`).  
**Autenticación:** Requiere `Authorization: Bearer <token>`.

**Request:**
```http
GET /user/profile
Authorization: Bearer <access_token>
```

**Response `200`:**
```json
{
  "id": "uuid-del-usuario",
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "gender": "male",
  "dateOfBirth": "1990-05-15",
  "status": "active",
  "organizations": [
    {
      "organizationId": "ffffffff-0000-0000-0000-000000000001",
      "organizationName": "FitiPlus Core",
      "organizationType": "nutrition_center",
      "membershipId": "uuid-membership",
      "role": "client",
      "permissions": ["view:profile", "view:recipes"]
    }
  ],
  "activeOrganizationId": "ffffffff-0000-0000-0000-000000000001",
  "activeMembership": { ... }
}
```

---

## 3. Bug Corregido

### BUG-F7-01 — `GET /clients/recipes/detail` devolvía `imageUrl` como Base64 en lugar de URL pública

**Archivo:** `src/modules/client/application/services/client.service.ts`  
**Línea afectada:** Query SQL dentro de `getRecipeDetailsById`

**Problema:**  
La query usaba `encode(r.image_url, 'base64')` que solo funciona cuando la columna es de tipo `bytea`. La columna `image_url` fue migrada a tipo `TEXT` para almacenar la URL pública de Firebase Storage, por lo que `encode()` fallaba o devolvía datos corruptos.

**Fix aplicado:**
```sql
-- ❌ Antes (incorrecto para columna TEXT)
encode(r.image_url, 'base64') as "imageUrl"

-- ✅ Después (correcto para columna TEXT)
r.image_url as "imageUrl"
```

**Impacto:** El frontend ahora recibe la URL pública de Firebase correctamente, permitiendo mostrar la imagen de la receta en la pantalla de detalle.

---

## 4. Archivos Modificados

| Archivo | Cambio |
|---------|--------|
| `src/modules/auth/application/dtos/auth.dto.ts` | Agregados `ChangePasswordDto`, `ResetPasswordDto` |
| `src/modules/auth/application/services/auth.service.ts` | Agregados métodos `refreshToken`, `logout`, `changePassword`, `resetPassword` |
| `src/modules/auth/presentation/controllers/auth.controller.ts` | Agregados endpoints `POST /auth/refresh`, `POST /auth/logout`, `POST /auth/change-password`, `POST /auth/reset-password` |
| `src/modules/auth/presentation/controllers/user-profile.controller.ts` | **Nuevo archivo** — Controlador `GET /user/profile` |
| `src/modules/auth/auth.module.ts` | Registrado `UserProfileController` |
| `src/modules/client/application/services/client.service.ts` | Fix: `encode(image_url)` → `image_url` en query SQL |

---

## 5. Endpoints Pendientes de Conectar (Frontend)

Según `docs/reporte_app.md`, los siguientes endpoints existen en el backend pero el frontend aún **no los consume activamente** (controlados por feature flags o pendientes de implementación en la UI):

| Endpoint | Estado backend | Estado frontend |
|----------|---------------|-----------------|
| `GET /welcome/cards` | ✅ Existe | ⏸ No conectado |
| `GET /onboarding/stages` | ✅ Existe | ⏸ No conectado |
| `GET /onboarding/goals` | ✅ Existe | ⏸ No conectado |
| `GET /onboarding/allergies` | ✅ Existe | ⏸ No conectado |
| `POST /onboarding/step-1/2/3` | ✅ Existe | ⏸ No conectado |
| `GET /onboarding/progress` | ✅ Existe | ⏸ No conectado |
| `GET /clients/nutritional-progress` | ✅ Existe (datos mock) | ⏸ Detrás de feature flag |
| `GET /clients/goals-daily` | ✅ Existe (datos mock) | ⏸ Detrás de feature flag |

---

## 6. Consideraciones de Producción

### Refresh Token
El sistema actual utiliza un token de acceso de larga duración (`24h`). Para producción se recomienda implementar un sistema de refresh token dedicado con:
- Token de acceso de corta duración (15 min)
- Refresh token de larga duración (7-30 días) almacenado en base de datos
- Endpoint `POST /auth/refresh` que valide el refresh token desde la BD y emita un nuevo access token

### Reset Password
El endpoint `POST /auth/reset-password` actualmente cambia la contraseña directamente. Para producción se debe:
1. Generar un token temporal de un solo uso
2. Enviarlo al email del usuario
3. Exponer `POST /auth/reset-password/confirm` que valide el token antes de cambiar la contraseña

### Seguridad de Tokens
Los tokens se almacenan en `localStorage` del navegador/app. Para mayor seguridad en producción se recomienda usar `httpOnly cookies` y habilitar CSRF protection.

---

## 7. Validación de Compilación

```
npx tsc --noEmit
→ Exit code: 0 — Sin errores de compilación
```
