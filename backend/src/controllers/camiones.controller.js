import * as service from "../services/camiones.service.js";
import { HttpError } from "../middlewares/httpError.js";
import { optionalNumber, oneOf, parseId, requireText } from "../utils/validate.js";

const ESTADOS = ["activo", "mantenimiento", "inactivo"];
// Placa colombiana de vehículo de servicio: 3 letras + 3 números (ej. ABC123)
const PLACA = /^[A-Z]{3}\d{3}$/;

function leerCuerpo(body) {
  const placa = requireText(body.placa, "placa", { max: 10 }).toUpperCase();
  if (!PLACA.test(placa)) throw new HttpError(400, "La placa debe tener el formato ABC123.");
  return {
    placa,
    modelo: requireText(body.modelo, "modelo", { max: 100 }),
    capacidad_kg: optionalNumber(body.capacidad_kg, "capacidad_kg", { min: 1 }),
    estado: oneOf(body.estado ?? "activo", ESTADOS, "estado"),
  };
}

export async function listar(_req, res) {
  res.json({ camiones: await service.listar() });
}

export async function crear(req, res) {
  res.status(201).json({ camion: await service.crear(leerCuerpo(req.body)) });
}

export async function actualizar(req, res) {
  const camion = await service.actualizar(parseId(req.params.id), leerCuerpo(req.body));
  res.json({ camion });
}

export async function eliminar(req, res) {
  await service.eliminar(parseId(req.params.id));
  res.json({ message: "Camión eliminado." });
}
