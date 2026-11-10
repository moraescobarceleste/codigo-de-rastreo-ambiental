# Rastreo Ambiental — Sistema de Gestión de Reciclaje

Aplicación web para gestionar el proceso de reciclaje: registro de usuarios por rol, rutas de
recolección, materiales reciclables y reportes. Proyecto académico SENA (ADSO).

## Tecnologías

| Capa | Tecnologías |
|------|-------------|
| Frontend | React 19, TypeScript, Vite, React Router |
| Backend | Node.js, Express 5, express-session, bcryptjs |
| Base de datos | MySQL (mysql2) |

## Estructura del repositorio

```text
proyecto-sena-rastreo/
├── backend/                  API REST (Express)
│   ├── src/
│   │   ├── config/           variables de entorno y conexión a MySQL
│   │   ├── routes/           definición de endpoints
│   │   ├── controllers/      reciben la petición y responden
│   │   ├── services/         lógica de negocio y consultas SQL
│   │   ├── middlewares/      manejo de errores
│   │   ├── app.js            configuración de Express
│   │   └── server.js         punto de entrada
│   └── .env.example
├── frontend/                 Interfaz (React + Vite)
│   └── src/
│       ├── assets/           imágenes
│       ├── components/       componentes reutilizables
│       ├── layouts/          estructuras de página por rol
│       ├── pages/            Administrador, Auth, Ciudadano, Conductor, Funcionario
│       ├── routes/           protección de rutas
│       ├── services/         llamadas a la API
│       └── styles/           CSS global
├── database/
│   └── schema.sql            creación de la base de datos y tablas
├── docs/
│   ├── requisitos/           SRS, casos de uso, modelos conceptuales
│   ├── diagramas/            MER y diagrama de actividades
│   └── guias/                material de clase
├── practicas/                ejercicios de React (no son parte de la app)
├── package.json              scripts para ejecutar todo desde la raíz
└── README.md
```

## Requisitos

- Node.js 20 o superior
- MySQL 8 (o MariaDB)

## Puesta en marcha

1. **Instalar dependencias**

   ```bash
   npm run install:all
   ```

2. **Crear la base de datos**

   ```bash
   mysql -u root -p < database/schema.sql
   ```

3. **Configurar variables de entorno**

   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

   Edita `backend/.env` con tus datos de MySQL y un `SESSION_SECRET` propio.

4. **Ejecutar backend y frontend a la vez**

   ```bash
   npm run dev
   ```

   - Frontend: http://localhost:5173
   - API: http://localhost:3000/api/health

   También se pueden levantar por separado con `npm run dev:backend` y `npm run dev:frontend`.

## Endpoints actuales

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/health` | Estado de la API |
| POST | `/api/register` | Registro de usuario |
| POST | `/api/login` | Inicio de sesión |
| POST | `/api/logout` | Cierre de sesión |
| GET | `/api/session` | Usuario de la sesión actual |

## Rutas del frontend

`/`, `/login`, `/register`, `/terms`, y por rol: `/administrador/*`, `/ciudadano/*`,
`/conductor/*`, `/funcionario/*`.

## Cómo agregar un módulo nuevo (ejemplo: camiones)

1. `database/schema.sql`: agregar la tabla.
2. `backend/src/services/camiones.service.js`: consultas SQL.
3. `backend/src/controllers/camiones.controller.js`: manejo de la petición.
4. `backend/src/routes/camiones.routes.js` y montarlo en `routes/index.js`.
5. `frontend/src/services/`: función que llame al endpoint, y usarla desde la página.

## Estado del proyecto

En desarrollo. Pendiente: conectar el login del frontend a la API, proteger rutas con la sesión
del servidor y crear los endpoints de camiones, rutas, reportes y reciclaje.

## Integrantes

- Dilan Andrey
- Celeste Mora
- Sara Peña
- Sharon Mosquera
