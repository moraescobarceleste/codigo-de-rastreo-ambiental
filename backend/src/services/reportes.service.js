import { pool } from "../config/db.js";
import { HttpError } from "../middlewares/httpError.js";

const SELECT = `
  SELECT rp.*, CONCAT(u.nombre, ' ', u.apellido) AS ciudadano
  FROM reporte rp
  JOIN ciudadano c ON c.id_ciudadano = rp.id_ciudadano
  JOIN usuario u ON u.id_usuario = c.id_usuario`;

export async function idCiudadanoDeUsuario(idUsuario) {
  const [rows] = await pool.execute("SELECT id_ciudadano FROM ciudadano WHERE id_usuario = ?", [idUsuario]);
  return rows[0]?.id_ciudadano ?? null;
}

export async function idFuncionarioDeUsuario(idUsuario) {
  const [rows] = await pool.execute("SELECT id_funcionario FROM funcionario WHERE id_usuario = ?", [idUsuario]);
  return rows[0]?.id_funcionario ?? null;
}

export async function listar({ idCiudadano } = {}) {
  const [rows] = idCiudadano
    ? await pool.execute(`${SELECT} WHERE rp.id_ciudadano = ? ORDER BY rp.fecha_creacion DESC`, [idCiudadano])
    : await pool.execute(`${SELECT} ORDER BY rp.fecha_creacion DESC`);
  return rows;
}

export async function obtener(id) {
  const [rows] = await pool.execute(`${SELECT} WHERE rp.id_reporte = ?`, [id]);
  if (!rows[0]) throw new HttpError(404, "Reporte no encontrado.");
  return rows[0];
}

export async function crear(idCiudadano, { tipo, descripcion, direccion, latitud, longitud }) {
  const [r] = await pool.execute(
    `INSERT INTO reporte (id_ciudadano, tipo, descripcion, direccion, latitud, longitud)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [idCiudadano, tipo, descripcion, direccion, latitud, longitud]
  );
  return obtener(r.insertId);
}

export async function cambiarEstado(id, estado, idFuncionario) {
  const [r] = await pool.execute(
    "UPDATE reporte SET estado = ?, id_funcionario = COALESCE(?, id_funcionario) WHERE id_reporte = ?",
    [estado, idFuncionario, id]
  );
  if (!r.affectedRows) throw new HttpError(404, "Reporte no encontrado.");
  return obtener(id);
}
