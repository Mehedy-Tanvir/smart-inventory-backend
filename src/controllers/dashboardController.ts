import { Request, Response } from "express";
import { getDashboardStats } from "../services/dashboardServices";

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const data = await getDashboardStats();

    res.status(200).json({
      success: true,
      message: "Dashboard data fetched successfully",
      data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
