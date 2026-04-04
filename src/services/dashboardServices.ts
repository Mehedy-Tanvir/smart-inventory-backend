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

  // Weekly stats (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const weeklyRaw = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: sevenDaysAgo },
      },
    },
    {
      $group: {
        _id: { $dayOfWeek: "$createdAt" },
        orders: { $sum: 1 },
        revenue: { $sum: "$totalPrice" },
      },
    },
  ]);
  const daysMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const weeklyStats = daysMap.map((day, index) => {
    const found = weeklyRaw.find((d) => d._id === index + 1);

    return {
      name: day,
      orders: found?.orders || 0,
      revenue: found?.revenue || 0,
    };
  });

  // Product summary (limit 5 for dashboard)
  const products = await Product.find({})
    .select("name stock minStockThreshold")
    .limit(5)
    .lean();

  const productSummary = products.map((p) => ({
    name: p.name,
    stock: p.stock,
    status:
      p.stock === 0
        ? "Out of Stock"
        : p.stock < p.minStockThreshold
          ? "Low Stock"
          : "OK",
  }));

  return {
    totalOrdersToday,
    revenueToday,
    pendingOrders,
    completedOrders,
    lowStockProducts,
    weeklyStats,
    productSummary,
  };
};
