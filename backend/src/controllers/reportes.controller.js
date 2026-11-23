import * as service from "../services/reportes.service.js";
import { HttpError } from "../middlewares/httpError.js";
import { oneOf, optionalNumber, parseId, requireText } from "../utils/validate.js";

const TIPOS = ["acumulacion", "recoleccion_omitida", "punto_critico", "otro"];
const ESTADOS = ["recibido", "en_revision", "resuelto", "descartado"];

export async function listar(req, res) {
  const { id_usuario, tipo_usuario } = req.session.user;
  if (tipo_usuario === "ciudadano") {
    // Un ciudadano solo ve sus propios reportes
    const idCiudadano = await service.idCiudadanoDeUsuario(id_usuario);
    return res.json({ reportes: idCiudadano ? await service.listar({ idCiudadano }) : [] });
  }
  res.json({ reportes: await service.listar() });
}

export async function crear(req, res) {
  const idCiudadano = await service.idCiudadanoDeUsuario(req.session.user.id_usuario);
  if (!idCiudadano) throw new HttpError(403, "Tu cuenta no tiene perfil de ciudadano.");

  const reporte = await service.crear(idCiudadano, {
    tipo: oneOf(req.body.tipo ?? "otro", TIPOS, "tipo"),
    descripcion: requireText(req.body.descripcion, "descripcion", { max: 1000 }),
    direccion: requireText(req.body.direccion, "direccion"),
    latitud: optionalNumber(req.body.latitud, "latitud", { min: -90, max: 90 }),
    longitud: optionalNumber(req.body.longitud, "longitud", { min: -180, max: 180 }),
  });
  res.status(201).json({ reporte });
}

export async function cambiarEstado(req, res) {
  const { id_usuario, tipo_usuario } = req.session.user;
  const estado = oneOf(req.body.estado, ESTADOS, "estado");
  const idFuncionario = tipo_usuario === "funcionario" ? await service.idFuncionarioDeUsuario(id_usuario) : null;
  res.json({ reporte: await service.cambiarEstado(parseId(req.params.id), estado, idFuncionario) });
}
