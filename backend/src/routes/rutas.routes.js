import { Router } from "express";
import * as c from "../controllers/rutas.controller.js";
import { requireAuth, requireRole } from "../middlewares/auth.js";

const router = Router();

// Cualquier usuario con sesión puede consultar rutas; solo admin/funcionario las gestionan
router.get("/", requireAuth, c.listar);
router.get("/:id", requireAuth, c.obtener);
router.post("/", requireRole("administrador", "funcionario"), c.crear);
router.put("/:id", requireRole("administrador", "funcionario"), c.actualizar);
router.delete("/:id", requireRole("administrador"), c.eliminar);

export default router;
