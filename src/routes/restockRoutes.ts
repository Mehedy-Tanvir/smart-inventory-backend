import express from "express";
import {
  getRestockQueue,
  restockProduct,
  removeFromQueue,
} from "../controllers/restockController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", authMiddleware, getRestockQueue);
router.post("/restock", authMiddleware, restockProduct);
router.delete("/:productId", authMiddleware, removeFromQueue);

export default router;
