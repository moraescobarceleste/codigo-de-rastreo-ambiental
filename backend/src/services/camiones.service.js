import { pool } from "../config/db.js";
import { HttpError } from "../middlewares/httpError.js";

export async function listar() {
  const [rows] = await pool.execute("SELECT * FROM camion ORDER BY id_camion DESC");
  return rows;
}

export async function crear({ placa, modelo, capacidad_kg, estado }) {
  const [r] = await pool.execute(
    "INSERT INTO camion (placa, modelo, capacidad_kg, estado) VALUES (?, ?, ?, ?)",
    [placa, modelo, capacidad_kg, estado]
  );
  return obtener(r.insertId);
}

export async function obtener(id) {
  const [rows] = await pool.execute("SELECT * FROM camion WHERE id_camion = ?", [id]);
  if (!rows[0]) throw new HttpError(404, "Camión no encontrado.");
  return rows[0];
}

export async function actualizar(id, { placa, modelo, capacidad_kg, estado }) {
  const [r] = await pool.execute(
    "UPDATE camion SET placa = ?, modelo = ?, capacidad_kg = ?, estado = ? WHERE id_camion = ?",
    [placa, modelo, capacidad_kg, estado, id]
  );
  if (!r.affectedRows) throw new HttpError(404, "Camión no encontrado.");
  return obtener(id);
}

export async function eliminar(id) {
  const [r] = await pool.execute("DELETE FROM camion WHERE id_camion = ?", [id]);
  if (!r.affectedRows) throw new HttpError(404, "Camión no encontrado.");
}
