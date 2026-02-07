# FitiPlus Frontend – Rutas disponibles

Este documento resume las rutas definidas en la app y qué acceso requieren. Fuente principal: `src/config/routes.ts`.

## Rutas públicas (sin sesión)
- `/login`
- `/register-client`
- `/presentation`
- `/form`
- `/` (redirige a `/login`)

## Rutas protegidas (requieren sesión válida)
- `/tabs` (layout principal de tabs)
- `/tabs/tab1` (inicio)
- `/tabs/tab2` (medallas)
- `/tabs/tab3` (historial)
- `/tabs/tab4` (perfil)
- `/recipe/:id` (detalle de receta)
- `/ingredient-selection`
- `/meal-registration`
- `/recipe-generation`
- `/profile`

## Notas de autenticación
- Las rutas protegidas usan el guardia sencillo `SimpleAuthCheck` (`src/components/SimpleAuthCheck.tsx`) que verifica `fitiplus_user` y `fitiplus_token` en `localStorage`.
- `PROTECTED_ROUTES` y `PUBLIC_ROUTES` se exportan desde `src/config/routes.ts` para reuso en validaciones.
