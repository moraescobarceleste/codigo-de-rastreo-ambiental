import { Router } from "express";
import * as c from "../controllers/camiones.controller.js";
import { requireRole } from "../middlewares/auth.js";

const router = Router();

router.get("/", requireRole("administrador", "funcionario"), c.listar);
router.post("/", requireRole("administrador"), c.crear);
router.put("/:id", requireRole("administrador"), c.actualizar);
router.delete("/:id", requireRole("administrador"), c.eliminar);

export default router;
