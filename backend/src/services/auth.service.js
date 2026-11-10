import bcrypt from "bcryptjs";
import { pool } from "../config/db.js";
import { HttpError } from "../middlewares/httpError.js";

export async function autenticar(correo, password) {
  const [rows] = await pool.execute(
    "SELECT id_usuario, nombre, password, tipo_usuario FROM usuario WHERE correo = ? LIMIT 1",
    [correo]
  );
  const usuario = rows[0];

  if (!usuario) throw new HttpError(401, "Correo no encontrado.");

  const valida = await bcrypt.compare(password, usuario.password);
  if (!valida) throw new HttpError(401, "Contraseña incorrecta.");

  return {
    id_usuario: usuario.id_usuario,
    nombre: usuario.nombre,
    tipo_usuario: usuario.tipo_usuario,
  };
}

export async function registrarUsuario(datos) {
  const {
    nombre, apellido, correo, password, telefono, direccion, tipo_usuario,
    num_documento, licencia, vehiculo_asignado, cargo, dependencia, nivel_acceso,
  } = datos;

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [existentes] = await connection.execute(
      "SELECT id_usuario FROM usuario WHERE correo = ? LIMIT 1",
      [correo]
    );
    if (existentes.length) throw new HttpError(409, "El correo ya está registrado.");

    const passwordHash = await bcrypt.hash(password, 10);

    const [resultado] = await connection.execute(
      `INSERT INTO usuario
       (nombre, apellido, correo, password, telefono, direccion, tipo_usuario)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nombre, apellido, correo, passwordHash, telefono || null, direccion || null, tipo_usuario]
    );
    const idUsuario = resultado.insertId;

    if (tipo_usuario === "ciudadano") {
      await connection.execute("INSERT INTO ciudadano (id_usuario) VALUES (?)", [idUsuario]);
    }

    if (tipo_usuario === "funcionario") {
      await connection.execute(
        "INSERT INTO funcionario (id_usuario, cargo, dependencia) VALUES (?, ?, ?)",
        [idUsuario, cargo || null, dependencia || null]
      );
    }

    if (tipo_usuario === "administrador") {
      await connection.execute(
        "INSERT INTO administrador (id_usuario, nivel_acceso) VALUES (?, ?)",
        [idUsuario, nivel_acceso || "basico"]
      );
    }

    if (tipo_usuario === "conductor") {
      await connection.execute(
        "INSERT INTO conductor (id_usuario, num_documento, licencia, vehiculo_asignado) VALUES (?, ?, ?, ?)",
        [idUsuario, num_documento || null, licencia || null, vehiculo_asignado || null]
      );
    }

    await connection.commit();
    return idUsuario;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
