import { Router } from "express";
import authRoutes from "./auth.routes.js";
import camionesRoutes from "./camiones.routes.js";
import rutasRoutes from "./rutas.routes.js";
import asignacionesRoutes from "./asignaciones.routes.js";
import reportesRoutes from "./reportes.routes.js";
import conductoresRoutes from "./conductores.routes.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ ok: true, message: "API funcionando" });
});

// Las rutas de auth se mantienen en /api/login, /api/register, etc.
router.use("/", authRoutes);

// Módulos operativos (cada uno valida sesión y rol en su propio router)
router.use("/camiones", camionesRoutes);
router.use("/rutas", rutasRoutes);
router.use("/asignaciones", asignacionesRoutes);
router.use("/reportes", reportesRoutes);
router.use("/conductores", conductoresRoutes);

export default router;
