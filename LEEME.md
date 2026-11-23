# Cambios para Rastreo Ambiental (D2: integración, errores, roles)

Copia el contenido de este ZIP en la raíz del repo, respetando las carpetas
(reemplaza los archivos existentes). Luego:

1. `cd backend && npm install && npm test`   -> deben pasar 13 pruebas.
2. `npm run db:init` crea las tablas nuevas (camion, ruta, punto_ruta,
   asignacion_ruta, reporte, ubicacion, recoleccion). Es idempotente.
3. Despliegue: Render ejecuta `start:prod`, que ya corre init-db antes de arrancar.
4. En el frontend: `cd frontend && npm run build` (compila sin errores de TypeScript).

## Qué incluye
- Backend: middleware requireAuth/requireRole, CRUD de camiones, rutas (con puntos,
  en transacción), asignaciones (con reglas de negocio) y reportes; errores de
  integridad de MySQL traducidos a mensajes claros.
- Frontend: ProtectedRoute valida con el servidor (GET /session); corregido el cierre
  de sesión (se borraba la clave "rastreoUser" en vez de "usuario"); Camiones y Rutas
  conectados a la API real.
- Pruebas: backend/tests/permisos.test.js.
