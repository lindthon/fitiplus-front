# 📊 Logs de Monitoreo - AuthService

## 🔍 Sistema de Logging Implementado

Se ha implementado un sistema completo de logs de monitoreo para el API de login y todas las peticiones HTTP.

### 📋 Tipos de Logs

#### 🔐 **Logs de Login**

- **Inicio del proceso**: Información inicial del login
- **Modo offline**: Cuando no hay conexión
- **Petición al API**: Detalles de la petición HTTP
- **Login exitoso**: Datos del usuario y tokens
- **Errores**: Errores del API o críticos
- **Almacenamiento**: Confirmación de guardado en localStorage

#### 📝 **Logs de Registro**

- **Inicio del proceso**: Información inicial del registro
- **Datos del formulario**: Campos completados (sin datos sensibles)
- **Modo offline**: Cuando no hay conexión
- **Petición al API**: Detalles de la petición HTTP
- **Registro exitoso**: Datos del usuario y tokens
- **Errores**: Errores del API o críticos
- **Almacenamiento**: Confirmación de guardado en localStorage

#### 🌐 **Logs HTTP**

- **Inicio de petición**: Método, URL, headers
- **Datos enviados**: Tamaño y claves de los datos
- **Respuesta recibida**: Status, tiempo de respuesta, headers
- **Petición exitosa**: Status y datos de respuesta
- **Errores**: Timeouts, errores de red, errores del servidor

#### 📱 **Logs Offline**

- **Login offline**: Proceso de autenticación sin conexión
- **Validación**: Resultado de credenciales offline
- **Almacenamiento**: Guardado de datos offline

### 🏷️ Formato de Logs

Cada log incluye:

- **Emoji identificador**: Para fácil identificación visual
- **Categoría**: `[LOGIN]`, `[HTTP]`, `[OFFLINE]`
- **Request ID**: ID único para rastrear peticiones
- **Timestamp**: Marca de tiempo ISO
- **Datos contextuales**: Información relevante según el tipo de log

### 📝 Ejemplo de Logs

```javascript
// Inicio de login
🔐 [LOGIN] Iniciando proceso de login {
  requestId: "req_1697890123456_abc123def",
  email: "usuario@ejemplo.com",
  timestamp: "2023-10-21T20:18:43.456Z",
  isOnline: true,
  apiUrl: "https://api.fitiplus.com"
}

// Inicio de registro
📝 [REGISTER] Iniciando proceso de registro {
  requestId: "req_1697890123457_def456ghi",
  email: "nuevo@ejemplo.com",
  name: "Usuario Nuevo",
  hasPhone: false,
  hasDateOfBirth: false,
  hasGender: false,
  timestamp: "2023-10-21T20:18:43.456Z",
  isOnline: true,
  apiUrl: "https://api.fitiplus.com"
}

// Petición HTTP
🌐 [HTTP] Iniciando petición {
  requestId: "req_1697890123456_abc123def",
  method: "POST",
  url: "https://api.fitiplus.com/v1/auth/login",
  endpoint: "/auth/login",
  hasData: true,
  hasAuth: false,
  timeout: 10000,
  timestamp: "2023-10-21T20:18:43.456Z"
}

// Datos enviados
📤 [HTTP] Datos enviados {
  requestId: "req_1697890123456_abc123def",
  dataSize: 45,
  dataKeys: ["email", "password"]
}

// Respuesta recibida
📥 [HTTP] Respuesta recibida {
  requestId: "req_1697890123456_abc123def",
  status: 200,
  statusText: "OK",
  responseTime: "1250ms",
  headers: { "content-type": "application/json", ... }
}

// Login exitoso
✅ [LOGIN] Login exitoso {
  requestId: "req_1697890123456_abc123def",
  userId: "user_123",
  userEmail: "usuario@ejemplo.com",
  userName: "Usuario",
  tokenLength: 156,
  refreshTokenLength: 200,
  isOnboardingCompleted: true,
  duration: "1250ms"
}

// Registro exitoso
✅ [REGISTER] Registro exitoso {
  requestId: "req_1697890123457_def456ghi",
  userId: "user_456",
  userEmail: "nuevo@ejemplo.com",
  userName: "Usuario Nuevo",
  tokenLength: 156,
  refreshTokenLength: 200,
  duration: "1800ms"
}

// Almacenamiento
💾 [LOGIN] Datos guardados en localStorage {
  requestId: "req_1697890123456_abc123def",
  userId: "user_123"
}
```

### 🚨 Logs de Error

```javascript
// Error del API - Login
❌ [LOGIN] Error en respuesta del API {
  requestId: "req_1697890123456_abc123def",
  error: "Credenciales inválidas",
  statusCode: 401,
  duration: "800ms"
}

// Error del API - Registro
❌ [REGISTER] Error en respuesta del API {
  requestId: "req_1697890123457_def456ghi",
  error: "El email ya está registrado",
  statusCode: 409,
  duration: "1200ms"
}

// Timeout
⏰ [HTTP] Timeout {
  requestId: "req_1697890123456_abc123def",
  timeout: 10000,
  responseTime: "10000ms",
  url: "https://api.fitiplus.com/v1/auth/login"
}

// Error de red
💥 [HTTP] Error de red {
  requestId: "req_1697890123456_abc123def",
  error: "Failed to fetch",
  errorType: "TypeError",
  responseTime: "5000ms",
  url: "https://api.fitiplus.com/v1/auth/login",
  stack: "TypeError: Failed to fetch..."
}
```

### 🔧 Cómo Usar los Logs

#### **En Desarrollo**

1. Abre las **DevTools** del navegador
2. Ve a la pestaña **Console**
3. Realiza un login
4. Observa todos los logs en tiempo real

#### **En Producción**

Los logs se pueden enviar a servicios de monitoreo como:

- **Sentry** para errores
- **LogRocket** para sesiones
- **DataDog** para métricas
- **New Relic** para performance

### 📊 Métricas Disponibles

- **Tiempo de respuesta**: Duración de cada petición
- **Tasa de éxito**: Porcentaje de logins exitosos
- **Errores por tipo**: Clasificación de errores
- **Tiempo de almacenamiento**: Duración del proceso completo
- **Modo offline**: Frecuencia de uso offline

### 🎯 Beneficios

✅ **Debugging**: Identificar problemas rápidamente
✅ **Performance**: Monitorear tiempos de respuesta
✅ **Errores**: Rastrear y clasificar errores
✅ **UX**: Identificar problemas de experiencia de usuario
✅ **Analytics**: Datos para mejorar el servicio
✅ **Soporte**: Información detallada para soporte técnico

### 🔒 Privacidad

Los logs **NO incluyen**:

- Contraseñas en texto plano
- Datos sensibles del usuario
- Tokens completos (solo longitud)

Los logs **SÍ incluyen**:

- Emails (para debugging)
- IDs de usuario
- Tiempos de respuesta
- Códigos de error
- Metadatos técnicos
