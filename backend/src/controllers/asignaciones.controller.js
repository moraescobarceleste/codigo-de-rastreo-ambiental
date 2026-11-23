import * as service from "../services/asignaciones.service.js";
import { HttpError } from "../middlewares/httpError.js";
import { oneOf, parseId } from "../utils/validate.js";

const ESTADOS = ["programada", "en_curso", "completada", "cancelada"];

export async function listar(req, res) {
  const { id_usuario, tipo_usuario } = req.session.user;
  if (tipo_usuario === "conductor") {
    const idConductor = await service.idConductorDeUsuario(id_usuario);
    return res.json({ asignaciones: idConductor ? await service.listar({ idConductor }) : [] });
  }
  res.json({ asignaciones: await service.listar() });
}

export async function crear(req, res) {
  const fecha = String(req.body.fecha ?? "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha) || Number.isNaN(Date.parse(fecha))) {
    throw new HttpError(400, "La fecha debe tener el formato AAAA-MM-DD.");
  }
  const datos = {
    id_ruta: parseId(req.body.id_ruta, "id de ruta"),
    id_camion: parseId(req.body.id_camion, "id de camión"),
    id_conductor: parseId(req.body.id_conductor, "id de conductor"),
    fecha,
  };
  const asignacion = await service.crear(datos, req.session.user.id_usuario);
  res.status(201).json({ asignacion });
}

export async function cambiarEstado(req, res) {
  const id = parseId(req.params.id);
  const estado = oneOf(req.body.estado, ESTADOS, "estado");

  // Un conductor solo puede actualizar sus propias asignaciones
  const { id_usuario, tipo_usuario } = req.session.user;
  if (tipo_usuario === "conductor") {
    const propia = await service.obtener(id);
    const idConductor = await service.idConductorDeUsuario(id_usuario);
    if (propia.id_conductor !== idConductor) {
      throw new HttpError(403, "Solo puedes actualizar tus propias asignaciones.");
    }
  }
  res.json({ asignacion: await service.cambiarEstado(id, estado) });
}

export async function eliminar(req, res) {
  await service.eliminar(parseId(req.params.id));
  res.json({ message: "Asignación eliminada." });
}
