import express from "express";
import {
  getRestockQueue,
  restockProduct,
  removeFromQueue,
} from "../controllers/restockController";

const router = express.Router();

router.get("/", getRestockQueue);
router.post("/restock", restockProduct);
router.delete("/:productId", removeFromQueue);

export default router;
