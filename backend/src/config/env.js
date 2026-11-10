import dotenv from "dotenv";

dotenv.config({ quiet: true });

const isProduction = process.env.NODE_ENV === "production";

/**
 * Configuración de MySQL. Acepta, en este orden:
 *  1. MYSQL_URL / DATABASE_URL (cadena de conexión; Railway la entrega lista)
 *  2. MYSQLHOST, MYSQLPORT... (variables que crea Railway)
 *  3. DB_HOST, DB_PORT... (uso local)
 */
function readDbConfig() {
  const url = process.env.MYSQL_URL || process.env.DATABASE_URL;
  let base;

  if (url) {
    const u = new URL(url);
    base = {
      host: u.hostname,
      port: Number(u.port || 3306),
      user: decodeURIComponent(u.username),
      password: decodeURIComponent(u.password),
      database: u.pathname.replace(/^\//, ""),
    };
  } else {
    base = {
      host: process.env.MYSQLHOST || process.env.DB_HOST || "localhost",
      port: Number(process.env.MYSQLPORT || process.env.DB_PORT || 3306),
      user: process.env.MYSQLUSER || process.env.DB_USER || "root",
      password: process.env.MYSQLPASSWORD ?? process.env.DB_PASSWORD ?? "",
      database: process.env.MYSQLDATABASE || process.env.DB_NAME || "rastreo_ambiental",
    };
  }

  // Algunos proveedores (PlanetScale, Aiven, etc.) exigen SSL
  if (process.env.DB_SSL === "true") {
    base.ssl = { rejectUnauthorized: false };
  }
  // "remota" = base ya creada por el proveedor (Railway, etc.)
  return { config: base, remote: Boolean(url || process.env.MYSQLHOST) };
}

const db = readDbConfig();

const sessionSecret = process.env.SESSION_SECRET || "cambia-esta-clave";
if (isProduction && sessionSecret === "cambia-esta-clave") {
  throw new Error("Define SESSION_SECRET con un valor largo y aleatorio en producción.");
}

export const env = {
  isProduction,
  port: Number(process.env.PORT || 3000),
  // Uno o varios orígenes permitidos, separados por comas
  clientUrls: (process.env.CLIENT_URL || "http://localhost:5173")
    .split(",")
    .map((u) => u.trim().replace(/\/$/, ""))
    .filter(Boolean),
  sessionSecret,
  // En producción se permite el registro público solo de ciudadanos
  allowPrivilegedSignup: process.env.ALLOW_PRIVILEGED_SIGNUP === "true",
  db: db.config,
  dbIsRemote: db.remote,
};
