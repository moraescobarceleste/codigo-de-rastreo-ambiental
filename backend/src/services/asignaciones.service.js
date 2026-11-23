import { pool } from "../config/db.js";
import { HttpError } from "../middlewares/httpError.js";

const SELECT = `
  SELECT a.id_asignacion, a.fecha, a.estado,
         r.id_ruta, r.nombre AS ruta,
         c.id_camion, c.placa,
         d.id_conductor, CONCAT(u.nombre, ' ', u.apellido) AS conductor
  FROM asignacion_ruta a
  JOIN ruta r ON r.id_ruta = a.id_ruta
  JOIN camion c ON c.id_camion = a.id_camion
  JOIN conductor d ON d.id_conductor = a.id_conductor
  JOIN usuario u ON u.id_usuario = d.id_usuario`;

export async function idConductorDeUsuario(idUsuario) {
  const [rows] = await pool.execute("SELECT id_conductor FROM conductor WHERE id_usuario = ?", [idUsuario]);
  return rows[0]?.id_conductor ?? null;
}

export async function listar({ idConductor } = {}) {
  const [rows] = idConductor
    ? await pool.execute(`${SELECT} WHERE a.id_conductor = ? ORDER BY a.fecha DESC`, [idConductor])
    : await pool.execute(`${SELECT} ORDER BY a.fecha DESC`);
  return rows;
}

export async function obtener(id) {
  const [rows] = await pool.execute(`${SELECT} WHERE a.id_asignacion = ?`, [id]);
  if (!rows[0]) throw new HttpError(404, "Asignación no encontrada.");
  return rows[0];
}

export async function crear({ id_ruta, id_camion, id_conductor, fecha }, idUsuarioAsigna) {
  // Reglas de negocio: solo se asignan rutas activas y camiones operativos
  const [[ruta]] = await pool.execute("SELECT estado FROM ruta WHERE id_ruta = ?", [id_ruta]);
  if (!ruta) throw new HttpError(400, "La ruta no existe.");
  if (ruta.estado !== "activa") throw new HttpError(409, "La ruta está inactiva.");

  const [[camion]] = await pool.execute("SELECT estado FROM camion WHERE id_camion = ?", [id_camion]);
  if (!camion) throw new HttpError(400, "El camión no existe.");
  if (camion.estado !== "activo") throw new HttpError(409, "El camión no está disponible (mantenimiento o inactivo).");

  try {
    const [r] = await pool.execute(
      `INSERT INTO asignacion_ruta (id_ruta, id_camion, id_conductor, id_usuario_asigna, fecha)
       VALUES (?, ?, ?, ?, ?)`,
      [id_ruta, id_camion, id_conductor, idUsuarioAsigna, fecha]
    );
    return obtener(r.insertId);
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      throw new HttpError(409, "Ese camión o ese conductor ya tiene una ruta asignada en esa fecha.");
    }
    throw error;
  }
}

export async function cambiarEstado(id, estado) {
  const [r] = await pool.execute("UPDATE asignacion_ruta SET estado = ? WHERE id_asignacion = ?", [estado, id]);
  if (!r.affectedRows) throw new HttpError(404, "Asignación no encontrada.");
  return obtener(id);
}

export async function eliminar(id) {
  const [r] = await pool.execute("DELETE FROM asignacion_ruta WHERE id_asignacion = ?", [id]);
  if (!r.affectedRows) throw new HttpError(404, "Asignación no encontrada.");
}
