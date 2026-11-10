import { HttpError } from "./httpError.js";

export function notFound(_req, res) {
  res.status(404).json({ message: "Ruta no encontrada." });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(error, _req, res, _next) {
  if (error instanceof HttpError) {
    return res.status(error.status).json({ message: error.message });
  }
  console.error(error);
  res.status(500).json({ message: "Error interno del servidor." });
}
