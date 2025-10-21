import { Router } from "express";
import { registerController, loginController, meController } from "../controller/authController";

const router = Router();

// POST /register
router.post("/register", registerController);

// POST /login
router.post("/login", loginController);

// GET /me
router.get("/me", meController);

export default router;

