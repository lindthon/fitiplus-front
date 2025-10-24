# Configuración de API Externa - FitiPlus

## Variables de Entorno

Para conectar con tu servicio externo, necesitas crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```bash
# URL base del API externo
VITE_API_BASE_URL=https://tu-api.com

# Timeout para las peticiones (en milisegundos)
VITE_API_TIMEOUT=10000

# Versión del API
VITE_API_VERSION=v1
```

## Configuración por Entorno

### Desarrollo Local

```bash
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=5000
```

### Staging

```bash
VITE_API_BASE_URL=https://staging-api.fitiplus.com
VITE_API_TIMEOUT=15000
```

### Producción

```bash
VITE_API_BASE_URL=https://api.fitiplus.com
VITE_API_TIMEOUT=10000
```

## Endpoints Esperados

El servicio está configurado para usar estos endpoints:

- `POST /auth/login` - Iniciar sesión
- `POST /auth/register` - Registro de usuario
- `POST /auth/logout` - Cerrar sesión
- `POST /auth/refresh` - Renovar token
- `POST /auth/change-password` - Cambiar contraseña
- `POST /auth/reset-password` - Recuperar contraseña
- `GET /user/profile` - Obtener perfil

## Formato de Respuesta Esperado

### Login/Register Exitoso

```json
{
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "avatar": "string",
    "phone": "string",
    "dateOfBirth": "string",
    "gender": "string",
    "preferences": {
      "dietaryRestrictions": ["string"],
      "allergies": ["string"],
      "fitnessGoals": ["string"],
      "activityLevel": "string"
    }
  },
  "token": "string",
  "refreshToken": "string",
  "isOnboardingCompleted": boolean
}
```

### Error

```json
{
  "message": "string",
  "error": "string"
}
```

## Características Implementadas

✅ **Conexión a API Externa**: Configurable por variables de entorno
✅ **Manejo de Errores**: Timeouts, errores de red, errores del servidor
✅ **Modo Offline**: Fallback cuando no hay conexión
✅ **Refresh Token**: Renovación automática de tokens
✅ **Almacenamiento Local**: Persistencia de datos de usuario
✅ **Detección de Conectividad**: Manejo automático de online/offline

## Uso

```typescript
import { authService } from './services/AuthService';

// Login
const result = await authService.login({
  email: 'usuario@ejemplo.com',
  password: 'contraseña',
});

// Registro
const result = await authService.register({
  email: 'usuario@ejemplo.com',
  password: 'contraseña',
  name: 'Nombre Usuario',
});

// Obtener perfil
const profile = await authService.getUserProfile();
```
