import { Router } from "express";
import { getRecentActivities } from "../controllers/activityLogController";

const router = Router();

router.get("/", getRecentActivities);

export default router;
