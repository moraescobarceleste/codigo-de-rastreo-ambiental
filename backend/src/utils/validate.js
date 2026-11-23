import { HttpError } from "../middlewares/httpError.js";

export function parseId(value, nombre = "id") {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    throw new HttpError(400, `El ${nombre} no es válido.`);
  }
  return id;
}

export function requireText(value, campo, { max = 255 } = {}) {
  const texto = typeof value === "string" ? value.trim() : "";
  if (!texto) throw new HttpError(400, `El campo "${campo}" es obligatorio.`);
  if (texto.length > max) throw new HttpError(400, `El campo "${campo}" supera ${max} caracteres.`);
  return texto;
}

export function optionalNumber(value, campo, { min, max } = {}) {
  if (value === undefined || value === null || value === "") return null;
  const n = Number(value);
  if (!Number.isFinite(n) || (min !== undefined && n < min) || (max !== undefined && n > max)) {
    throw new HttpError(400, `El campo "${campo}" no es válido.`);
  }
  return n;
}

export function oneOf(value, opciones, campo) {
  if (!opciones.includes(value)) {
    throw new HttpError(400, `El campo "${campo}" debe ser uno de: ${opciones.join(", ")}.`);
  }
  return value;
}
