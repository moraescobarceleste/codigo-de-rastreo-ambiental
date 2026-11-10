import * as authService from "../services/auth.service.js";
import { HttpError } from "../middlewares/httpError.js";
import { env } from "../config/env.js";

const ROLES = ["ciudadano", "funcionario", "administrador", "conductor"];

export async function login(req, res) {
  const { correo, password } = req.body;
  if (!correo || !password) {
    throw new HttpError(400, "Correo y contraseña son obligatorios.");
  }

  const user = await authService.autenticar(correo, password);
  req.session.user = user;

  res.json({ message: "Inicio de sesión correcto.", user });
}

export async function register(req, res) {
  const { nombre, apellido, correo, password, tipo_usuario } = req.body;
  if (!nombre || !apellido || !correo || !password || !tipo_usuario) {
    throw new HttpError(400, "Completa los campos obligatorios.");
  }

  if (!ROLES.includes(tipo_usuario)) {
    throw new HttpError(400, "Tipo de usuario no válido.");
  }
  // Evita que cualquiera se registre como administrador/funcionario/conductor
  if (tipo_usuario !== "ciudadano" && !env.allowPrivilegedSignup) {
    throw new HttpError(
      403,
      "El registro público solo permite ciudadanos. Las demás cuentas las crea un administrador."
    );
  }

  await authService.registrarUsuario(req.body);
  res.status(201).json({ message: "Registro realizado correctamente." });
}

export function logout(req, res) {
  req.session.destroy(() => {
    res.json({ message: "Sesión cerrada." });
  });
}

export function session(req, res) {
  res.json({ user: req.session.user || null });
}
