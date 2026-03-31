import { Request, Response } from "express";
import {
  getRestockQueueService,
  restockProductService,
  removeFromQueueService,
} from "../services/restockServices";

export const getRestockQueue = async (req: Request, res: Response) => {
  try {
    const data = await getRestockQueueService();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const restockProduct = async (req: Request, res: Response) => {
  try {
    const { productId, quantity } = req.body;

    const product = await restockProductService(productId, quantity);

    res.json({
      message: "Product restocked successfully",
      product,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFromQueue = async (req: Request, res: Response) => {
  try {
    const productId = Array.isArray(req.params.productId)
      ? req.params.productId[0]
      : req.params.productId;

    await removeFromQueueService(productId);

    res.json({ message: "Removed from restock queue" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
