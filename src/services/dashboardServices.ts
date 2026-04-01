import { Order } from "../models/order";
import Product from "../models/product";

export const getDashboardStats = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dashboardData = await Order.aggregate([
    {
      $facet: {
        totalOrdersToday: [
          {
            $match: { createdAt: { $gte: today } },
          },
          { $count: "count" },
        ],
        revenueToday: [
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
        ],
        pendingOrders: [{ $match: { status: "Pending" } }, { $count: "count" }],
        completedOrders: [
          { $match: { status: "Delivered" } },
          { $count: "count" },
        ],
      },
    },
  ]);

  const stats = dashboardData[0] || {};

  const totalOrdersToday = stats.totalOrdersToday?.[0]?.count || 0;
  const revenueToday = stats.revenueToday?.[0]?.total || 0;
  const pendingOrders = stats.pendingOrders?.[0]?.count || 0;
  const completedOrders = stats.completedOrders?.[0]?.count || 0;
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
