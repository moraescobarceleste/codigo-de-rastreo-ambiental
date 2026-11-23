import * as service from "../services/rutas.service.js";
import { HttpError } from "../middlewares/httpError.js";
import { oneOf, optionalNumber, parseId, requireText } from "../utils/validate.js";

function leerCuerpo(body) {
  const puntos = body.puntos ?? [];
  if (!Array.isArray(puntos)) throw new HttpError(400, "Los puntos de la ruta deben ser una lista.");
  return {
    nombre: requireText(body.nombre, "nombre", { max: 100 }),
    descripcion: typeof body.descripcion === "string" ? body.descripcion.trim() || null : null,
    estado: oneOf(body.estado ?? "activa", ["activa", "inactiva"], "estado"),
    puntos: puntos.map((p) => ({
      direccion: requireText(p.direccion, "direccion del punto"),
      latitud: optionalNumber(p.latitud, "latitud", { min: -90, max: 90 }),
      longitud: optionalNumber(p.longitud, "longitud", { min: -180, max: 180 }),
    })),
  };
}

export async function listar(_req, res) {
  res.json({ rutas: await service.listar() });
}

export async function obtener(req, res) {
  res.json({ ruta: await service.obtener(parseId(req.params.id)) });
}

export async function crear(req, res) {
  res.status(201).json({ ruta: await service.crear(leerCuerpo(req.body)) });
}

export async function actualizar(req, res) {
  res.json({ ruta: await service.actualizar(parseId(req.params.id), leerCuerpo(req.body)) });
}

export async function eliminar(req, res) {
  await service.eliminar(parseId(req.params.id));
  res.json({ message: "Ruta eliminada." });
}
