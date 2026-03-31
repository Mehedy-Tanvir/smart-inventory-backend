import { RestockQueue } from "../models/restock_queue";
import Product from "../models/product";
import { calculatePriority } from "../utils/calculatePriority";

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

  // Remove or update queue
  if (product.stock >= product.minStockThreshold) {
    await RestockQueue.findOneAndDelete({ productId });
  } else {
    await handleRestockQueue(productId);
  }

  return product;
};
export const removeFromQueueService = async (productId: string) => {
  return await RestockQueue.findOneAndDelete({ productId });
};
