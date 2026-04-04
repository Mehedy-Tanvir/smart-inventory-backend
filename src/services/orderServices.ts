import Product from "../models/product";
import { Order } from "../models/order";
import { RestockQueue } from "../models/restock_queue";
import { handleRestockQueue } from "./restockServices";
import { logActivity } from "./activityLogServices";

// constants to avoid string bugs
export const ORDER_STATUS = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
} as const;

// Create Order
export const createOrderService = async (payload: any) => {
  const { customerName, products } = payload;

  if (!products || products.length === 0) {
    throw new Error("Order must contain at least one product");
  }

  // Prevent duplicate products
  const productIds = products.map((p: any) => p.productId.toString());
  if (new Set(productIds).size !== productIds.length) {
    throw new Error("Duplicate products in order");
  }

  let totalPrice = 0;

  for (const item of products) {
    const product = await Product.findById(item.productId);

    if (!product) throw new Error("Product not found");

    // Prevent inactive product
    if (product.status !== "Active") {
      throw new Error(`${product.name} is currently unavailable`);
    }

    // Stock check
    if (product.stock < item.quantity) {
      throw new Error(
        `Only ${product.stock} items available for ${product.name}`,
      );
    }

    item.price = product.price;
    totalPrice += product.price * item.quantity;
  }

  const order = await Order.create({
    customerName,
    products,
    totalPrice,
    status: ORDER_STATUS.PENDING,
  });

  await logActivity(`Order created for ${order.customerName}`);

  return order;
};

// Confirm order
export const confirmOrderService = async (orderId: string) => {
  const order = await Order.findById(orderId);

  if (!order) throw new Error("Order not found");

  if (order.status !== ORDER_STATUS.PENDING) {
    throw new Error("Only pending orders can be confirmed");
  }

  for (const item of order.products) {
    const product = await Product.findById(item.productId);

    if (!product) continue;

    // Deduct stock
    product.stock -= item.quantity;

    // Update product status
    if (product.stock === 0) {
      product.status = "Out of Stock";
    }

    await product.save();
    await handleRestockQueue(product._id.toString());
    await logActivity(`Stock updated for "${product.name}"`);
  }

  order.status = ORDER_STATUS.CONFIRMED;
  await order.save();
  await logActivity(`Order ${order._id} confirmed`);

  return order;
};

// Ship order
export const shipOrderService = async (orderId: string) => {
  const order = await Order.findById(orderId);

  if (!order) throw new Error("Order not found");

  if (order.status !== ORDER_STATUS.CONFIRMED) {
    throw new Error("Only confirmed orders can be shipped");
  }

  order.status = ORDER_STATUS.SHIPPED;
  await order.save();

  await logActivity(`Order ${order._id} marked as Shipped`);

  return order;
};

// Deliver order
export const deliverOrderService = async (orderId: string) => {
  const order = await Order.findById(orderId);

  if (!order) throw new Error("Order not found");

  if (order.status !== ORDER_STATUS.SHIPPED) {
    throw new Error("Only shipped orders can be delivered");
  }

  order.status = ORDER_STATUS.DELIVERED;
  await order.save();

  await logActivity(`Order ${order._id} marked as Delivered`);

  return order;
};

// Cancel order
export const cancelOrderService = async (orderId: string) => {
  const order = await Order.findById(orderId);

  if (!order) throw new Error("Order not found");

  if (order.status === ORDER_STATUS.CANCELLED) {
    throw new Error("Order already cancelled");
  }

  // Restore stock only if confirmed
  if (order.status === ORDER_STATUS.CONFIRMED) {
    for (const item of order.products) {
      const product = await Product.findById(item.productId);

      if (!product) continue;

      product.stock += item.quantity;

      if (product.stock > 0) {
        product.status = "Active";
      }

      await product.save();
    }
  }

  order.status = ORDER_STATUS.CANCELLED;
  await order.save();

  await logActivity(`Order ${order._id} cancelled`);

  return order;
};

// Get all orders
export const getOrdersService = async () => {
  return Order.find().populate("products.productId").sort({ createdAt: -1 });
};

// Get order by ID
export const getOrderByIdService = async (id: string) => {
  const order = await Order.findById(id).populate("products.productId");

  if (!order) throw new Error("Order not found");

  return order;
};
