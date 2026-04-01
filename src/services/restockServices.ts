import { RestockQueue } from "../models/restock_queue";
import Product from "../models/product";
import { calculatePriority } from "../utils/calculatePriority";
import { logActivity } from "./activityLogServices";
import product from "../models/product";

export const handleRestockQueue = async (productId: string) => {
  const product = await Product.findById(productId);

  if (!product) throw new Error("Product not found");

  if (product.stock < product.minStockThreshold) {
    const priority = calculatePriority(
      product.stock,
      product.minStockThreshold,
    );

    const existing = await RestockQueue.findOne({ productId });

    if (existing) {
      existing.currentStock = product.stock;
      existing.priority = priority;
      await existing.save();
    } else {
      await RestockQueue.create({
        productId,
        currentStock: product.stock,
        priority,
      });
      await logActivity(`Product "${product.name}" added to restock queue`);
    }
  }
};

export const getRestockQueueService = async () => {
  return await RestockQueue.find()
    .populate("productId")
    .sort({ currentStock: 1 });
};

export const restockProductService = async (
  productId: string,
  quantity: number,
) => {
  const product = await Product.findById(productId);

  if (!product) throw new Error("Product not found");

  product.stock += quantity;

  // Update product status
  if (product.stock > 0) {
    product.status = "Active";
  }

  await product.save();
  await logActivity(`Product "${product.name}" restocked`);

  // Remove or update queue
  if (product.stock >= product.minStockThreshold) {
    await RestockQueue.findOneAndDelete({ productId });
  } else {
    await handleRestockQueue(productId);
  }

  return product;
};
export const removeFromQueueService = async (restockId: string) => {
  const restockEntry =
    await RestockQueue.findById(restockId).populate("productId");

  await RestockQueue.deleteOne({ _id: restockId });

  const productName =
    (restockEntry?.productId as any)?.name || "Unknown Product";
  await logActivity(`Restock entry of ${productName} removed from queue`);

  return restockEntry?.productId;
};
