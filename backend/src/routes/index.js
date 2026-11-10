import { Router } from "express";
import authRoutes from "./auth.routes.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ ok: true, message: "API funcionando" });
});

// Las rutas de auth se mantienen en /api/login, /api/register, etc.
router.use("/", authRoutes);

// Aquí se irán montando los nuevos módulos:
// router.use("/camiones", camionesRoutes);
// router.use("/rutas", rutasRoutes);

export default router;
