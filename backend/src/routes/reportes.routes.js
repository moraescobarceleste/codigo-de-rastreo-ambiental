import { Router } from "express";
import * as c from "../controllers/reportes.controller.js";
import { requireRole } from "../middlewares/auth.js";

const router = Router();

router.get("/", requireRole("ciudadano", "funcionario", "administrador"), c.listar);
router.post("/", requireRole("ciudadano"), c.crear);
router.patch("/:id/estado", requireRole("funcionario", "administrador"), c.cambiarEstado);

export default router;
