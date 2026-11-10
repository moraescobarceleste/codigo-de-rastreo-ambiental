import { Router } from "express";
import * as auth from "../controllers/auth.controller.js";

const router = Router();

router.post("/login", auth.login);
router.post("/register", auth.register);
router.post("/logout", auth.logout);
router.get("/session", auth.session);

export default router;
