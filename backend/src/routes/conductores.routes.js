import { Router } from "express";
import * as c from "../controllers/conductores.controller.js";
import { requireRole } from "../middlewares/auth.js";

const router = Router();

router.get("/", requireRole("administrador", "funcionario"), c.listar);

export default router;
