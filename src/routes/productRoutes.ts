import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  createProduct,
  updateProduct,
  getProducts,
} from "../controllers/productController";

const router = Router();

router.post("/", authMiddleware, createProduct);
router.put("/:id", authMiddleware, updateProduct);
router.get("/", authMiddleware, getProducts);

export default router;
