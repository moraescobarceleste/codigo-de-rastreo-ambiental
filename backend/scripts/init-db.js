// Crea las tablas si no existen (idempotente). Se ejecuta antes de iniciar en producción.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mysql from "mysql2/promise";
import { env } from "../src/config/env.js";

const schemaPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "../database/schema.sql");
const sql = fs.readFileSync(schemaPath, "utf8");

const { database, ...conexion } = env.db;

const connection = await mysql.createConnection({
  ...conexion,
  // En local se crea la base si no existe; en la nube ya viene creada
  database: env.dbIsRemote ? database : undefined,
  multipleStatements: true,
});

try {
  if (!env.dbIsRemote) {
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    await connection.query(`USE \`${database}\``);
  }
  await connection.query(sql);
  console.log(`Base de datos lista (${database}).`);
} finally {
  await connection.end();
}
