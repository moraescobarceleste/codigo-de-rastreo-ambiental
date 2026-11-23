import { pool } from "../config/db.js";

export async function listar() {
  const [rows] = await pool.execute(
    `SELECT d.id_conductor, CONCAT(u.nombre, ' ', u.apellido) AS nombre,
            u.correo, u.telefono, d.num_documento, d.licencia
     FROM conductor d JOIN usuario u ON u.id_usuario = d.id_usuario
     ORDER BY u.nombre`
  );
  return rows;
}
