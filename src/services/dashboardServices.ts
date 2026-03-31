import { Order } from "../models/order";
import Product from "../models/product";

export const getDashboardStats = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Total orders today
  const totalOrdersToday = await Order.countDocuments({
    createdAt: { $gte: today },
  });

  // Revenue today (only confirmed, shipped, delivered)
  const revenueTodayAgg = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: today },
        status: { $in: ["Confirmed", "Shipped", "Delivered"] },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$totalPrice" },
      },
    },
  ]);

  const revenueToday = revenueTodayAgg[0]?.total || 0;

  // Pending vs Completed
  const pendingOrders = await Order.countDocuments({
    status: "Pending",
  });

  const completedOrders = await Order.countDocuments({
    status: { $in: ["Delivered"] },
  });

  // Low stock products
  const lowStockProducts = await Product.countDocuments({
    $expr: { $lt: ["$stock", "$minStockThreshold"] },
  });

  return {
    totalOrdersToday,
    revenueToday,
    pendingOrders,
    completedOrders,
    lowStockProducts,
  };
};
