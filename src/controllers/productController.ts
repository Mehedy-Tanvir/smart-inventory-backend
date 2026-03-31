import { Request, Response } from "express";
import category from "../models/category";
import Product from "../models/product";
import { logActivity } from "../services/activityLogServices";

// Create product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, categoryId, price, stock, minStockThreshold } = req.body;

    const categoryExists = await category.findById(categoryId);
    if (!categoryExists)
      return res.status(400).json({ message: "Category not found" });

    const status = stock <= 0 ? "Out of Stock" : "Active";

    const product = new Product({
      name,
      categoryId,
      price,
      stock,
      minStockThreshold,
      status,
    });
    await product.save();

    await logActivity(`Product "${product.name}" created`);

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update product
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, categoryId, price, stock, minStockThreshold } = req.body;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.name = name ?? product.name;
    product.categoryId = categoryId ?? product.categoryId;
    product.price = price ?? product.price;
    product.stock = stock ?? product.stock;
    product.minStockThreshold = minStockThreshold ?? product.minStockThreshold;

    product.status = product.stock <= 0 ? "Out of Stock" : "Active";

    await product.save();
    await logActivity(`Product "${product.name}" updated`);
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Fetch all products
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find().populate("categoryId", "name");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
