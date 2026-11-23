import * as service from "../services/conductores.service.js";

export async function listar(_req, res) {
  res.json({ conductores: await service.listar() });
}
