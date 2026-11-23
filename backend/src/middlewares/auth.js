import { HttpError } from "./httpError.js";

/** Exige una sesión iniciada (cookie validada por el servidor). */
export function requireAuth(req, _res, next) {
  if (!req.session?.user) {
    throw new HttpError(401, "Debes iniciar sesión.");
  }
  next();
}

/** Exige que el usuario de la sesión tenga alguno de los roles indicados. */
export function requireRole(...roles) {
  return (req, _res, next) => {
    const user = req.session?.user;
    if (!user) throw new HttpError(401, "Debes iniciar sesión.");
    if (!roles.includes(user.tipo_usuario)) {
      throw new HttpError(403, "No tienes permisos para realizar esta acción.");
    }
    next();
  };
}
