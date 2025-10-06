# Sistema de Autenticación - FitiPlus

## Descripción

Se ha implementado un sistema completo de autenticación para la aplicación FitiPlus usando Ionic React. El sistema incluye:

- Página de inicio de sesión con formulario validado
- Servicio de autenticación con gestión de estado
- Protección de rutas
- Componente de logout
- Persistencia de sesión en localStorage

## Archivos Creados

### Páginas (Organizadas por carpetas)

- `src/pages/Login/` - Carpeta de la página de login
  - `Login.tsx` - Componente de inicio de sesión
  - `Login.css` - Estilos para la página de login
  - `index.ts` - Exportación del componente
- `src/pages/Tab1/` - Carpeta de Tab1
  - `Tab1.tsx` - Componente de Tab1
  - `Tab1.css` - Estilos de Tab1
  - `index.ts` - Exportación del componente
- `src/pages/Tab2/` - Carpeta de Tab2
  - `Tab2.tsx` - Componente de Tab2
  - `Tab2.css` - Estilos de Tab2
  - `index.ts` - Exportación del componente
- `src/pages/Tab3/` - Carpeta de Tab3
  - `Tab3.tsx` - Componente de Tab3
  - `Tab3.css` - Estilos de Tab3
  - `index.ts` - Exportación del componente

### Servicios

- `src/services/AuthService.ts` - Servicio de autenticación con patrón Singleton

### Componentes

- `src/components/AuthGuard.tsx` - Guardia para rutas protegidas (nuevo)
- `src/components/LoginGuard.tsx` - Guardia para página de login (nuevo)
- `src/components/ProtectedRoute.tsx` - Componente para proteger rutas (legacy)
- `src/components/LogoutButton.tsx` - Botón para cerrar sesión

### Configuración

- `src/config/routes.ts` - Configuración centralizada de rutas

### Archivos Modificados

- `src/App.tsx` - Actualizado con nuevas rutas y protección
- `src/pages/Tab1/Tab1.tsx` - Actualizado para mostrar información del usuario

## Credenciales de Prueba

Para probar el sistema de autenticación, usa estas credenciales:

- **Email:** `admin@fitiplus.com`
- **Contraseña:** `admin123`

## Características Implementadas

### ✅ Funcionalidades Principales

- [x] Formulario de login con validación
- [x] Validación de email y contraseña
- [x] Mostrar/ocultar contraseña
- [x] Estados de carga durante autenticación
- [x] Manejo de errores con alertas
- [x] Persistencia de sesión con verificación automática
- [x] Protección de rutas con AuthGuard
- [x] Redirección automática de usuarios autenticados
- [x] Verificación de tokens con expiración (24 horas)
- [x] Logout funcional
- [x] Limpieza automática de sesiones expiradas

### ✅ Mejoras de UX/UI

- [x] Diseño responsivo
- [x] Animaciones suaves
- [x] Gradientes y efectos visuales
- [x] Soporte para modo oscuro
- [x] Iconos intuitivos
- [x] Feedback visual para el usuario

### ✅ Arquitectura

- [x] Patrón Singleton para el servicio de autenticación
- [x] Separación de responsabilidades
- [x] TypeScript con tipado fuerte
- [x] Componentes reutilizables
- [x] Manejo de estado centralizado

## Estructura de Rutas

Las rutas están centralizadas en `src/config/routes.ts`:

```typescript
export const ROUTES = {
  LOGIN: '/login', // Página de inicio de sesión
  ROOT: '/', // Redirige a /login
  TABS: '/tabs', // Rutas protegidas (requieren autenticación)
  TAB1: '/tabs/tab1', // Tab 1 (con información del usuario)
  TAB2: '/tabs/tab2', // Tab 2
  TAB3: '/tabs/tab3', // Tab 3
} as const;
```

### Flujo de Navegación Mejorado

```
/ (raíz) → Redirige a /login
/login → LoginGuard verifica si ya está autenticado
  ├── Si está autenticado → Redirige a /tabs/tab1
  └── Si no está autenticado → Muestra página de login
/tabs → AuthGuard verifica autenticación
  ├── Si está autenticado → Muestra contenido protegido
  └── Si no está autenticado → Redirige a /login
  ├── /tabs/tab1 → Tab 1 (con información del usuario)
  ├── /tabs/tab2 → Tab 2
  └── /tabs/tab3 → Tab 3
```

### 🔐 Sistema de Verificación de Autenticación

1. **AuthGuard**: Protege todas las rutas `/tabs/*`

   - Verifica si el usuario está autenticado
   - Valida la expiración del token (24 horas)
   - Intenta renovar tokens expirados
   - Redirige a login si no está autenticado

2. **LoginGuard**: Protege la página de login

   - Verifica si el usuario ya está autenticado
   - Redirige a la página principal si ya tiene sesión válida
   - Permite acceso a login solo si no está autenticado

3. **Verificación Automática**:
   - Al cargar la aplicación, verifica sesiones almacenadas
   - Limpia automáticamente sesiones expiradas
   - Mantiene la sesión activa mientras el token sea válido

## Uso del Servicio de Autenticación

```typescript
import { authService } from '../services/AuthService';

// Iniciar sesión
const response = await authService.login({
  email: 'usuario@ejemplo.com',
  password: 'contraseña',
});

// Verificar autenticación
const isAuthenticated = authService.isAuthenticated();

// Obtener usuario actual
const user = authService.getCurrentUser();

// Cerrar sesión
authService.logout();
```

## Próximas Mejoras Sugeridas

- [ ] Integración con API real
- [ ] Registro de nuevos usuarios
- [ ] Recuperación de contraseña
- [ ] Autenticación con redes sociales
- [ ] Biometría (huella dactilar/face ID)
- [ ] Refresh tokens automático
- [ ] Validación de contraseña más robusta
- [ ] Rate limiting para intentos de login

## Tecnologías Utilizadas

- **Ionic React** - Framework de UI
- **TypeScript** - Tipado estático
- **React Router** - Enrutamiento
- **Ionicons** - Iconos
- **CSS3** - Estilos y animaciones
- **localStorage** - Persistencia de datos

## Instalación y Ejecución

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build
```

### 📁 Estructura de Archivos Aplicando Buenas Prácticas:

```
src/
├── pages/                 # Páginas organizadas por carpetas
│   ├── Login/            # Carpeta de Login
│   │   ├── Login.tsx     # Componente de login
│   │   ├── Login.css     # Estilos del login
│   │   └── index.ts      # Exportación del componente
│   ├── Tab1/             # Carpeta de Tab1
│   │   ├── Tab1.tsx      # Componente de Tab1
│   │   ├── Tab1.css      # Estilos de Tab1
│   │   └── index.ts      # Exportación del componente
│   ├── Tab2/             # Carpeta de Tab2
│   │   ├── Tab2.tsx      # Componente de Tab2
│   │   ├── Tab2.css      # Estilos de Tab2
│   │   └── index.ts      # Exportación del componente
│   └── Tab3/             # Carpeta de Tab3
│       ├── Tab3.tsx      # Componente de Tab3
│       ├── Tab3.css      # Estilos de Tab3
│       └── index.ts      # Exportación del componente
├── services/
│   └── AuthService.ts    # Servicio de autenticación
├── components/
│   ├── ProtectedRoute.tsx # Protección de rutas
│   └── LogoutButton.tsx  # Botón de logout
├── config/
│   └── routes.ts         # Configuración centralizada de rutas
└── App.tsx               # Enrutamiento actualizado
```

### 🎯 Beneficios de la Nueva Estructura:

- **Organización por carpetas**: Cada página tiene su propia carpeta con todos sus archivos relacionados
- **Imports más limpios**: Los archivos `index.ts` permiten imports más simples (`import Login from './pages/Login'`)
- **Escalabilidad**: Fácil agregar nuevas páginas siguiendo el mismo patrón
- **Mantenibilidad**: Cada página es independiente y fácil de mantener
- **Rutas centralizadas**: Todas las rutas están definidas en un solo lugar

El sistema está listo para usar y puede ser fácilmente extendido con funcionalidades adicionales según las necesidades del proyecto.
