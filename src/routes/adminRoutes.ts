import { Router } from "express";
import { getAllUsers, promoteToAdmin } from "../controllers/userController";
import { isAdmin } from "../middleware/authMiddleware";
const router = Router();

router.get("/users", isAdmin, getAllUsers);
router.patch("/users/:userId/promote", isAdmin, promoteToAdmin);

export default router;
