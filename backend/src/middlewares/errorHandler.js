import { HttpError } from "./httpError.js";

export function notFound(_req, res) {
  res.status(404).json({ message: "Ruta no encontrada." });
}

/** Traduce errores de integridad de MySQL a respuestas claras para el usuario. */
function mapDbError(error) {
  switch (error.code) {
    case "ER_DUP_ENTRY":
      return new HttpError(409, "Ya existe un registro con esos datos.");
    case "ER_ROW_IS_REFERENCED_2":
      return new HttpError(409, "No se puede eliminar: tiene registros asociados.");
    case "ER_NO_REFERENCED_ROW_2":
      return new HttpError(400, "Uno de los elementos relacionados no existe.");
    default:
      return null;
  }
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(error, _req, res, _next) {
  const mapped = error instanceof HttpError ? error : mapDbError(error);
  if (mapped) {
    return res.status(mapped.status).json({ message: mapped.message });
  }
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ message: "El cuerpo de la solicitud no es un JSON válido." });
  }
  console.error(error);
  res.status(500).json({ message: "Error interno del servidor." });
}
