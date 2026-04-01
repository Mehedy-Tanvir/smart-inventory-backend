import express from "express";
import {
  cancelOrder,
  confirmOrder,
  createOrder,
  deliverOrder,
  getOrderById,
  getOrders,
  shipOrder,
} from "../controllers/orderController";

const router = express.Router();

router.post("/", createOrder);
router.get("/", getOrders);
router.get("/:id", getOrderById);

router.patch("/:id/confirm", confirmOrder);
router.patch("/:id/ship", shipOrder);
router.patch("/:id/deliver", deliverOrder);
router.patch("/:id/cancel", cancelOrder);

export default router;
