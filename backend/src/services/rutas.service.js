import { pool } from "../config/db.js";
import { HttpError } from "../middlewares/httpError.js";

export async function listar() {
  const [rows] = await pool.execute(
    `SELECT r.*, COUNT(p.id_punto) AS total_puntos
     FROM ruta r LEFT JOIN punto_ruta p ON p.id_ruta = r.id_ruta
     GROUP BY r.id_ruta ORDER BY r.id_ruta DESC`
  );
  return rows;
}

export async function obtener(id) {
  const [rutas] = await pool.execute("SELECT * FROM ruta WHERE id_ruta = ?", [id]);
  if (!rutas[0]) throw new HttpError(404, "Ruta no encontrada.");
  const [puntos] = await pool.execute(
    "SELECT * FROM punto_ruta WHERE id_ruta = ? ORDER BY orden",
    [id]
  );
  return { ...rutas[0], puntos };
}

// Guarda la ruta y sus puntos en una sola transacción: o se guarda todo o nada.
async function guardarPuntos(connection, idRuta, puntos) {
  await connection.execute("DELETE FROM punto_ruta WHERE id_ruta = ?", [idRuta]);
  for (const [i, p] of puntos.entries()) {
    await connection.execute(
      "INSERT INTO punto_ruta (id_ruta, orden, direccion, latitud, longitud) VALUES (?, ?, ?, ?, ?)",
      [idRuta, i + 1, p.direccion, p.latitud, p.longitud]
    );
  }
}

export async function crear({ nombre, descripcion, estado, puntos }) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [r] = await connection.execute(
      "INSERT INTO ruta (nombre, descripcion, estado) VALUES (?, ?, ?)",
      [nombre, descripcion, estado]
    );
    await guardarPuntos(connection, r.insertId, puntos);
    await connection.commit();
    return obtener(r.insertId);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function actualizar(id, { nombre, descripcion, estado, puntos }) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [r] = await connection.execute(
      "UPDATE ruta SET nombre = ?, descripcion = ?, estado = ? WHERE id_ruta = ?",
      [nombre, descripcion, estado, id]
    );
    if (!r.affectedRows) throw new HttpError(404, "Ruta no encontrada.");
    await guardarPuntos(connection, id, puntos);
    await connection.commit();
    return obtener(id);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function eliminar(id) {
  const [r] = await pool.execute("DELETE FROM ruta WHERE id_ruta = ?", [id]);
  if (!r.affectedRows) throw new HttpError(404, "Ruta no encontrada.");
}
