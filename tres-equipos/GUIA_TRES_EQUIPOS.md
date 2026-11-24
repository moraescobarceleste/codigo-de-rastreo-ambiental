# Guía: Rastreo Ambiental en tres equipos

| Equipo | Función | Carpeta | Puerto |
|---|---|---|---|
| **A** | Base de datos (MySQL) | `equipo-A-base-de-datos` | 3306 |
| **B** | Backend (API) | `equipo-B-backend` | 3000 |
| **C** | Frontend (página web) | `equipo-C-frontend` | 8080 |

```
Navegador ──► Equipo C (nginx :8080) ──/api──► Equipo B (API :3000) ──► Equipo A (MySQL :3306)
```

## 0. Antes de empezar
1. Los tres equipos deben estar en la **misma red** (mismo wifi o punto de acceso del celular).
   Algunas redes de salón o universidad aíslan los equipos entre sí; si no se ven, usen el punto de acceso de un celular.
2. Los tres necesitan **Docker Desktop** y **Git**.
3. En cada equipo, clonen el repositorio y copien esta carpeta (`tres-equipos`) **en la raíz del repositorio**:
   ```
   git clone https://github.com/moraescobarceleste/codigo-de-rastreo-ambiental.git
   ```
   Debe quedar así: `codigo-de-rastreo-ambiental/tres-equipos/equipo-A-base-de-datos/...`
4. En cada equipo, averigüen su IP: abran PowerShell y escriban `ipconfig`. Busquen **Dirección IPv4**
   (algo como `192.168.1.10`). Anótenlas:
   - IP del equipo A: ____________
   - IP del equipo B: ____________
   - IP del equipo C: ____________
5. En la red, la IP puede cambiar si el equipo se reinicia o se vuelve a conectar. Si algo deja de funcionar, revisen primero las IP.

## 1. Abrir los puertos en el Firewall de Windows
En cada equipo, abran **PowerShell como administrador** y ejecuten **solo la línea de su equipo**:

```powershell
# Equipo A
New-NetFirewallRule -DisplayName "Rastreo MySQL 3306" -Direction Inbound -Protocol TCP -LocalPort 3306 -Action Allow
# Equipo B
New-NetFirewallRule -DisplayName "Rastreo API 3000" -Direction Inbound -Protocol TCP -LocalPort 3000 -Action Allow
# Equipo C
New-NetFirewallRule -DisplayName "Rastreo Web 8080" -Direction Inbound -Protocol TCP -LocalPort 8080 -Action Allow
```

Si Windows pregunta por el tipo de red, elijan **Red privada**.

## 2. Equipo A: base de datos (se enciende primero)
```powershell
cd tres-equipos\equipo-A-base-de-datos
copy .env.example .env        # editen .env y cambien DB_PASSWORD
docker compose up -d
docker compose ps             # debe decir "healthy"
```

## 3. Equipo B: backend
```powershell
cd tres-equipos\equipo-B-backend
copy .env.example .env
```
Editen `.env`:
- `DB_HOST` = IP del equipo A
- `DB_PASSWORD` = la misma contraseña del equipo A
- `CLIENT_URL` = `http://IP_DEL_EQUIPO_C:8080`
- `SESSION_SECRET` = un texto largo y aleatorio

```powershell
docker compose up -d --build
docker compose logs -f backend      # esperen: "Base de datos lista" y "API ... ejecutándose"
```

## 4. Equipo C: frontend
```powershell
cd tres-equipos\equipo-C-frontend
copy .env.example .env
```
Editen `.env`: `BACKEND_HOST` = IP del equipo B.

```powershell
docker compose up -d --build
```

## 5. Pruebas (para mostrar en clase)

| # | Dónde | Qué hacer | Resultado esperado |
|---|---|---|---|
| 1 | Equipo B | `Test-NetConnection IP_A -Port 3306` | `TcpTestSucceeded : True` |
| 2 | Equipo C | `Test-NetConnection IP_B -Port 3000` | `TcpTestSucceeded : True` |
| 3 | Cualquier equipo | Navegador: `http://IP_B:3000/api/health` | `{"ok":true,"message":"API funcionando"}` |
| 4 | Cualquier equipo o celular | Navegador: `http://IP_C:8080` | Se ve la página de Rastreo Ambiental |
| 5 | Desde el navegador | Registrar un ciudadano e iniciar sesión | Entra al panel |
| 6 | Equipo A | `docker exec -it rastreo-db mysql -uroot -p` y luego `USE rastreo_ambiental; SELECT * FROM usuario;` | Aparece el usuario recién registrado |
| 7 | Cada equipo | `docker ps` | Se ve el contenedor de ese equipo corriendo |

La prueba 6 es la más importante: demuestra que lo que se hizo en el equipo C pasó por el B y quedó guardado en el A.

## 6. Crear la cuenta de administrador
El registro público solo crea ciudadanos. Para crear un administrador, en el equipo B agreguen
`ALLOW_PRIVILEGED_SIGNUP=true` a `environment:` en su `docker-compose.yml`, reinicien con
`docker compose up -d`, registren la cuenta, y **quiten esa línea** y vuelvan a reiniciar.

## 7. Problemas frecuentes

| Síntoma | Causa probable | Solución |
|---|---|---|
| El backend se reinicia en bucle | No alcanza la base de datos | Prueba 1; revisen `DB_HOST`, la contraseña y el firewall del equipo A |
| La página abre pero el login falla | nginx no llega al backend | Prueba 2; revisen `BACKEND_HOST` y el firewall del equipo B |
| Error de CORS en el navegador | `CLIENT_URL` no coincide | Debe ser exactamente `http://IP_C:8080`, sin barra final |
| Inicia sesión pero la sesión no se mantiene | Se abrió la API directo en vez de por el equipo C | Usen siempre `http://IP_C:8080` para la página |
| Los equipos no se ven entre sí | La red aísla los dispositivos | Usen el punto de acceso de un celular |
| Dejó de funcionar tras reiniciar | Cambiaron las IP | Revisen con `ipconfig` y actualicen los `.env` |

## 8. Apagar todo
```powershell
docker compose down        # en cada equipo (conserva los datos de la base)
docker compose down -v     # SOLO en el equipo A, si quieren borrar también los datos
```
