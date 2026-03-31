import express from "express";
import {
  cancelOrder,
  confirmOrder,
  createOrder,
  getOrderById,
  getOrders,
} from "../controllers/orderController";

const router = express.Router();

router.post("/", createOrder);
router.get("/", getOrders);
router.get("/:id", getOrderById);

router.patch("/:id/confirm", confirmOrder);
router.patch("/:id/cancel", cancelOrder);

export default router;
