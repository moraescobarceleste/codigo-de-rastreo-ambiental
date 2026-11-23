import { Router } from "express";
import * as c from "../controllers/asignaciones.controller.js";
import { requireRole } from "../middlewares/auth.js";

const router = Router();

router.get("/", requireRole("administrador", "funcionario", "conductor"), c.listar);
router.post("/", requireRole("administrador", "funcionario"), c.crear);
router.patch("/:id/estado", requireRole("administrador", "funcionario", "conductor"), c.cambiarEstado);
router.delete("/:id", requireRole("administrador"), c.eliminar);

export default router;
