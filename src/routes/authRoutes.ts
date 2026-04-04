import { Router } from "express";
import { signup, login, verifyToken } from "../controllers/authController";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/verify-token", verifyToken);

export default router;
