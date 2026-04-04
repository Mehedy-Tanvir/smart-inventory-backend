import { getAllUsers, promoteToAdmin } from "../controllers/userController";
import { isAdmin } from "../middleware/authMiddleware";

import router from "./dashboardRoutes";

router.get("/users", isAdmin, getAllUsers);
router.patch("/users/:userId/promote", isAdmin, promoteToAdmin);
